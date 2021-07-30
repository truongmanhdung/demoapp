/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 11/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {put} from './redux-saga-catch';
import {objectActions} from '../reducers/objectReducerActions';
import {edgeActions} from '../reducers/edgeReducerActions';

const addPayloadToStateWithoutMainStateKey =
  function* addPayloadToStateWithoutMainStateKey(
    payload,
    getType,
    actionType,
    statePath = [],
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  ) {
    if (payload.status) {
      throw new Error(
        'addPayloadToState::204 can handle response 204 truoc khi goi ham nay',
      );
    }
    // Tự động phân tích response và thêm mới/cập nhật vào state tương ứng.
    const stateKeys = Object.keys(payload);
    for (let i = 0; i < stateKeys.length; i += 1) {
      const key = stateKeys[i];
      const dataKey = payload[key];
      if (!dataKey || !dataKey.first) {
        continue;
      }
      const isObject = dataKey.first() && dataKey.first().get('data');
      if (isObject) {
        // Du lieu object
        yield put(objectActions.addList(dataKey, key, statePath));
      }
    }

    for (let i = 0; i < stateKeys.length; i += 1) {
      const key = stateKeys[i];
      const dataKey = payload[key];
      if (!dataKey || !dataKey.first) {
        continue;
      }
      const isEdge =
        dataKey.first() &&
        (dataKey.first().get('itemIds') || dataKey.first().get('items'));
      if (isEdge && mainStateKey !== key) {
        yield put(
          edgeActions.addList(
            getType,
            actionType,
            dataKey,
            key,
            statePath,
            mainStateKey,
            null,
            searchStateKeys,
            mergeStateKeys,
          ),
        );
      }
    }
  };

const addPayloadMainStateKeyToState = function* addPayloadMainStateKeyToState(
  payload,
  getType,
  actionType,
  statePath = [],
  mainStateKey,
  searchKey,
  searchStateKeys,
  mergeStateKeys,
) {
  const stateKeys = Object.keys(payload);
  // DamBV: Chi add du lieu quyet dinh khi cac du lieu phu da hoan thanh.
  // VD: GetThread: userThreadIds  la du lieu quyet dinh.
  for (let i = 0; i < stateKeys.length; i += 1) {
    const key = stateKeys[i];
    const dataKey = payload[key];
    if (!dataKey || !dataKey.first) {
      continue;
    }
    const isEdge =
      dataKey.first() &&
      (dataKey.first().get('itemIds') || dataKey.first().get('items'));
    if (isEdge && mainStateKey === key) {
      yield put(
        edgeActions.addList(
          getType,
          actionType,
          dataKey,
          key,
          statePath,
          mainStateKey,
          searchKey,
          searchStateKeys,
          mergeStateKeys,
        ),
      );
    }
  }
};

const addPayloadToState = function* addPayloadToState(
  payload,
  getType,
  actionType,
  statePath = [],
  mainStateKey,
  searchKey,
  searchStateKeys,
  mergeStateKeys,
) {
  yield addPayloadToStateWithoutMainStateKey(
    payload,
    getType,
    actionType,
    statePath,
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  );
  yield addPayloadMainStateKeyToState(
    payload,
    getType,
    actionType,
    statePath,
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  );
};

export {addPayloadToState, addPayloadToStateWithoutMainStateKey};
