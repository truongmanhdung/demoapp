/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 06/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */


import { createActionNoAppID, createFetchTypes } from '../actions';
import checkPropertiesIsRequired from '../utils/checkPropertiesIsRequired';
import convertToImmutableJs from '../utils/convertToImmutableJs';

// const.
const EDGE_API = {
  GET: createFetchTypes('EDGE_GET_API'),
  GET_UI: 'EDGE_GET_UI',
  POST: createFetchTypes('EDGE_POST_API'),
  POST_UI: 'EDGE_POST_UI',
  PUT: createFetchTypes('EDGE_PUT_API'),
  PUT_UI: 'EDGE_PUT_UI',
  PATCH: createFetchTypes('EDGE_PATCH_API'),
  PATCH_UI: 'EDGE_PATCH_UI',
  DELETE: createFetchTypes('EDGE_DELETE_API'),
  DELETE_UI: 'EDGE_DELETE_UI',
  PUT_LIST: createFetchTypes('EDGE_PUT_LIST_API'),
  PUT_LIST_UI: 'EDGE_PUT_LIST_UI',
  POST_LIST: createFetchTypes('EDGE_POST_LIST_API'),
  POST_LIST_UI: 'EDGE_POST_LIST_UI',
};

/*
 * Action khi server trả về dữ liệu 1 mối quan hệ theo yêu cầu.
 */
const get = {
  request: (original) => createActionNoAppID(EDGE_API.GET.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.GET.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.GET.FAILURE, error, original),
};

/*
 * Action lấy dữ liệu 1 mối quan hệ theo yêu cầu.
 */
const getUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'id', 'selector', 'api');
  return createActionNoAppID(EDGE_API.GET_UI, payload, null, condition);
};

/*
 * Action khi server trả về sau khi tạo xong 1 mối quan hệ mới, vd: thêm người dùng vào phòng ban (tạo mối quan hệ người dùng <-> phòng ban)
 */
const post = {
  request: (original) => createActionNoAppID(EDGE_API.POST.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.POST.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.POST.FAILURE, error, original),
};

/*
 * Action tạo 1 mối quan hệ mới.
 */
const postUi = (payload, condition) => {
  checkPropertiesIsRequired(
    condition,
    'parentId',
    'id',
    'selector',
    'api',
    'stateKey',
  );
  return createActionNoAppID(EDGE_API.POST_UI, payload, null, condition);
};

/*
 * Action khi server trả về sau khi cập nhật dữ liệu của 1 mối quan hệ, vd: cập nhật vai trò, chức vụ/chức danh của 1 người dùng trong 1 phòng ban
 */
const put = {
  request: (original) => createActionNoAppID(EDGE_API.PUT.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.PUT.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.PUT.FAILURE, error, original),
};

/*
* Action cập nhập dữ liệu của 1 mối quan hệ.
*/
const putUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'id', 'selector', 'api', 'stateKey');
  return createActionNoAppID(EDGE_API.PUT_UI, payload, null, condition);
};

/*
 * Action khi server trả về sau khi cập nhật 1 phần dữ liệu của 1 mối quan hệ, vd: cập nhật nickname của thành viên trong nhóm chat (ngoài nickname còn có lastSent, lastRead...)
 */
const patch = {
  request: (original) => createActionNoAppID(EDGE_API.PATCH.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.PATCH.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.PATCH.FAILURE, error, original),
};

/*
* Action cập nhập 1 phần dữ liệu của 1 mối quan hệ.
*/
const patchUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'id', 'selector', 'api', 'stateKey');
  return createActionNoAppID(EDGE_API.PATCH_UI, payload, null, condition);
};

/*
 * Action khi server trả về sau khi xóa 1 mối quan hệ, vd: Xóa người dùng khỏi phòng ban (chỉ xóa quan hệ, người dùng không bị xóa).
 */
const remove = {
  request: (original) => createActionNoAppID(EDGE_API.DELETE.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.DELETE.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.DELETE.FAILURE, error, original),
};

/*
* Action xóa mối 1 mối quan hệ.
*/
const removeUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'id', 'selector', 'api', 'stateKey');
  return createActionNoAppID(EDGE_API.DELETE_UI, payload, null, condition);
};

/*
 * Action khi server trả về sau khi cập nhật dữ liệu của nhiều mối quan hệ, vd: cập nhật vai trò, chức vụ/chức danh của 1 người dùng trong 1 phòng ban
 */
const putList = {
  request: (original) => createActionNoAppID(EDGE_API.PUT_LIST.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.PUT_LIST.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.PUT_LIST.FAILURE, error, original),
};

/*
* Action cập nhập dữ liệu của nhiều mối quan hệ.
*/
const putListUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'selector', 'api', 'stateKey');
  return createActionNoAppID(EDGE_API.PUT_LIST_UI, payload, null, condition);
};

/*
* Action khi server trả về sau khi thêm mới nhiều mối quan hệ, vd : Thêm mới nhiều thành viên vào trong group.
*/
const postList = {
  request: (original) => createActionNoAppID(EDGE_API.POST_LIST.REQUEST, original),
  success: (original, response) => createActionNoAppID(EDGE_API.POST_LIST.SUCCESS, convertToImmutableJs(response), original),
  failure: (original, error) => createActionNoAppID(EDGE_API.POST_LIST.FAILURE, error, original),
};

/*
* Action thêm mới nhiều mối quan hệ.
*/
const postListUi = (payload, condition) => {
  checkPropertiesIsRequired(condition, 'parentId', 'selector', 'api', 'stateKey');
  return createActionNoAppID(EDGE_API.POST_LIST_UI, payload, null, condition);
};

const edgeApi = {
  // Api.
  get,
  post,
  put,
  patch,
  remove,
  putList,
  postList,
  // Ui.
  getUi,
  postUi,
  putUi,
  patchUi,
  removeUi,
  putListUi,
  postListUi,
};

export {
  EDGE_API,
  edgeApi,
};
