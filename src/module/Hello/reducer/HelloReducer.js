/**
 * Copyright 2021-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 10/7/2021.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import createFilteredReducer from '../../../vala-base/reducers/createFilteredReducer';
import {objectReducer} from '../../../vala-base/reducers';
import storeConfig from '../../../vala-base/configs/storeConfig';

const add = (state, action) => {
  // Add to state
  return state;
};

const _stateKey = storeConfig.hello;

const helloReducer = createFilteredReducer(objectReducer, action => {
  if (!action.condition || !action.condition.stateKey) {
    return false;
  }
  const {stateKey} = action.condition;
  const statePath = action.condition.statePath || [];
  return stateKey === _stateKey && statePath.length === 0;
});

export default helloReducer;
