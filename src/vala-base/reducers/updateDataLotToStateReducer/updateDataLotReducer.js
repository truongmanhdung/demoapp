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

import {fromJS} from 'immutable';
import createReducer from '../../reducers/createReducer';
import updateDataToState from './updateDataToState';

function updatePayloadToState(state, action) {
  const {
    payload,
    getType,
    actionType,
    statePath,
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  } = action.payload;
  return updateDataToState(
    state,
    payload,
    getType,
    actionType,
    statePath,
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  );
}

const updateDataLotReducer = createReducer(fromJS({}), {
  UPDATE_PAYLOAD_GET_SERVER_TO_STATE: updatePayloadToState,
});

export default updateDataLotReducer;
