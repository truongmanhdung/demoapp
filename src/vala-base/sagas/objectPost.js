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

import {take, fork, call, put} from './redux-saga-catch';
// import _ from 'lodash';
import {fetchEntity} from '../apis/fetchEntity';

// action.
import {objectApi, OBJECT_API} from '../apis/objectApiActions';
import {objectActions} from '../reducers/objectReducerActions';
import {edgeActions} from '../reducers/edgeReducerActions';

// saga.
//import {doAddIds} from './windowSaga';

// util.
import {addPayloadToState} from './addPayloadToState';
import {GET_LIST_TYPE, ACTION_TYPE} from '../configs/Constants';
import {
  MODIFY_STATE_BEFORE,
  MODIFY_STATE_AFTER,
  MODIFY_STATE_ONLY,
  MODIFY_STATE_TYPE_DEFAULT,
  MODIFY_STATE_TYPES,
} from '../actions/ActionConstants';

// const.
export const OBJECT_POST = {
  AFTER_UPDATE_STATE_UI: 'OBJECT_POST_UI_UPDATE_STATE_ONLY',
  AFTER_UPDATE_STATE_API: 'OBJECT_POST_API_SUCCESS_UPDATE_STATE',
};

/**
 * POST: Xử lý khi tạo một object.
 * - false: server bao ve thanh cong moi add vao state
 * - true: add vao state truoc, thanh cong: thi update lai offlineId => id, loi: thi hoac xoa di, hoac hien retry.
 */

/*
 * Function.
 */

const isPostObjectSuccessAction = function isPostObjectSuccessAction(action) {
  const actionType = action.type;
  return actionType === OBJECT_API.POST.SUCCESS;
};

const fetchPostObject = fetchEntity.bind(null, objectApi.post);

/*
 * Worker.
 */

const doFetchPostObject = function* doFetchPostObject(requestAction) {
  const body = requestAction.payload;
  const {condition} = requestAction;
  const {
    api,
    parentId,
    statePath,
    modifyStateType = MODIFY_STATE_TYPE_DEFAULT,
    mainStateKey,
    header = {},
    searchKey,
    getType = GET_LIST_TYPE.NEWER,
  } = requestAction.condition;
  if (!MODIFY_STATE_TYPES.includes(modifyStateType)) {
    throw 'objectPost::modifyStateType su dung cac gia tri import from base/ActionConstants.js';
  }
  if (
    modifyStateType === MODIFY_STATE_BEFORE ||
    modifyStateType === MODIFY_STATE_ONLY
  ) {
    yield call(
      addPayloadToState,
      body,
      getType,
      ACTION_TYPE.POST,
      statePath,
      mainStateKey,
      searchKey,
    );
    if (modifyStateType === MODIFY_STATE_ONLY) {
      yield put({
        type: OBJECT_POST.AFTER_UPDATE_STATE_UI,
        payload: body,
        condition,
      });
    }
  }
  if (modifyStateType !== MODIFY_STATE_ONLY) {
    yield call(
      fetchPostObject,
      api.post.bind(api),
      requestAction,
      parentId,
      body,
      header,
    );
  }
};

