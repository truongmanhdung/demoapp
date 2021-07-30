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
import { UPDATE_BRANCH_TYPE } from '../configs/Constants';

// CuongNT: Khong dong goi original vao action loai nay. Chi ActionApi moi can dong original de su dung sau khi server response ve.

const OBJECT_ACTIONS = {
  ADD: 'OBJECT_ADD',
  ADD_LIST: 'OBJECT_ADD_LIST',
  REMOVE: 'OBJECT_REMOVE',
  REMOVE_LIST: 'OBJECT_REMOVE_LIST',
  UPDATE: 'OBJECT_UPDATE',
  PATCH: 'OBJECT_PATCH',
  UPDATE_FIELDS: 'OBJECT_UPDATE_FIELDS',
  UPDATE_NEW_ID: 'OBJECT_UPDATE_NEW_ID',
  CLEAR: 'OBJECT_CLEAR',
};

// Thêm mới một object.
const add = (_object, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.ADD, { object: _object }, null, { statePath, stateKey });

// Thêm mới nhiều object.
const addList = (objects, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.ADD_LIST, { objects }, null, { statePath, stateKey });
// Xóa một object.
const remove = (id, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.REMOVE, { id }, null, { statePath, stateKey });

// Xóa nhiều object.
const removeList = (objectIds, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.REMOVE_LIST, { objectIds }, null, { statePath, stateKey });

// Cập nhập dữ liệu của môt object.
const update = (id, data, stateKey, statePath = [], updateBranchType = UPDATE_BRANCH_TYPE.UPDATE_AT_DATA, updateObjectType) => createActionNoAppID(OBJECT_ACTIONS.UPDATE, { id, data }, null, {
  statePath, stateKey, updateBranchType, updateObjectType,
});

// Cập nhập một phần dữ liệu cảu một object.
const patch = (id, data, stateKey, statePath = [], updateBranchType = UPDATE_BRANCH_TYPE.UPDATE_AT_DATA) => createActionNoAppID(OBJECT_ACTIONS.PATCH, { id, data }, null, { statePath, stateKey, updateBranchType });

// Cập nhập offlineId thành newId.
const updateNewId = (offlineId, id, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.UPDATE_NEW_ID, { offlineId, id }, null, { statePath, stateKey });

// Xóa nhiều object.
const clear = (objectIds, stateKey, statePath = []) => createActionNoAppID(OBJECT_ACTIONS.CLEAR, { objectIds }, null, { statePath, stateKey });

const objectActions = {
  add,
  addList,
  remove,
  removeList,
  update,
  patch,
  updateNewId,
  clear,
};

export {
  OBJECT_ACTIONS,
  objectActions,
};
