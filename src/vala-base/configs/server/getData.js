/**
 * Copyright 2016-present, Bkav, Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author hieunvb@bkav.com on 20/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {callApi} from '../../apis/callApi';

const getData = async finishSuccess => {
  const options = {
    method: 'GET',
  };
  // TODO NamVH: Khóa bản hcdt.
  // const data = process.env.VERSION === 'hcdt' ? 'configServerHCDT.json' : 'configServerBKAV.json';
  const data = 'configServerHCDT.json';
  // const data = 'configServerHCDT.json';
  const url = `${window.location.origin}/${data}`;
  return callApi(url, options).then(response => {
    finishSuccess();
    return response;
  });
};

export default getData;
