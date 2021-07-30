/**
 * Copyright 2016-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 21/07/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {delay} from 'redux-saga';
import {put, call, cancelled} from '../sagas/redux-saga-catch';

// todo-note: Anh CôngTM viết để cố gắng gọi request
const retryApi = function* retryApi(retry = 1, apiFn, ...args) {
  let _apiResponse;
  for (let i = 0; i < retry; i += 1) {
    const apiResponse = yield call(apiFn, ...args);
    _apiResponse = apiResponse;
    if (apiResponse.response) {
      return apiResponse;
    }
    // todo-note: Kiểm tra nếu mà retry === 1 return dữ liệu luôn (Đã hỏi anh CôngTM)
    if (apiResponse.error) {
      if (i > 1 && i < 4) {
        yield call(delay, 4000);
      }
    }
  }
  // attempts failed after 5 attempts
  return _apiResponse;
};

/**
 * Hàm mẫu chứa kịch bản truy vấn tới server chung
 *
 * @param {object} entity Action callback when doing fetching
 * @param {function} apiFn Ham goi Api cua server
 * @param {object} original Action goc yeu cau fetch len server
 * @param {string} args Du lieu can gui len server
 * @return {boolean} Whether something occurred.
 */
const fetchEntity = function* fetchEntity(entity, apiFn, original, ...args) {
  try {
    if (!entity || !entity.request || !entity.success || !entity.failure) {
      return null;
    }
    yield put(entity.request(original));
    // const {response, error} = yield call(apiFn, ...args);
    // fetchRetry: so lan gui thu lai len server khi co loi. Mac dinh chi gui 1 lan.
    const fetchRetry =
      original && original.condition && original.condition.fetchRetry
        ? original.condition.fetchRetry
        : 1;
    const {response, error} = yield call(retryApi, fetchRetry, apiFn, ...args);
    if (
      original &&
      original.condition &&
      original.condition.fetchIsFinished &&
      typeof original.condition.fetchIsFinished === 'function'
    ) {
      yield original.condition.fetchIsFinished();
    }
    if (
      original &&
      original.condition &&
      typeof original.condition.getIsFinished === 'function'
    ) {
      original.condition.getIsFinished(original);
    }
    if (
      original &&
      original.condition &&
      typeof original.condition.getListIsFinished === 'function'
    ) {
      original.condition.getListIsFinished(original);
    }

    // success
    if (response) {
      if (
        original &&
        original.condition &&
        original.condition.fetchIsSuccess &&
        typeof original.condition.fetchIsSuccess === 'function'
      ) {
        yield original.condition.fetchIsSuccess(original, response);
      }
      yield put(entity.success(original, response));
      return response;
    }
    // failure
    yield put(entity.failure(original, error));
    if (
      original &&
      original.condition &&
      original.condition.fetchIsError &&
      typeof original.condition.fetchIsError === 'function'
    ) {
      yield original.condition.fetchIsError(original, error);
    }
    // CuongNT - 27/12/2017: Kiem tra, neu la 401 Unauthorized thi chuyen logout
    if (error && error.response && error.response.status === 401) {
      // console.log('fetchEntity', companyId, token);
      let backUrl;
      if (window && window.location && window.location.href) {
        const {href} = window.location;
        const url = new URL(href);
        backUrl = url.searchParams.get('return_to') || href;
      }
      const isLogin = error.request.responseURL.includes('/login');
      if (!isLogin) {
        yield put({type: 'DO_LOGOUT_401', backUrl, original});
      }
      // yield put(push(`/logout?return_to=${encodeURIComponent(backUrl)}`));
    }
    return error;
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
};

export {fetchEntity};

export default fetchEntity;
