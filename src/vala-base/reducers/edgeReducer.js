/* eslint-disable guard-for-in */
/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 17/10/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 *
 * Document:
 * - Mau action:
 *  const action = {entrySeq
 *      type: 'OBJECT_ADD',
 *      parentId: 92345234923341234,
 *      fakeId: 1341343242341341,
 *      getType: 'first|newer|older'
 *      payload: {
 *          // Goi tin chuan de gui thang len server duoc
 *      }
 *  };
 */

import {fromJS, OrderedSet} from 'immutable';

// action.
import {EDGE_ACTIONS} from './edgeReducerActions';

// reducer.
import createReducer from './createReducer';

// util.
import {GET_LIST_TYPE, ACTION_TYPE} from '../configs/Constants';
import {mergeDeepOverwriteLists, mergeDeep} from '../utils/immutable';
import {EmptyMap} from '../utils/immutableHelper';

// FROM SERVER

/*
 * FUNCTION
 */

// Check OfflineId
const isOfflineId = id => (id ? `${id}`.includes('-') : false);

// Tính toán ParentId theo dữ liệu trong condition.
const getQueryId = (parentId, condition) => {
  const {searchKey, mainStateKey, stateKey, searchStateKeys} = condition;
  const isMainStateKey = mainStateKey && mainStateKey === stateKey;
  const isSearchStateKey = searchStateKeys && searchStateKeys[stateKey];
  return isMainStateKey
    ? searchKey || parentId
    : isSearchStateKey
    ? searchStateKeys[stateKey]
    : parentId;
};

// Thêm mới cạnh và dữ liệu cạnh(edge).
const _add = (stateTmp, _parentId, id, data) => {
  if (stateTmp.has(_parentId)) {
    stateTmp.updateIn([_parentId, 'itemIds'], itemIds =>
      itemIds ? OrderedSet([id]).merge(itemIds) : OrderedSet([id]),
    );
  } else {
    stateTmp.setIn([_parentId, 'itemIds'], OrderedSet([id]));
  }
  return stateTmp.setIn([_parentId, 'items', id, 'data'], data);
};

// Thêm mới dữ liệu trong trường info.
const _addInfo = (state, _parentId, infoKey, infoData) =>
  state.setIn([_parentId, infoKey], infoData);

// Cập nhập dữ liệu trong trường info. => CuongNT: update la update đè.
const _updateInfo = (state, _parentId, infoKey, infoData) =>
  state.setIn([_parentId, infoKey], infoData);

// Cập nhập một phần dữ liệu trong trường info.
const _patchInfo = (state, _parentId, infoKey, infoData) =>
  state.updateIn([_parentId, infoKey], _infoData =>
    _infoData ? _infoData.merge(infoData) : infoData,
  );

