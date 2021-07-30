/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 11/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {take, fork, put, call, select} from './redux-saga-catch';

// action.
import {EDGE_API, edgeApi} from '../apis/edgeApiActions';
import {edgeActions} from '../reducers/edgeReducerActions';

// util.
import {fetchEntity} from '../apis/fetchEntity';

/*
 * GET: Xử lý kết quả khi get một cạnh dữ liệu (edge).
 */

/*
 * Function.
 */

const isGetEdgeSuccessAction = function isGetEdgeSuccessAction(action) {
  const actionType = action.type;
  return actionType === EDGE_API.GET.SUCCESS;
};

const fetchGetEdge = fetchEntity.bind(null, edgeApi.get);

/*
 * Worker.
 */
const doFetchGetEdge = function* doFetchGetEdge(requestAction) {
  const {
    selector,
    api,
    parentId,
    id,
    forceGet = false,
  } = requestAction.condition;
  const body = requestAction.payload;
  if (forceGet) {
    yield call(
      fetchGetEdge,
      api.get.bind(api),
      requestAction,
      parentId,
      id,
      body,
    );
  } else {
    // CuongNT: Kiem tra dam bao chua co _edge trong state thi truy van server, co roi thi thoi.
    // TODO NamVH: lấy dữ liệu cạnh => nhưng selector lại theo dạng get Object? Hỏi lại anh CuongNT.
    const _edge = yield select(selector.get, id);
    if (!_edge) {
      yield call(fetchGetEdge, api.get.bind(api), requestAction, parentId, id);
    }
  }
};

const doGetEdgeSuccess = function* doGetEdgeSuccess(fetchResult) {
  const {payload, original} = fetchResult;
  const {
    parentId,
    statePath,
    stateKey,
    mainStateKey,
    searchKey,
    searchStateKeys,
    mergeStateKeys,
  } = original.condition;
  yield put(
    edgeActions.updateList(
      parentId,
      payload[stateKey],
      stateKey,
      statePath,
      mainStateKey,
      searchKey,
      searchStateKeys,
      mergeStateKeys,
    ),
  );
  // yield call(addPayloadToState, payload, getType, statePath, mainStateKey, searchKey);
  // const statePath = [];// original.condition.statePath;
};

/*
 * Watcher.
 */

// Handle action : getUi.
const watchGetEdge = function* watchGetEdge() {
  while (true) {
    const requestAction = yield take(EDGE_API.GET_UI);
    yield fork(doFetchGetEdge, requestAction);
  }
};

// Handle response : get.
const watchGetEdgeSuccess = function* watchGetEdgeSuccess() {
  while (true) {
    const fetchResult = yield take(isGetEdgeSuccessAction);
    yield fork(doGetEdgeSuccess, fetchResult);
  }
};

export {watchGetEdge, watchGetEdgeSuccess};
