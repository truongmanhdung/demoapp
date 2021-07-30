/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 15/05/19.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import Cookies from 'js-cookie';

class Cookie {
  get(name) {
    return Cookies.get(name);
  }

  set(name, value, options) {
    Cookies.set(name, value, options);
  }

  remove(name, options) {
    Cookies.remove(name, options);
  }

  getQuerys(results) {
    let headerFields = {};
    if (results) {
      results.forEach(result => {
        headerFields = {[result[0]]: result[1], ...headerFields};
      });
    }
    return Promise.resolve(headerFields);
  }

  getList(keys) {
    const results = keys.map(key => [key, this.get(key)]);
    return this.getQuerys(results);
  }
}

const cookie = new Cookie();

export default cookie;