// Cập nhập itemIds.
const _updateItemIds = (state, parentId, itemIds, condition) => {
  const {
    isMainStateKey,
    isSearchStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _minScoreNew,
    _maxScoreNew,
    stateKey,
    offlineId,
  } = condition;
  if (actionType === ACTION_TYPE.GET_LIST || actionType === ACTION_TYPE.GET) {
    // Nếu không phải list chính thì luôn cập nhập mới nhất. Để đảm bảo các list đi kèm sẽ luôn ở trạng thái mới nhất.
    if (
      !isMainStateKey &&
      !isSearchStateKey &&
      stateKey !== 'threadMessageIds'
    ) {
      return state.updateIn([parentId, 'itemIds'], () => itemIds);
    }
    return state.updateIn([parentId, 'itemIds'], itemIdsCur => {
      // Nếu hiện tại rỗng hoặc lấy First sẽ cập nhập nguyên list mới.
      if (!itemIdsCur || getType === GET_LIST_TYPE.FIRST) {
        return itemIds;
      }
      // Nếu lấy cũ hơn.
      if (getType === GET_LIST_TYPE.OLDER) {
        return itemIdsCur.merge(itemIds);
      }
      // Nếu lấy mới hơn từ cũ hơn trở lên.
      if (getType === GET_LIST_TYPE.NEWER) {
        if (stateKey === 'threadMessageIds') {
          return itemIds.reverse().merge(itemIdsCur);
        }
        return itemIds.merge(itemIdsCur);
      }
      // Nếu lấy mới hơn mới nhất (Mới nhất trở xuống).
      if (getType === GET_LIST_TYPE.NEWEST) {
        if (_minScoreNew > _maxScoreCur) {
          return itemIds;
        }
        // Trường hợp list cũ trùng một số phần tử với list mới.
        return itemIds.merge(itemIdsCur);
      }
      // Nếu lấy khoảng giữa (xung quanh) một tin.
      if (getType === GET_LIST_TYPE.MID) {
        // Trường hợp => document/getMid (2, 3).
        if (_maxScoreCur > _maxScoreNew && _maxScoreNew >= _minScoreCur) {
          return itemIdsCur.merge(itemIds);
        }
        // Trường hợp => document/getMid (1, 4).
        if (_maxScoreNew > _maxScoreCur && _maxScoreCur >= _minScoreNew) {
          return itemIds.merge(itemIdsCur);
        }
        // Trường hợp => document/getMid (5, 6).
        return itemIds;
      }
      return itemIdsCur;
    });
  }

  if (actionType === ACTION_TYPE.POST) {
    return state.updateIn([parentId, 'itemIds'], itemIdsCur => {
      if (itemIdsCur && itemIds) {
        // Added DamBV 1/6/2018 khong thuc hien hoan de vi tri tin nhan bi loi. Theo doi them.
        // TODO NamVH: cần hỏi thêm anh cuongnt. => check nếu thằng được add vào mà đã có trong list cũ rồi thì không merge vào nữa.
        // => với trường hợp post (tức là add mới vào)? tại sao lại gặp trường hợp là đã có rồi.
        if (
          itemIdsCur &&
          (itemIdsCur.includes(itemIds.first()) ||
            itemIdsCur.includes(offlineId))
        ) {
          return itemIdsCur;
        }
        return itemIds.union(itemIdsCur);
      }
      // TODO NamVH : chưa rõ tại sao code cũ lại ntn.
      if (itemIdsCur) {
        return itemIdsCur;
      }
      if (itemIds) {
        return itemIds;
      }
      return itemIdsCur;
    });
  }

  if (actionType === ACTION_TYPE.PUT) {
    // Nếu không phải list chính thì luôn cập nhập mới nhất. Để đảm bảo các list đi kèm sẽ luôn ở trạng thái mới nhất.
    if (!isMainStateKey && !isSearchStateKey) {
      return state.updateIn([parentId, 'itemIds'], () => itemIds);
    }
  }

  return state;
};

