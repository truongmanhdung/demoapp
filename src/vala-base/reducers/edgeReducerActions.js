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


import createActionNoAppID from '../actions/createActionNoAppID';
import { ACTION_TYPE } from '../configs/Constants';

const EDGE_ACTIONS = {
  ADD_LIST: 'EDGE_ADD_LIST',
  ADD: 'EDGE_ADD',
  REMOVE: 'EDGE_REMOVE',
  REMOVE_ALL: 'EDGE_REMOVE_ALL',
  UPDATE: 'EDGE_UPDATE',
  PATCH: 'EDGE_PATCH',
  CLEAR: 'EDGE_CLEAR',
  UPDATE_LIST: 'EDGE_UPDATE_LIST',
  UPDATE_NEW_ID: 'EDGE_UPDATE_NEW_ID',
  UPDATE_SEARCH_PARAMS: 'EDGE_UPDATE_SEARCH_PARAMS',
  ADD_SEARCH_PARAMS: 'EDGE_ADD_SEARCH_PARAMS',
  UPDATE_INFO: 'EDGE_UPDATE_INFO',
  ADD_INFO: 'EDGE_ADD_INFO',
  CLEAR_LIST: 'EDGE_CLEAR_LIST',
};

// Thêm mới một edge.
const add = (parentId, id, data, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.ADD, { parentId, id, data }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Thêm mới list edge.
const addList = (getType, actionType = ACTION_TYPE.GET_LIST, objectIds, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys, mergeStateKeys, offlineId) => createActionNoAppID(EDGE_ACTIONS.ADD_LIST, { getType, actionType, objectIds }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys, mergeStateKeys, offlineId,
});

// Xóa một edge.
const remove = (parentId, id, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.REMOVE, { parentId, id }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Xóa tất cả edge của parentId.
const removeAll = (parentId, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.REMOVE_ALL, { parentId }, null, {
  stateKey, statePath, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập dữ liệu cảu một edge.
const update = (parentId, id, data, stateKey, statePath = [], isPatch = false, mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.UPDATE, { parentId, id, data }, null, {
  statePath, stateKey, isPatch, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập dữ liệu của nhiều edge.
const updateList = (parentId, data, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys, mergeStateKeys) => createActionNoAppID(EDGE_ACTIONS.UPDATE_LIST, { parentId, data }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys, mergeStateKeys,
});

// Cập nhập một phần dữ liệu của một edge.
const patch = (parentId, id, data, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.PATCH, { parentId, id, data }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập một phần dữ liệu của một edge.
const patchList = (parentId, data, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.PATCH, { parentId, data }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Thêm mới searchParam.
const addSearchParams = (parentId, searchParams, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.ADD_SEARCH_PARAMS, { parentId, searchParams }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập searchParams của request getList
const updateSearchParams = (parentId, searchParams, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.UPDATE_SEARCH_PARAMS, { parentId, searchParams }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Thêm mới dữ liệu trường Info.
const addInfo = (parentId, infoKey, infoData, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.ADD_INFO, { parentId, infoKey, infoData }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập dữ liệu trường Info.
const updateInfo = (parentId, infoKey, infoData, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.UPDATE_INFO, { parentId, infoKey, infoData }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Cập nhập offlineId thành NewId.
const updateNewId = (parentId, offlineId, id, stateKey, statePath = [], mainStateKey, searchKey, searchStateKeys) => createActionNoAppID(EDGE_ACTIONS.UPDATE_NEW_ID, { parentId, id, offlineId }, null, {
  statePath, stateKey, mainStateKey, searchKey, searchStateKeys,
});

// Xóa tất cả dữ liệu.
const clear = (parentId, itemIdsIgnore, stateKey, statePath = [], listIdsItems) => createActionNoAppID(EDGE_ACTIONS.CLEAR, { parentId, itemIdsIgnore, listIdsItems }, null, { statePath, stateKey });

// Xóa dữ liệu theo lô.
const clearList = (parentIds, stateKey, statePath = []) => createActionNoAppID(EDGE_ACTIONS.CLEAR_LIST, { parentIds }, null, { statePath, stateKey });

const edgeActions = {
  add,
  addList,
  remove,
  removeAll,
  update,
  updateList,
  patch,
  patchList,
  addSearchParams,
  updateSearchParams,
  addInfo,
  updateInfo,
  updateNewId,
  clear,
  clearList,
};

export {
  EDGE_ACTIONS,
  edgeActions,
};