const doPostObjectSuccess = function* doPostObjectSuccess(fetchResult) {
  const {payload, original} = fetchResult;
  // if (!_.isArray(payload) || payload.length <= 0) throw new Error('objectPost::doPostObjectSuccess reponse khong dung dinh dang. Bat buoc la array [{id, offlineId}]');
  if (!Array.isArray(payload) || payload.length <= 0) {
    return;
  }

  const stateKeys = Object.keys(original.payload);

  if (payload[0] && payload[0].id && payload[0].offlineId) {
    doAddIds(payload[0].id, payload[0].offlineId);
  }

  const {
    modifyStateType = MODIFY_STATE_TYPE_DEFAULT,
    mainStateKey,
    searchKey,
    getType = GET_LIST_TYPE.NEWER,
  } = original.condition;
  if (!MODIFY_STATE_TYPES.includes(modifyStateType)) {
    throw 'objectPost::modifyStateType su dung cac gia tri import from base/ActionConstants.js';
  }
  if (modifyStateType === MODIFY_STATE_AFTER) {
    // const body = original.payload;
    // Cap nhat lai Id tam thanh id that
    for (let j = 0; j < payload.length; j += 1) {
      // CuongNT: Co truong hop tao moi object voi id that luon, ma khong can tao tam => offlineId se khong co
      // VD: khi tao moi thread chat 1-1, threadId = 'cid.' + userId => Day la id that luon, va khong can tim thay the nua.
      if (payload[j].offlineId === payload[j].id) {
        continue;
      }
      for (let i = 0; i < stateKeys.length; i += 1) {
        const key = stateKeys[i];
        if (!original.payload[key].first) {
          continue;
        }

        // Tim lai stateKey cua list object can update offlineId
        const isObject =
          original.payload[key].first() &&
          original.payload[key].first().get('data');
        if (isObject) {
          if (original.payload[key].get(payload[j].offlineId)) {
            const newObject = original.payload[key]
              .get(payload[j].offlineId)
              .deleteIn(['data', 'offlineId'])
              .setIn(['data', 'id'], payload[j].id)
              .updateIn(['data', 'createdDate'], _createdDate =>
                payload[j].createdDate
                  ? payload[j].createdDate
                  : payload[j].timestamp
                  ? payload[j].timestamp
                  : _createdDate,
              )
              .updateIn(['data', 'timestamp'], _timestamp =>
                payload[j].createdDate
                  ? payload[j].createdDate
                  : payload[j].timestamp
                  ? payload[j].timestamp
                  : _timestamp,
              );
            const newValue = original.payload[key]
              .delete(payload[j].offlineId)
              .set(payload[j].id, newObject);
            original.payload[key] = newValue;
          }
        }
        // Tim lai stateKey cua list id can update offlineId
        const isEdge =
          original.payload[key].first() &&
          original.payload[key].first().get('itemIds');
        if (isEdge) {
          if (original.payload[key].get(payload[j].offlineId)) {
            const newObject = original.payload[key].get(payload[j].offlineId);
            const newValue = original.payload[key]
              .delete(payload[j].offlineId)
              .set(payload[j].id, newObject);
            original.payload[key] = newValue;
          } else {
            const parentIds = original.payload[key].keySeq();
            // eslint-disable-next-line no-loop-func
            parentIds.forEach(_parentId => {
              if (
                original.payload[key]
                  .getIn([_parentId, 'itemIds'])
                  .includes(payload[j].offlineId)
              ) {
                const newValue = original.payload[key].withMutations(
                  stateTmp => {
                    const item = stateTmp.getIn([
                      _parentId,
                      'items',
                      payload[j].offlineId,
                    ]);
                    stateTmp
                      .updateIn([_parentId, 'itemIds'], itemIds =>
                        itemIds.delete(payload[j].offlineId).add(payload[j].id),
                      )
                      .updateIn([_parentId, 'items'], items =>
                        items && item
                          ? items
                              .delete(payload[j].offlineId)
                              .set(payload[j].id, item)
                          : items,
                      );
                  },
                );
                original.payload[key] = newValue;
              }
            });
          }
        }
      }
    }
    // Thêm object mới vào state trước lúc post lên server
    yield call(
      addPayloadToState,
      original.payload,
      getType,
      ACTION_TYPE.POST,
      [],
      mainStateKey,
      searchKey,
    );
    yield put({type: OBJECT_POST.AFTER_UPDATE_STATE_API, payload, original});
    return;
  }
  // object: {id, offlineId, newObject}, edge: {parentId, id, offlineId}
  for (let j = 0; j < payload.length; j += 1) {
    // CuongNT: Co truong hop tao moi object voi id that luon, ma khong can tao tam => offlineId se khong co
    // VD: khi tao moi thread chat 1-1, threadId = 'cid.' + userId => Day la id that luon, va khong can tim thay the nua.
    if (payload[j].offlineId === payload[j].id) {
      continue;
    }
    let objectStateKey = null;
    const edgeArr = [];
    // let edgeStateKey = null;
    // let parentId = null;
    for (let i = 0; i < stateKeys.length; i += 1) {
      const key = stateKeys[i];
      if (!original.payload[key].first) {
        continue;
      }
      // Tim lai stateKey cua list object can update offlineId
      const isObject =
        original.payload[key].first() &&
        original.payload[key].first().get('data');
      if (isObject && !objectStateKey) {
        if (original.payload[key].get(payload[j].offlineId)) {
          objectStateKey = key;
        }
      }
      // Tim lai stateKey cua list id can update offlineId
      const isEdge =
        original.payload[key].first() &&
        original.payload[key].first().get('itemIds');
      if (isEdge) {
        if (original.payload[key].get(payload[j].offlineId)) {
          edgeArr.push({
            edgeStateKey: key,
          });
        } else {
          const parentIds = original.payload[key].keySeq();
          // eslint-disable-next-line no-loop-func
          parentIds.forEach(_parentId => {
            if (
              original.payload[key]
                .getIn([_parentId, 'itemIds'])
                .includes(payload[j].offlineId)
            ) {
              edgeArr.push({
                parentId: _parentId,
                edgeStateKey: key,
              });
            }
          });
        }
      }
    }
    for (let n = 0; n < j; n += 1) {
      for (let m = 0; m < edgeArr.length; m += 1) {
        if (edgeArr[m].parentId === payload[n].offlineId) {
          edgeArr[m].parentId = payload[n].id;
        }
      }
    }
    yield put(
      objectActions.updateNewId(
        payload[j].offlineId,
        payload[j].id,
        objectStateKey,
      ),
    );
    for (let k = 0; k < edgeArr.length; k += 1) {
      yield put(
        edgeActions.updateNewId(
          edgeArr[k].parentId,
          payload[j].offlineId,
          payload[j].id,
          edgeArr[k].edgeStateKey,
        ),
      );
      yield put(
        edgeActions.remove(
          edgeArr[k].parentId,
          payload[j].offlineId,
          edgeArr[k].edgeStateKey,
        ),
      );
    }
    yield put(objectActions.remove(payload[j].offlineId, objectStateKey));
  }
  yield put({type: OBJECT_POST.AFTER_UPDATE_STATE_API, payload, original});
};

/*
 * Watcher.
 */

// Handle action : postUi.
const watchPostObject = function* watchPostObject() {
  while (true) {
    const requestAction = yield take(OBJECT_API.POST_UI);
    yield fork(doFetchPostObject, requestAction);
  }
};

// Handle response : post.
const watchPostObjectSuccess = function* watchPostObjectSuccess() {
  while (true) {
    const fetchResult = yield take(isPostObjectSuccessAction);
    yield fork(doPostObjectSuccess, fetchResult);
  }
};

export {watchPostObject, watchPostObjectSuccess};