// Cập nhập items.
const _updateItems = (state, parentId, items, condition) => {
  // mergeDeepOverwriteLists()
  const {
    isMainStateKey,
    isSearchStateKey,
    isMergeStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _minScoreNew,
    _maxScoreNew,
    stateKey,
  } = condition;
  if (actionType === ACTION_TYPE.GET_LIST || actionType === ACTION_TYPE.GET) {
    // Nếu stateKey này thuộc loại merge thì merge luôn.
    if (isMergeStateKey) {
      return state.updateIn([parentId, 'items'], itemsCur =>
        mergeDeep(itemsCur, items),
      );
    }
    // Nếu không phải list chính thì luôn cập nhập mới nhất. Để đảm bảo các list đi kèm sẽ luôn ở trạng thái mới nhất.
    if (
      !isMainStateKey &&
      !isSearchStateKey &&
      stateKey !== 'threadMessageIds'
    ) {
      return state.updateIn([parentId, 'items'], () => items);
    }
    return state.updateIn([parentId, 'items'], itemsCur => {
      // Nếu hiện tại rỗng hoặc lấy First sẽ cập nhập nguyên list mới.
      if (!itemsCur || getType === GET_LIST_TYPE.FIRST) {
        if (items) {
          return items;
        }
        return EmptyMap;
      }
      // Nếu lấy cũ hơn.
      if (getType === GET_LIST_TYPE.OLDER) {
        return mergeDeepOverwriteLists(itemsCur, items);
      }
      // Nếu lấy mới hơn từ cũ hơn trở lên.
      if (getType === GET_LIST_TYPE.NEWER) {
        return mergeDeepOverwriteLists(itemsCur, items);
      }
      // Nếu lấy mới hơn mới nhất (Mới nhất trở xuống).
      if (getType === GET_LIST_TYPE.NEWEST) {
        if (_minScoreNew > _maxScoreCur) {
          return items;
        }
        // Trường hợp list cũ trùng một số phần tử với list mới.
        return mergeDeepOverwriteLists(itemsCur, items);
      }
      // Nếu lấy khoảng giữa (xung quanh) một tin.
      if (getType === GET_LIST_TYPE.MID) {
        // Trường hợp => document/getMid (2, 3).
        if (_maxScoreCur > _maxScoreNew && _maxScoreNew >= _minScoreCur) {
          return mergeDeepOverwriteLists(itemsCur, items);
        }
        // Trường hợp => document/getMid (1, 4).
        if (_maxScoreNew > _maxScoreCur && _maxScoreCur >= _minScoreNew) {
          return mergeDeepOverwriteLists(itemsCur, items);
        }
        // Trường hợp => document/getMid (5, 6).
        return items;
      }
      return itemsCur;
    });
  }

  if (actionType === ACTION_TYPE.POST || actionType === ACTION_TYPE.PUT) {
    return state.updateIn([parentId, 'items'], itemsCur => {
      // Fix tạm trường hợp muốn thay thế chứ ko phải merge
      if (isMergeStateKey) {
        return items || EmptyMap;
      }
      if (itemsCur && items) {
        return mergeDeepOverwriteLists(itemsCur, items);
      }
      if (items) {
        return items;
      }
      return itemsCur || EmptyMap;
    });
  }

  if (actionType === 'NORMAL') {
    // Trường hợp cập nhập đè => giải pháp thay thế cho việc setIn để tránh các lỗi undefined.
    return state.updateIn([parentId, 'items'], itemsCur => {
      if (items || itemsCur) {
        return mergeDeepOverwriteLists(items, itemsCur);
      }
      return EmptyMap;
    });
  }

  return state;
};

// Cập nhập minScore.
const _updateMinScore = (state, parentId, minScore, condition) => {
  const {
    isMainStateKey,
    isSearchStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _minScoreNew,
    stateKey,
  } = condition;
  if (actionType === ACTION_TYPE.GET_LIST) {
    if (
      !isMainStateKey &&
      !isSearchStateKey &&
      stateKey !== 'threadMessageIds'
    ) {
      return state.updateIn([parentId, 'minScore'], () => minScore);
    }

    return state.updateIn([parentId, 'minScore'], minScoreCur => {
      if (
        !isMainStateKey &&
        !isSearchStateKey &&
        stateKey === 'threadMessageIds' &&
        minScoreCur
      ) {
        return minScoreCur;
      }
      if (
        !minScoreCur ||
        getType === GET_LIST_TYPE.FIRST ||
        getType === GET_LIST_TYPE.OLDER ||
        (getType === GET_LIST_TYPE.NEWEST && _minScoreNew > _maxScoreCur) ||
        // Trường hợp => !document/getMid(1, 3).
        (getType === GET_LIST_TYPE.MID &&
          !(_minScoreNew > _minScoreCur && _maxScoreCur >= _minScoreNew))
      ) {
        return minScore;
      }
      return minScoreCur;
    });
  }

  return state;
};

