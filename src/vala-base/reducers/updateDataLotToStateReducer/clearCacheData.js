/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 19/12/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import configStateKey from '../../../vala-base/configs/configStateKey';
import {EmptyMap, EmptyOrderedSet} from '../../utils/immutableHelper';

function doClearEdge(stateEdge, _itemIds, parentId) {
  if (
    !_itemIds ||
    _itemIds.size === 0 ||
    (stateEdge.getIn([parentId, 'itemIds']) &&
      stateEdge.getIn([parentId, 'itemIds']).size === _itemIds.size)
  ) {
    return stateEdge.delete(parentId);
  }
  return stateEdge.withMutations(st => {
    let maxScore = 0;
    let minScore = 0;
    const total = _itemIds
      ? _itemIds.size
      : stateEdge.getIn([parentId, 'total']);
    st.updateIn([parentId, 'itemIds'], itemIds => {
      if (itemIds) {
        const result = itemIds.filter(item => _itemIds.includes(item));
        const firstId = result.first();
        const lastId = result.last();
        if (firstId) {
          maxScore =
            stateEdge.getIn([parentId, 'items', firstId, 'score']) ||
            stateEdge.getIn([parentId, 'items', firstId, 'data', 'score']) ||
            0;
        }
        if (lastId) {
          minScore =
            stateEdge.getIn([parentId, 'items', lastId, 'score']) ||
            stateEdge.getIn([parentId, 'items', firstId, 'data', 'score']) ||
            0;
        }
        return result;
      }
      return EmptyOrderedSet;
    })
      .setIn([parentId, 'maxScore'], Number(maxScore))
      .setIn([parentId, 'minScore'], Number(minScore))
      .setIn([parentId, 'older204'], false)
      .setIn([parentId, 'total'], total)
      .setIn([parentId, 'newer204'], false)
      .updateIn([parentId, 'items'], items =>
        !items
          ? EmptyMap
          : items.withMutations(_items => {
              const [...key] = _items.keys();
              key.forEach(item => {
                if (!_itemIds.includes(item)) {
                  _items.delete(item);
                }
              });
            }),
      );
  });
}

function doClearObject(state, objectIds) {
  return state.withMutations(stateTmp => {
    objectIds.forEach(id => stateTmp.delete(id));
  });
}

const filterItemIds = (itemIds, number) => {
  let i = -1;
  if (!itemIds || itemIds.size === 0) {
    return EmptyOrderedSet;
  }
  return itemIds.filter(() => {
    i += 1;
    return number > i;
  });
};

function doGetItemIds(state, parentId, statePath) {
  return state.getIn([...statePath, parentId, 'itemIds']);
}

// Lọc các item cần xóa.
function getItemIdsRemove(state, itemIds, itemIdsIgnore, friendStateKey) {
  let itemIdsRemove =
    itemIds && itemIds.size > 0
      ? itemIds.filter(item => !itemIdsIgnore.includes(item))
      : EmptyOrderedSet;
  // Trường hợp 1 obj xuất hiện ở 2 cạnh khác nhau, k được xoá obj đó vì có thể nó vẫn xuất hiên ở cạnh kia
  if (friendStateKey) {
    for (let i = 0; i < friendStateKey.length; i += 1) {
      const objectFriend = state.get(friendStateKey[i]);
      const [...keys] = objectFriend.keys();
      for (let j = 0; j < keys.length; j += 1) {
        const _itemIds = state.getIn([friendStateKey[i]], keys[j], 'itemIds');
        itemIdsRemove = itemIdsRemove.filter(item => !_itemIds.includes(item));
      }
    }
  }
  return itemIdsRemove;
}

function doClearData(state, stateKey, parentId, minItem, specialParentId) {
  const {
    statePath,
    objectStateKey,
    friendStateKey,
    specialChildrenStateKey,
    childrenStateKey,
  } = configStateKey[stateKey];
  const itemIds = doGetItemIds(state, parentId, statePath);
  // Nếu size = 0 thì xóa luôn, nếu size > minItem thì giữ lại số lượng bản ghi = minItem
  if ((itemIds && itemIds.size === 0) || (itemIds && itemIds.size > minItem)) {
    const _itemIds = filterItemIds(itemIds, minItem);
    const itemIdRemove = getItemIdsRemove(
      state,
      itemIds,
      _itemIds,
      friendStateKey,
    );
    // Xóa cạnh và object của stateKey.
    const stateEdge = state.get(stateKey);
    const stateObject = state.get(objectStateKey);
    return state.withMutations(st => {
      st.set(stateKey, doClearEdge(stateEdge, _itemIds, parentId));
      if (objectStateKey) {
        st.set(objectStateKey, doClearObject(stateObject, itemIdRemove));
      }
      if (specialChildrenStateKey && specialChildrenStateKey.length > 0) {
        specialChildrenStateKey.map(itemSpChild => {
          const stateSpecialChild = st.get(itemSpChild);
          const _stateSpecialChild = stateSpecialChild.withMutations(
            _stSpChild => {
              itemIdRemove.map(itemRm => _stSpChild.delete(itemRm));
            },
          );
          st.set(itemSpChild, _stateSpecialChild);
          return null;
        });
      }
      if (childrenStateKey && childrenStateKey.length > 0) {
        itemIdRemove.map(itemRemove => {
          childrenStateKey.map(itemChildKey => {
            doClearData(st, itemChildKey, itemRemove, 0);
            return null;
          });
          return null;
        });
      }
      if (specialParentId) {
        const arrKey = Object.keys(specialParentId);
        arrKey.map(item => {
          const stateEdgeSp = st.get(item);
          st.set(item, doClearEdge(stateEdgeSp, itemIdRemove, item));
          return null;
        });
      }
    });
  }
  return state;
}

export default doClearData;
