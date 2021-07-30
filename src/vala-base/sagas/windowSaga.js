/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 19/10/18.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

window.objectIds = {};

const doUpdateCountObjectRender = function doUpdateCountObjectRender(
  id,
  count,
) {
  window.objectIds[id] = count;
};

const doAddObjectData = function doAddObjectData(id) {
  window.objectIds[id] = 1;
};

const doDeleteUserData = function doDeleteUserData(ids) {
  window.objectIds = window.objectIds.filter(item => !ids.includes(item));
};

window.ids = {};

const doAddOfflineId = function doAddOfflineId(offlineId) {
  window.ids[offlineId] = offlineId;
};

const doAddIds = function doAddIds(id, offlineId) {
  if (window.ids[offlineId]) {
    window.ids[offlineId] = id;
  }
};

const doRemoveOfflineIds = function doRemoveOfflineIds(ids) {
  for (const [key, value] of Object.entries(window.ids)) {
    delete window.ids[key];
  }
};

export {
  doUpdateCountObjectRender,
  doAddObjectData,
  doDeleteUserData,
  doAddIds,
  doAddOfflineId,
  doRemoveOfflineIds,
};