// Cập nhập maxScore.
const _updateMaxScore = (state, parentId, maxScore, condition) => {
  const {
    isMainStateKey,
    isSearchStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _maxScoreNew,
    stateKey,
  } = condition;

  if (actionType === ACTION_TYPE.GET_LIST) {
    if (
      !isMainStateKey &&
      !isSearchStateKey &&
      stateKey !== 'threadMessageIds'
    ) {
      return state.updateIn([parentId, 'maxScore'], () => maxScore);
    }

    return state.updateIn([parentId, 'maxScore'], maxScoreCur => {
      if (
        !isMainStateKey &&
        !isSearchStateKey &&
        stateKey === 'threadMessageIds' &&
        maxScoreCur
      ) {
        return maxScoreCur;
      }
      if (
        !maxScoreCur ||
        getType === GET_LIST_TYPE.FIRST ||
        getType === GET_LIST_TYPE.NEWER ||
        getType === GET_LIST_TYPE.NEWEST ||
        // Trường hợp => !document/getMid(2, 3).
        (getType === GET_LIST_TYPE.MID &&
          !(_maxScoreCur > _maxScoreNew && _maxScoreNew >= _minScoreCur))
      ) {
        return maxScore;
      }
      return maxScoreCur;
    });
  }

  return state;
};

// Cập nhập countOlder.
const _updateCountOlder = (state, parentId, countOlder, condition) => {
  const {
    isMainStateKey,
    isSearchStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _minScoreNew,
  } = condition;

  if (actionType === ACTION_TYPE.GET_LIST) {
    if (!isMainStateKey && !isSearchStateKey) {
      return state.updateIn([parentId, 'countOlder'], () => countOlder);
    }

    return state.updateIn([parentId, 'countOlder'], countOlderCur => {
      if (
        getType === GET_LIST_TYPE.FIRST ||
        getType === GET_LIST_TYPE.OLDER ||
        (getType === GET_LIST_TYPE.NEWEST && _minScoreNew > _maxScoreCur) ||
        // Trường hợp => !document/getMid(1, 3).
        (getType === GET_LIST_TYPE.MID &&
          !(_minScoreNew > _minScoreCur && _maxScoreCur >= _minScoreNew))
      ) {
        return countOlder;
      }
      return countOlderCur;
    });
  }

  return state;
};

// Cập nhập countNewer.
const _updateCountNewer = (state, parentId, countNewer, condition) => {
  const {
    isMainStateKey,
    isSearchStateKey,
    actionType,
    getType,
    _minScoreCur,
    _maxScoreCur,
    _maxScoreNew,
  } = condition;

  if (actionType === ACTION_TYPE.GET_LIST) {
    if (!isMainStateKey && !isSearchStateKey) {
      return state.updateIn([parentId, 'countNewer'], () => countNewer);
    }

    return state.updateIn([parentId, 'countNewer'], countNewerCur => {
      if (
        getType === GET_LIST_TYPE.FIRST ||
        getType === GET_LIST_TYPE.NEWER ||
        getType === GET_LIST_TYPE.NEWEST ||
        // Trường hợp => !document/getMid(2, 3).
        (getType === GET_LIST_TYPE.MID &&
          !(_maxScoreCur > _maxScoreNew && _maxScoreNew >= _minScoreCur))
      ) {
        return countNewer;
      }
      return countNewerCur;
    });
  }

  return state;
};

// Cập nhập total.
const _updateTotal = (state, parentId, total, condition) => {
  const {actionType, isMainStateKey, isSearchStateKey} = condition;

  if (actionType === ACTION_TYPE.GET_LIST) {
    if (!isMainStateKey && !isSearchStateKey) {
      return state.updateIn([parentId, 'total'], () => total);
    }
    return state.updateIn([parentId, 'total'], totalCur => {
      const _total = totalCur === undefined ? 0 : total;
      return total || _total;
    });
  }

  if (actionType === ACTION_TYPE.POST) {
    if (!isMainStateKey && !isSearchStateKey) {
      return state;
    }
    return state.updateIn([parentId, 'total'], totalCur =>
      totalCur === undefined ? 1 : totalCur + 1,
    );
  }

  return state;
};

// Cập nhập index.
const _updateIndex = (state, parentId, index) =>
  state.updateIn([parentId, 'index'], indexCur => index || indexCur);

