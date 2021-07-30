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

import AsyncStorage from '@react-native-community/async-storage';
import ToastLog from '../../apis/toastLog';

class Cookie {
  cache = {};

  resetCache = () => {
    this.cache = {};
  };

  get = name => {
    if (this.cache[name]) {
      return this.cache[name];
    }
    return Promise.resolve(AsyncStorage.getItem(name)).then(result => {
      this.cache[name] = result;
      return Promise.resolve(result);
    });
  };

  set = (name, value) => {
    this.cache[name] = value;
    return AsyncStorage.setItem(name, value);
  };

  remove = name => {
    delete this.cache[name];
    return AsyncStorage.removeItem(name);
  };

  removeList = keys => {
    for (let i = 0; i < keys.length; i += 1) {
      delete this.cache[keys[i]];
    }
    return AsyncStorage.multiRemove();
  };

  clear = fn => {
    this.cache = {};
    return AsyncStorage.clear(fn);
  };

  getQuerys(results, url) {
    let headerFields = {};
    if (results) {
      results.forEach(result => {
        headerFields = {[result[0]]: result[1], ...headerFields};
      });
    }
    ToastLog.log(url);
    ToastLog.log(JSON.stringify(headerFields));
    return headerFields;
  }

  getInCache = keys => {
    // Chưa tối ưu, có thể tính toán để tách ra nhưng thứ đã lấy và cần lấy thêm
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      if (!this.cache[keys[i]]) {
        return null;
      }
      result[keys[i]] = this.cache[keys[i]];
    }
    return result;
  };

  getList = (keys, url) => {
    // return Promise.resolve(AsyncStorage.multiGet(keys)).then(result => this.getQuerys(result));
    const cacheValue = this.getInCache(keys);
    if (cacheValue) {
      return Promise.resolve(cacheValue);
    }
    return Promise.resolve(AsyncStorage.multiGet(keys)).then(result => {
      const resultFields = this.getQuerys(result, url);
      Object.assign(this.cache, resultFields);
      return Promise.resolve(resultFields);
    });
  };
}

const cookie = new Cookie();

export default cookie;
