/**
 * Copyright 2021-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 10/7/2021.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {call, fork, put, take} from '../../../vala-base/sagas/redux-saga-catch';

//import HELLO_SEND_MESSAGE from '../hello_constants';
import makeRestartable from '../../../vala-base/sagas/makeRestartable';
import {addMessage, getData} from '../actions/helloActionUI';
import createMessageObject from '../utils/createMessageObject';
import createMessagePayload from '../utils/createMessagePayload';

const isAddMessage = function isAddMessage(action) {
  const actionType = action.type;
  return (
    actionType &&
    actionType === 'HELLO_SEND_MESSAGE' &&
    action.condition &&
    action.condition.actionKey === 'addMessage'
  );
};

const isGetData = function isGetData(action) {
  const actionType = action.type;
  return actionType && actionType === 'HELLO_GET_DATA';
};

export function* watchAddMessage() {
  while (true) {
    const rs = yield take(isAddMessage);
    const message = yield call(createMessageObject, rs.payload.text);
    const payload = yield call(
      createMessagePayload,
      'parentId_1', // parent_id fake
      message.data.id,
      message,
    );
    yield put(addMessage(payload.messages, payload.helloIds));
  }
}

export function* watchGetData() {
  while (true) {
    const payload = yield take(isGetData);
    yield put(getData('563087392384907'));
  }
}

const helloSagas = [watchGetData].map(makeRestartable);
function* helloSaga() {
  yield helloSagas.map(saga => call(saga));
}

export default helloSaga;
