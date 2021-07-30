/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author linhltf@bkav.com on 15/06/2018
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

export default (objects, parseKeys = []) => {
  const keys = objects.keys(); // ES6 iterator
  return objects.withMutations(clone => {
    let key = keys.next();
    while (!key.done) {
      // eslint-disable-next-line no-loop-func
      parseKeys.forEach(parse => {
        const dataStr = clone.getIn([key.value, 'data', parse]);
        if (typeof dataStr === 'string') {
          let data = {};
          try {
            data = JSON.parse(dataStr);
          } catch (e) {
            console.warn(`${parse}Reducer::add JSON.parse error`);
          }
          clone.setIn([key.value, 'data', parse], data);
        }
      });
      key = keys.next();
    }
  });
};