// Cập nhập older204.
const _updateOlder204 = (state, parentId, condition) => {
  const {getType, isMainStateKey} = condition;
  return state.updateIn([parentId, 'older204'], older204Cur => {
    // CuongNT: older204 reset lai ve false khi ma state bi reset theo ket qua vua lay tu server ve.
    if (!older204Cur || (isMainStateKey && getType === GET_LIST_TYPE.FIRST)) {
      return false;
    }
    return older204Cur;
  });
};

// Đổi id trong itemIds.
const _changeItemIds = (state, parentId, idOld, idNew) => {
  if (!parentId) {
    return state;
  }
  return state.updateIn([parentId, 'itemIds'], itemIdsCur => {
    const _itemIdsCur = itemIdsCur.toArray();
    const index = _itemIdsCur.indexOf(idOld);

    const leftList = itemIdsCur.slice(0, index);
    const rightList = itemIdsCur.slice(index + 1, itemIdsCur.size);
    return leftList.concat(OrderedSet([idNew]), rightList);
  });
};

// Xóa dữ liệu trong items;
const _removeItems = (state, parentId, id) => {
  if (!parentId) {
    return state;
  }
  return state.updateIn([parentId, 'items'], itemsCur => {
    if (itemsCur && itemsCur.hasIn([id])) {
      return itemsCur.delete(id);
    }
    if (itemsCur) {
      return itemsCur;
    }
    return EmptyMap;
  });
};

/*
 * XỬ LÝ CHO MỘT CẠNH (EDGE).
 */

/*
 * Gọi khi thêm mới cạnh (edge).
 */
const addByEdge = (state, action) => {
  const {data, id, parentId} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  return state.withMutations(stateTmp => _add(stateTmp, _parentId, id, data));
};

/*
 * Gọi khi cập nhập dữ liệu trong items.
 */
const updateByEdge = (state, action) => {
  const {data, id, parentId} = action.payload;
  const {isPatch} = action.condition;
  const _parentId = getQueryId(parentId, action.condition);
  if (data.HasMobileApps || data.HasWebApps || data.HasTabletApps) {
    return state.mergeDeep(data[Object.keys(data)[0]]);
  }

  if (isPatch) {
    return state.updateIn([_parentId, 'items', id, 'data'], _data =>
      _data ? _data.mergeDeep(data) : data,
    );
  }
  return state.setIn([_parentId, 'items', id, 'data'], data);
};

/*
 * Gọi khi cập nhập một phần dữ liệu trong items.
 */
const patchByEdge = (state, action) => {
  const {data, id, parentId} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  return state.updateIn([_parentId, 'items', id, 'data'], _data =>
    _data ? _data.mergeDeep(data) : data,
  );
};

/*
 * Gọi khi xóa 1 object or xóa dữ liệu 1 cạnh.
 */
const removeByEdge = (state, action) => {
  const {id, parentId} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  // Trường hợp : xóa cạnh bình thường.
  if (_parentId) {
    if (isOfflineId(id)) {
      return state.withMutations(stateTmp => {
        const _items = stateTmp.getIn([_parentId, 'items']);
        if (_items) {
          return stateTmp
            .updateIn([_parentId, 'itemIds'], itemIds =>
              itemIds ? itemIds.filterNot(u => u === id) : itemIds,
            )
            .deleteIn([_parentId, 'items', id]);
        }
        return stateTmp.updateIn([_parentId, 'itemIds'], itemIds =>
          itemIds ? itemIds.filterNot(u => u === id) : itemIds,
        );
      });
    }
    return state.withMutations(stateTmp =>
      stateTmp
        .updateIn([_parentId, 'itemIds'], itemIds =>
          itemIds ? itemIds.filterNot(u => u === id) : itemIds,
        )
        .deleteIn([_parentId, 'items', id])
        .updateIn([_parentId, 'total'], total => (total ? total - 1 : total)),
    );
  }
  // Nếu không có parentId hoặc không phải mainStatekey và stateKey thuộc loại object thì sẽ gặp trường hợp này.
  if (state.get(id)) {
    return state.delete(id);
  }
  // Trường hợp : xóa object không rõ parentId.
  const parentIds = state.keySeq().toArray();
  return state.withMutations(stateTmp => {
    parentIds.forEach(item => {
      if (
        state.getIn([item, 'itemIds']) &&
        state.getIn([item, 'itemIds']).includes(id)
      ) {
        // Update itemIds.
        stateTmp.updateIn([item, 'itemIds'], itemIds =>
          itemIds ? itemIds.filterNot(u => u === id) : itemIds,
        );
        // Update Items.
        _removeItems(stateTmp, item, id);
        // Update total.
        stateTmp.updateIn([item, 'total'], total =>
          total ? total - 1 : total,
        );
      }
    });
  });
};

