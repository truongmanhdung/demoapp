/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 24/12/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {addListByEdge} from '../edgeReducer';
import {addList} from '../objectReducer';

function updateDataToState(
  state,
  payload,
  getType,
  actionType,
  statePath,
  mainStateKey,
  searchKey,
  searchStateKeys,
  mergeStateKeys,
) {
  if (payload.status) {
    return state;
  }
  return state.withMutations(st => {
    const stateKeys = Object.keys(payload);
    stateKeys.map(key => {
      const dataKey = payload[key];
      if (dataKey && dataKey.first) {
        const isObject = dataKey.first() && dataKey.first().get('data');
        if (isObject) {
          // Du lieu object
          const action = {};
          action.payload = {objects: dataKey};
          action.condition = {stateKey: key, statePath};
          const _stateObject = addList(st.get(key), action);
          st.set(key, _stateObject);
          // console.log('updateDataToState _stateObject', _stateObject.toJS());
          // st.mergeDeepIn([key], dataKey);
        }
        const isEdge =
          dataKey.first() &&
          (dataKey.first().get('itemIds') || dataKey.first().get('items'));
        if (isEdge && st.get(key)) {
          const objectIds = dataKey;
          const action = {};
          action.payload = {getType, actionType, objectIds};
          if (mainStateKey !== key) {
            action.condition = {
              statePath,
              stateKey: key,
              mainStateKey,
              searchKey: null,
              searchStateKeys,
              mergeStateKeys,
            };
          } else {
            action.condition = {
              statePath,
              stateKey: key,
              mainStateKey,
              searchKey,
              searchStateKeys,
              mergeStateKeys,
            };
          }
          const _stateEdge = addListByEdge(st.get(key), action);
          st.set(key, _stateEdge);
          // console.log('updateDataToState _stateEdge', _stateEdge.toJS());
        }
      }
    });
  });
}

export default updateDataToState;
