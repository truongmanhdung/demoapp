/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author CuongNTg@bkav.com on 25/01/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {configServer} from '../../../vala-base/configs/server/configServer';
import storeConfig from '../../../vala-base/configs/storeConfig';
import EdgeApi from '../../../vala-base/apis/EdgeApi';

const header = {};

class EdgeHellApi extends EdgeApi {
  constructor() {
    super('hello', header, configServer.DOMAIN_URL());
  }

  getList() {
    return {
      response: {
        [storeConfig.helloIds]: [],
        [storeConfig.hello]: {},
      },
    };
  }

  post(meId, data) {
    return {
      response: [{}],
    };
  }
}

const edgeHellApi = new EdgeHellApi();

export default edgeHellApi;
