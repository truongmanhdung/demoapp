/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 04/10/18.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {
  takeEvery as _takeEvery,
  takeLatest as _takeLatest,
  throttle as _throttle,
  call as _call,
  fork as _fork,
  cancel,
  take,
  select,
  actionChannel,
  all,
  apply,
  cps,
  put,
  race,
  flush,
  spawn,
  join,
  cancelled,
  setContext,
  getContext,
} from 'redux-saga/effects';
// import Raven from 'raven-js';

/**
 * Quick wrap a saga with `try catch`
 * 快速使用try catch包装saga
 * @param {Saga} saga
 */
function tryCatch(saga) {
  // eslint-disable-next-line consistent-return
  const wrapped = function* wrappedTryCatch() {
    try {
      // eslint-disable-next-line prefer-rest-params
      return yield _call(saga, ...arguments);
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.error('SAGA-CATCH::ERROR', e);
      console.warn('SAGA-CATCH::ERROR', e);
      // Raven.captureException(e);
    }
  };
  /** For debug trace. 用于调试时跟踪原始代码 */
  wrapped._original = saga;
  return wrapped;
}

/**
 * Like saga's takeEvery, but swallow exception and don't cancel the takeEveryHelper.
 * 类似于saga原生的takeEvery，但是出错也不会导致监听中止
 * @param {*} pattern
 * @param {Saga} worker
 * @param {*} args
 */
function takeEvery(pattern, worker, ...args) {
  return _takeEvery(pattern, tryCatch(worker), ...args);
}

/**
 * Like saga's takeLatest, but swallow exception and don't cancel the takeLatestHelper.
 * 类似于saga原生的takeLatest，但是出错也不会导致监听中止
 * @param {*} pattern
 * @param {Saga} worker
 * @param {*} args
 */
function takeLatest(pattern, worker, ...args) {
  return _takeLatest(pattern, tryCatch(worker), ...args);
}

/**
 * Like saga's throttle, but swallow exception and don't cancel the throttleHelper.
 * 类似于saga原生的throttle，但是出错也不会导致监听中止
 * @param {*} ms
 * @param {*} pattern
 * @param {Saga} worker
 * @param {*} args
 */
function throttle(ms, pattern, worker, ...args) {
  return _throttle(ms, pattern, tryCatch(worker), ...args);
}

/**
 * run child sagas parallel, and child saga's exception don't cancel current saga.
 * 并行执行多个子saga，并且子saga出错不会影响父saga以及其它同级saga。
 *
 * usage/用法:
 * yield parallel([function*(){}, ...sagas])
 * @param {Saga[]} sagas
 */
function parallel(sagas) {
  return _call(function* (_sagas) {
    for (let i = 0; i < _sagas.length; i += 1) {
      yield _fork(tryCatch(_sagas[i]));
    }
  }, sagas);
}

/**
 * similar to takeLatest, buy fork saga first.
 * 与takeLatest相似，但会先fork执行一次saga。
 * takeLatest:  while( pattern ){ saga }
 * runAndTakeLatest:  do{ saga }while( pattern )
 * @param {*} pattern
 * @param {*} saga
 * @param {*} args
 */
function runAndTakeLatest(pattern, sagaDefault, ...args) {
  let saga = sagaDefault;
  saga = tryCatch(saga);
  return _fork(function* () {
    let lastTask;
    let action;
    while (true) {
      if (lastTask) {
        yield cancel(lastTask); // cancel is no-op if the task has already terminated
      }
      lastTask = yield _fork(saga, ...args, action);
      action = yield take(pattern);
    }
  });
}

function fork(saga, ...args) {
  return _fork(tryCatch(saga), ...args);
}

function call(saga, ...args) {
  return _call(tryCatch(saga), ...args);
}

export {
  runAndTakeLatest,
  takeEvery,
  takeLatest,
  throttle,
  parallel,
  fork,
  call,
  cancel,
  take,
  select,
  actionChannel,
  all,
  apply,
  cps,
  put,
  race,
  flush,
  spawn,
  join,
  cancelled,
  setContext,
  getContext,
};
