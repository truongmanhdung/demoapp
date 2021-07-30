/**
 * Copyright 2016-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 18/08/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

/**
 * createAction: Tạo một action có API
 * @param {*} APP_ID
 * @param {*} type
 * @param {*} payload
 */
export default function createAction(APP_ID, type, payload = {}) {
  return {
    APP_ID,
    type,
    payload,
    timestamp: Date.now(),
  };
}