/*
 * XỬ LÝ CHO NHIỀU CẠNH (EDGE - LIST).
 */

/*
 * Gọi khi lấy danh sách object từ server trả về và khi tạo mới object.
 * CuongNT: bo sung them quy uoc searchKey de dung lam id cho luu cac ket qua search
 * Ghi chu:
 * - Chi itemIds cua mainStateKey (VD: HasEntry) moi xet toi getType.
 * - Cac itemIds phu khac (HasComment) di kem qua trinh lay nay se phai reset toan bo neu khong se gay sai thu tu.
 *   TODO NamVH : Xem lại tên biến objectIds. => khác so với ý nghĩa của nó.
 *   NamVH : Cần tách các nghiệp vụ cập nhập thành các function để dùng lại nhiều lần.
 */
export const addListByEdge = (state, action) => {
  const {objectIds, getType, actionType} = action.payload;
  const {
    mainStateKey,
    stateKey,
    searchStateKeys,
    mergeStateKeys = [],
    offlineId,
  } = action.condition;
  if (!stateKey) {
    throw new Error('edgeReducer::addListByEdge::stateKey la bat buoc.');
  }
  const isMainStateKey = mainStateKey && mainStateKey === stateKey;
  const isSearchStateKey = searchStateKeys && searchStateKeys[stateKey];
  const isMergeStateKey = mergeStateKeys && mergeStateKeys.includes(stateKey);

  return state.withMutations(stateTmp => {
    objectIds.keySeq().forEach(parentId => {
      const _parentId = getQueryId(parentId, action.condition);
      const _minScoreNew = objectIds.getIn([parentId, 'minScore']) || 0;
      const _maxScoreNew = objectIds.getIn([parentId, 'maxScore']) || 0;
      const _minScoreCur = stateTmp.getIn([parentId, 'minScore']) || 0;
      const _maxScoreCur = stateTmp.getIn([parentId, 'maxScore']) || 0;

      if (stateTmp.has(_parentId)) {
        // CuongNT: QUAN TRONG, các điều kiện xét bên items cần giống 100% với bên itemIds, vì 2 dữ liệu này tương ứng 1-1

        // update ItemIds.
        _updateItemIds(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'itemIds']),
          {
            isMainStateKey,
            isSearchStateKey,
            isMergeStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
            stateKey,
            offlineId,
          },
        );

        // update Items.
        _updateItems(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'items']),
          {
            isMainStateKey,
            isSearchStateKey,
            isMergeStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
            stateKey,
          },
        );

        // update MinScore.
        _updateMinScore(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'minScore']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
            stateKey,
          },
        );

        // update MaxScore.
        _updateMaxScore(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'maxScore']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
            stateKey,
          },
        );

        // update CountOlder.
        _updateCountOlder(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'countOlder']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
          },
        );

        // update CountNewer.
        _updateCountNewer(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'countNewer']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
          },
        );

        // update Total.
        _updateTotal(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'total']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
          },
        );

        // update Index.
        _updateIndex(
          stateTmp,
          _parentId,
          objectIds.getIn([parentId, 'index']),
          {
            isMainStateKey,
            isSearchStateKey,
            actionType,
            getType,
            _minScoreCur,
            _maxScoreCur,
            _minScoreNew,
            _maxScoreNew,
          },
        );

        // update older204.
        _updateOlder204(stateTmp, _parentId, {
          isMainStateKey,
          isSearchStateKey,
          actionType,
          getType,
          _minScoreCur,
          _maxScoreCur,
          _minScoreNew,
          _maxScoreNew,
        });
      } else {
        stateTmp.set(_parentId, objectIds.get(parentId));
      }
    });
  });
};

