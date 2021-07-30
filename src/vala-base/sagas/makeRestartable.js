/* eslint-disable func-names,no-console */
/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 29/08/2018.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {delay} from 'redux-saga';
import {call, spawn} from './redux-saga-catch';

// https://kipalog.com/posts/Hieu-qua-cua-exponential-backoff-trong-xu-li-error-retries
// https://github.com/redux-saga/redux-saga/issues/760
// CuongNT: dung cach start root saga nay thi khong can phai try-catch trong watcher(){while(true){try{...}catch(){...}};} nua.
const makeRestartable = saga =>
  function* () {
    // CuongNT: saga undefined do khai bao dang
    // const getThreadSagaOfMessengers = [
    //     watchGetThreadListSuccessAfter, <-- Cho nay hieu la co 1 phan tu undefined cuoi mang
    // ];
    if (!saga) {
      return;
    }
    yield spawn(function* () {
      while (true) {
        yield call(saga);
        yield delay(1000); // Avoid infinite failures blocking app TODO use backoff retry policy...
      }
    });
  };

export default makeRestartable;
