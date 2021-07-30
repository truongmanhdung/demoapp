/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 25/12/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import {put} from 'redux-saga/effects';

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
    yield put({
      type: 'UPDATE_PAYLOAD_GET_SERVER_TO_STATE',
      payload: {
        payload,
        getType,
        actionType,
        statePath,
        mainStateKey,
        searchKey,
        searchStateKeys,
        mergeStateKeys,
      },
    });
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
  //console.log("addPayloadMainStateKeyToState", new Date().getTime());
  yield put({
    type: 'UPDATE_PAYLOAD_GET_SERVER_TO_STATE',
    payload: {
      payload,
      getType,
      actionType,
      statePath,
      mainStateKey,
      searchKey,
      searchStateKeys,
      mergeStateKeys,
    },
  });
  //console.log("addPayloadMainStateKeyToState End", new Date().getTime());
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
  // yield addPayloadToStateWithoutMainStateKey(payload, getType, actionType, statePath, mainStateKey, searchKey, searchStateKeys, mergeStateKeys);
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
