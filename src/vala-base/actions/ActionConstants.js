/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 11/01/2018.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

export const MODIFY_STATE_BEFORE = 'MODIFY_STATE_BEFORE';
export const MODIFY_STATE_AFTER = 'MODIFY_STATE_AFTER';
export const MODIFY_STATE_ONLY = 'MODIFY_STATE_ONLY';
export const FETCH_SERVER_ONLY = 'FETCH_SERVER_ONLY';
export const MODIFY_STATE_TYPE_DEFAULT = MODIFY_STATE_AFTER;
export const MODIFY_STATE_TYPES = [
  MODIFY_STATE_BEFORE,
  MODIFY_STATE_AFTER,
  MODIFY_STATE_ONLY,
  FETCH_SERVER_ONLY,
];