/*
 * Cập nhập dữ liệu nhiều cạnh.
 */
const updateByListEdge = (state, action) => {
  const {data} = action.payload;
  let {parentId} = action.payload;
  const {mergeStateKeys = [], stateKey} = action.condition;
  parentId = parentId || data.keySeq().first();
  const _parentId = getQueryId(parentId, action.condition);

  // TODO by Dambv: Fix tam cho nay, sau chuan api update notify thi bo di sau
  // NamVH : Lỗi Api makeUnread chưa chuẩn
  if (!data || !data.getIn([parentId, 'items'])) {
    return state;
  }

  // Các trường hợp bình thường.
  if (parentId === _parentId) {
    const items = data.getIn([parentId, 'items']);
    const itemsOld = state.getIn([_parentId, 'items']);

    if (mergeStateKeys.includes(stateKey)) {
      return state.mergeIn([parentId, 'items'], mergeDeep(itemsOld, items));
    }
    return state.mergeIn(
      [parentId, 'items'],
      mergeDeepOverwriteLists(itemsOld, items),
    );
  }

  // Trường hợp client lưu dưới dạng A_B.
  const _data = data.withMutations(st => {
    st.set(_parentId, data.getIn([parentId])).remove(parentId);
  });
  const _items = _data.getIn([_parentId, 'items']);
  const _itemsOld = state.getIn([_parentId, 'items']);

  if (mergeStateKeys.includes(stateKey)) {
    return state.mergeIn([_parentId, 'items'], mergeDeep(_itemsOld, _items));
  }
  return state.mergeIn(
    [_parentId, 'items'],
    mergeDeepOverwriteLists(_itemsOld, _items),
  );
};

/*
 * Gọi khi xóa toàn bộ dữ liệu cạnh của 1 đối tượng.
 */
const removeAllByEdge = (state, action) => {
  const {parentId} = action.payload;
  return state.delete(parentId);
};

/*
 * Cập nhập Id mới do server trả về sai khi tạo mới 1 Object.
 */
const updateNewId = (state, action) => {
  const {id, offlineId, parentId} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  if (_parentId) {
    return state.withMutations(stateTmp => {
      // update ItemIds.
      _changeItemIds(stateTmp, _parentId, offlineId, id);
      // update items. (Nếu có).
      _updateItems(stateTmp, _parentId, stateTmp.getIn([_parentId, 'items']), {
        actionType: 'NORMAL',
      });
    });
  }
  // TODO NamVH : đôi khi xử lý cạnh mà giống như xử lý object. => hỏi lại anh cường.
  return state.withMutations(stateTmp => {
    const edge = stateTmp.get(offlineId);
    stateTmp.set(id, edge);
  });
};

/*
 * Thêm mới trường dữ liệu searchParams.
 */
const addSearchParams = (state, action) => {
  const {parentId, searchParams} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  return _addInfo(state, _parentId, 'searchParams', searchParams);
};

/*
 * Cập nhập trường dữ liệu searchParams.
 */
const updateSearchParams = (state, action) => {
  const {parentId, searchParams = EmptyMap} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  const oldSearchParams = state.getIn([_parentId, 'searchParams']) || EmptyMap;
  // CuongNT: kiem tra de, vd:
  // neu cu: {groupName: 'abc'}, moi: {groupName: 'abc'} => sau _pathInfo => updateIn
  // => merge se khong thay doi state nay => khong render lai ngoai y muon
  const isKeyEqual = oldSearchParams.keySeq().equals(searchParams.keySeq());
  return isKeyEqual
    ? _patchInfo(state, _parentId, 'searchParams', searchParams)
    : _updateInfo(state, _parentId, 'searchParams', searchParams);
};

