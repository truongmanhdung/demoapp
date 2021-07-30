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

import {take, fork, put, call} from './redux-saga-catch';

// action.
import {edgeActions} from '../reducers/edgeReducerActions';
import {EDGE_API, edgeApi} from '../apis/edgeApiActions';

// util.
import {fetchEntity} from '../apis/fetchEntity';

/*
 * POST: Xử lý khi tạo thêm một cạnh (edge).
 */

const isPostEdgeSuccessAction = function isPostEdgeSuccessAction(action) {
  const actionType = action.type;
  return actionType === EDGE_API.POST.SUCCESS;
};

const fetchPostEdge = fetchEntity.bind(null, edgeApi.post);

/*
 * Worker.
 */

const doFetchPostEdge = function* doFetchPostEdge(requestAction) {
  const data = requestAction.payload;
  const {api, parentId, id, stateKey, header, statePath} =
    requestAction.condition;
  // TODO: thêm object mới vào state trước lúc post lên server
  yield put(edgeActions.add(parentId, id, data, stateKey, statePath));
  yield call(
    fetchPostEdge,
    api.post.bind(api),
    requestAction,
    parentId,
    id,
    data,
    header,
  );
};

// eslint-disable-next-line no-unused-vars
const doPostEdgeSuccess = function* doPostEdgeSuccess(fetchResult) {
  // TODO: thêm edge mới vào state nếu chưa thực hiện trước lúc post lên server
  // const requestAction = fetchResule.original;
  // const body = requestAction.payload;
  // yield call(addPayloadToState, body, GET_LIST_TYPE.NEWER, requestAction.condition.statePath);
  // TODO: Cập lại newId do server trả về thay fakeId tự sinh tạm khi tạo mới => Cơ chế cho việc cần biết update vào những chỗ nào?
};

/*
 * Watcher.
 */

const watchPostEdge = function* watchPostEdge() {
  while (true) {
    const requestAction = yield take(EDGE_API.POST_UI);
    yield fork(doFetchPostEdge, requestAction);
  }
};

const watchPostEdgeSuccess = function* watchPostEdgeSuccess() {
  while (true) {
    const fetchResult = yield take(isPostEdgeSuccessAction);
    yield fork(doPostEdgeSuccess, fetchResult);
  }
};

export {watchPostEdge, watchPostEdgeSuccess};
