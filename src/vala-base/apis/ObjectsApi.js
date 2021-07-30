/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 08/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

// API XỬ LÝ NHIỀU OBJECT

import BaseApi from './BaseApi';

import {GET_LIST_TYPE} from '../configs/Constants';
import {configServer} from '../configs/server/configServer';

/**
 * - url: /v1/{id}/{edges}
 *
 * Ho tro cac request dang sau:
 * - get: lấy danh sách object liên quan tới object có id={id}, theo loại quan hệ {edges}
 * - post: tạo mới 1 hoặc nhiều objects.
 * - put/patch: cập nhật 1 hoặc nhiều objects.
 */
class ObjectsApi extends BaseApi {
  constructor(edges, headers = {}, uriInfo = {}, url) {
    if (!url) {
      // if (!edges.endsWith('s')) throw new Error('EdgesApi::constructor::edge BẮT BUỘC chứa kí tự "s" ở cuối.');
      const _uriInfo = {...configServer.URI_INFO_DEFAULT(), ...uriInfo};
      const uriPattern = `${_uriInfo.ssl ? 'https' : 'http'}://${
        _uriInfo.domain
      }:${_uriInfo.port}/{parentId}/${edges}`;
      super(uriPattern, headers);
    } else {
      super(url, headers);
    }
    this.getList = this.getList.bind(this);
    this.post = this.post.bind(this);
  }

  // LUU Y: Hàm này không cần lớp con override lại mà dùng luôn. Chỉ override lại khi cần trả giữ liệu giả lập khi test.
  getList(parentId, currentScore, getType, _body, headers = {}) {
    const uriParams = {parentId};
    const body = _body || {};
    if (!getType || getType === GET_LIST_TYPE.FIRST) {
      body.maxscore = 0;
      body.minscore = 0;
    } else if (getType === GET_LIST_TYPE.MID) {
      delete body.minscore;
      delete body.maxscore;
      body.newest = 0;
    } else if (getType === GET_LIST_TYPE.NEWEST) {
      delete body.minscore;
      delete body.maxscore;
      body.newest = 1;
    } else if (getType === GET_LIST_TYPE.OLDER) {
      delete body.minscore;
      body.maxscore = currentScore;
    } else {
      delete body.maxscore;
      body.minscore = currentScore;
    }
    return super.get(uriParams, body, headers);
  }

  /**
   * Tạo mới 1 object hoặc tạo mới theo lô 1 object
   */
  post(parentId, body, headers = {}) {
    const uriParams = {parentId};
    return super.post(uriParams, body, headers);
  }

  // eslint-disable-next-line no-unused-vars
  put(parentId, body, headers = {}) {
    throw new Error('ObjectsApi::put không hỗ trợ phương thức này');
  }

  // eslint-disable-next-line no-unused-vars
  patch(parentId, body, headers = {}) {
    throw new Error('ObjectsApi::patch không hỗ trợ phương thức này');
  }

  // eslint-disable-next-line no-unused-vars
  delete(parentId, headers = {}) {
    throw new Error('ObjectsApi::delete không hỗ trợ phương thức này');
  }
}

export default ObjectsApi;
