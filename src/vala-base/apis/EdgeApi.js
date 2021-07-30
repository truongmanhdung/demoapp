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

import BaseApi from './BaseApi';
import {configServer} from '../configs/server/configServer';

// API XỬ LÝ 1 CẠNH.

/**
 * - url: /v1/{parentId}/{edge}/{id}
 *
 * Ho tro cac request dang sau:
 * - get: lấy dữ liệu của 1 mối quan hệ giữa 2 đối tượng.
 * - post: tạo mới 1 mối quan hệ.
 * - put/patch: sửa toàn bộ/sửa 1 phần cạnh quan hệ giữa 2 đối tượng.
 * - delete: xóa hẳn cạnh quan hệ giữa 2 đối tượng.
 */
class EdgeApi extends BaseApi {
  constructor(edge, headers = {}, uriInfo, url) {
    // if (edge.endsWith('s')) throw new Error('EdgesApi::constructor::edge KHÔNG ĐƯỢC chứa kí tự "s" ở cuối.');
    if (!url) {
      const _uriInfo = {...configServer.URI_INFO_DEFAULT(), ...uriInfo};
      const uriPattern = `${_uriInfo.ssl ? 'https' : 'http'}://${
        _uriInfo.domain
      }:${_uriInfo.port}/{parentId}/${edge}/{id}`;
      // const uriPattern = `http://10.2.22.117:8000/{parentId}/${edge}/{id}`;
      super(uriPattern, headers);
    } else {
      super(url, headers);
    }
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }

  // LUU Y: Hàm này không cần lớp con override lại mà dùng luôn. Chỉ override lại khi cần trả giữ liệu giả lập khi test.
  /**
   * Lấy dữ liệu của 1 mối quan hệ giữa 2 đối tượng.
   */
  get(parentId, id, headers = {}) {
    const uriParams = {parentId, id};
    return super.get(uriParams, headers);
  }

  /**
   * Tạo mới 1 mối quan hệ giữa 2 đối tượng
   * LUU Y: body = items.id1.data. Tuc body chinh la du lieu canh.
   */
  post(parentId, id, body, headers = {}) {
    const uriParams = {parentId, id};
    return super.post(uriParams, body, headers);
  }

  /**
   * Cập nhật toàn bộ dữ liệu 1 mối quan hệ giữa 2 đối tượng
   * LUU Y: body = items.id1.data. Tuc body chinh la du lieu canh.
   */
  put(parentId, id, body, headers = {}) {
    const uriParams = {parentId, id};
    return super.put(uriParams, body, headers);
  }

  /**
   * Cập nhật 1 phần dữ liệu 1 mối quan hệ giữa 2 đối tượng
   * LUU Y: body = items.id1.data. Tuc body chinh la du lieu canh.
   */
  patch(parentId, id, body, headers = {}) {
    const uriParams = {parentId, id};
    return super.patch(uriParams, body, headers);
  }

  // LUU Y: Hàm này không cần lớp con override lại mà dùng luôn. Chỉ override lại khi cần trả giữ liệu giả lập khi test.
  /**
   * Xóa bỏ 1 mối quan hệ giữa 2 đối tượng
   */
  delete(parentId, id, headers = {}) {
    const uriParams = {parentId, id};
    return super.delete(uriParams, headers);
  }
}

export default EdgeApi;
