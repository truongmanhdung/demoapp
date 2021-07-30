/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 11/12/17.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */


export default function checkPropertiesIsRequired(body, ...checkProps) {
  for (let i = 0; i < checkProps.length; i += 1) {
    if (!body[checkProps[i]]) {
      const parsed = parseInt(body[checkProps[i]], 10);
      if (!(parsed)) {
        throw new Error(`${checkProps[i]}: is required!!`);
      }
    }
  }
  return true;
}