/*
 * Thêm mới dữ liệu trong trường info.
 */
const addInfo = (state, action) => {
  const {parentId, infoKey, infoData} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  return _addInfo(state, _parentId, infoKey, infoData);
};

/*
 * Cập nhập dữ liệu trong trường info.
 */
const updateInfo = (state, action) => {
  const {parentId, infoKey, infoData} = action.payload;
  const _parentId = getQueryId(parentId, action.condition);
  return _updateInfo(state, _parentId, infoKey, infoData);
};

/*
 * xóa một phần dữ liệu của stateKey, statePath.
 */
const clear = (state, action) => {
  // listIdsItems: Sinh ra cho trường hơp k có itemIds, chỉ xoá items của các id trong list này
  const {parentId, itemIdsIgnore, listIdsItems} = action.payload;
  let maxScore = state.getIn([parentId, 'maxScore']);
  let minScore = state.getIn([parentId, 'minScore']);
  const total = itemIdsIgnore
    ? itemIdsIgnore.size
    : state.getIn([parentId, 'total']);
  // Những dữ liệu k có itemIds: ví dụ HasPermission
  if (listIdsItems) {
    return state.withMutations(st => {
      st.updateIn([parentId, 'items'], items =>
        !items
          ? EmptyMap
          : items.withMutations(_items => {
              const [...key] = _items.keys();
              key.forEach(item => {
                if (listIdsItems.includes(item)) {
                  _items.delete(item);
                }
              });
            }),
      );
    });
  }
  // Xoá tất cả itemIds
  if (
    !itemIdsIgnore ||
    itemIdsIgnore.size === 0 ||
    (state.getIn([parentId, 'itemIds']) &&
      state.getIn([parentId, 'itemIds']).size === itemIdsIgnore.size)
  ) {
    return state.delete(parentId);
  }
  return state.withMutations(st => {
    st.updateIn([parentId, 'itemIds'], _itemIds => {
      const result = _itemIds.filter(item => itemIdsIgnore.includes(item));
      const firstId = result.first();
      const lastId = result.last();
      if (firstId) {
        maxScore =
          state.getIn([parentId, 'items', firstId, 'score']) ||
          state.getIn([parentId, 'items', firstId, 'data', 'score']) ||
          0;
      }
      if (lastId) {
        minScore =
          state.getIn([parentId, 'items', lastId, 'score']) ||
          state.getIn([parentId, 'items', firstId, 'data', 'score']) ||
          0;
      }
      return result;
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
                if (!itemIdsIgnore.includes(item)) {
                  _items.delete(item);
                }
              });
            }),
      );
  });
};

// Phục vụ các reducer như: threadUserIds, HasSeen,...
const clearList = (state, action) => {
  const {parentIds} = action.payload;
  return state.withMutations(st => {
    parentIds.map(parentId => st.delete(parentId));
  });
};

const edgeReducer = createReducer(fromJS({}), {
  [EDGE_ACTIONS.ADD]: addByEdge,
  [EDGE_ACTIONS.UPDATE]: updateByEdge,
  [EDGE_ACTIONS.PATCH]: patchByEdge,
  [EDGE_ACTIONS.REMOVE]: removeByEdge,
  [EDGE_ACTIONS.ADD_LIST]: addListByEdge,
  [EDGE_ACTIONS.UPDATE_LIST]: updateByListEdge,
  [EDGE_ACTIONS.REMOVE_ALL]: removeAllByEdge,
  [EDGE_ACTIONS.UPDATE_NEW_ID]: updateNewId,
  [EDGE_ACTIONS.ADD_SEARCH_PARAMS]: addSearchParams,
  [EDGE_ACTIONS.UPDATE_SEARCH_PARAMS]: updateSearchParams,
  [EDGE_ACTIONS.ADD_INFO]: addInfo,
  [EDGE_ACTIONS.UPDATE_INFO]: updateInfo,
  [EDGE_ACTIONS.CLEAR]: clear,
  [EDGE_ACTIONS.CLEAR_LIST]: clearList,
});

export default edgeReducer;
