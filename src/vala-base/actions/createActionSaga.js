/**
 * Copyright 2016-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 25/08/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import createAction from './createAction';

/**
 * createActionSaga: Tạo một action saga
 * @param {*} types
 */
export default function createActionSaga(types) {
  return {
    request: (...args) => createAction(types.REQUEST, ...args),
    success: (...args) => createAction(types.SUCCESS, ...args),
    failure: (...args) => createAction(types.FAILURE, ...args),
  };
}
