/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 20/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */


// API XỬ LÝ NHIỀU CẠNH

import BaseApi from './BaseApi';
import { configServer } from '../configs/server/configServer';

/**
 * - url: /v1/{id}/{edge}
 *
 * Ho tro cac request dang sau:
 * - post: tạo mới 1 hoặc nhiều edges.
 * - put/patch: cập nhật 1 hoặc nhiều edges.
 */
class EdgesApi extends BaseApi {
  constructor(edge, headers = {}, uriInfo, url) {
    // HieuNVb bổ sung để xử lý các trường hợp pattern uri chưa có trong base và cần truyền trực tiếp
    if (!url) {
      // if (edge.endsWith('s')) throw new Error('EdgesApi::constructor::edge KHÔNG ĐƯỢC chứa kí tự "s" ở cuối.');
      const _uriInfo = { ...configServer.URI_INFO_DEFAULT(), ...uriInfo };
      const uriPattern = `${_uriInfo.ssl ? 'https' : 'http'}://${_uriInfo.domain}:${_uriInfo.port}/{parentId}/${edge}`;
      super(uriPattern, headers);
    } else {
      super(url, headers);
    }
    this.putList = this.putList.bind(this);
    this.post = this.post.bind(this);
    this.postList = this.postList.bind(this);
  }

  // eslint-disable-next-line no-unused-vars
  get(parentId, body, headers = {}) {
    throw new Error('EdgesApi::get không hỗ trợ phương thức này');
  }

  /**
     * Tạo mới theo lô 1 edge
     */
  postList(parentId, body, headers = {}) {
    const uriParams = { parentId };
    return super.post(uriParams, body, headers);
  }

  /**
     * Cập nhật theo lô nhiều cạnh
     */
  putList(parentId, body, headers = {}) {
    const uriParams = { parentId };
    return super.put(uriParams, body, headers);
  }

  /**
     * Cập nhật từng phần nhiều cạnh
     */
  patchList(parentId, body, headers = {}) {
    const uriParams = { parentId };
    return super.patch(uriParams, body, headers);
  }

  // eslint-disable-next-line no-unused-vars
  delete(parentId, headers = {}) {
    throw new Error('EdgesApi::delete không hỗ trợ phương thức này');
  }
}

export default EdgesApi;
