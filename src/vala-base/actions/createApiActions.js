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

import createActions from './createActions';

/**
 * createApiActions: Tạo một list action có API
 * @param {*} actions
 * @param {*} stateKey
 * @param {*} statePath
 */
const createApiActions = (actions, stateKey, statePath = []) =>
  Object.keys(actions).reduce((_final, key) => {
    const final = _final;
    final[key] = createActions(actions[key], stateKey, statePath);
    return final;
  }, {});

export default createApiActions;
