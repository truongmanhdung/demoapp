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

import createSelector from '../../../vala-base/selectors/createSelector';
import storeConfig from '../../../vala-base/configs/storeConfig';
import * as objectSelector from '../../../vala-base/selectors/objectSelectors';

const statePath = [storeConfig.hello];

const helloSelector = createSelector(objectSelector, statePath);

const getFirstUserName = state => {
  return state.getIn(statePath).first()?.getIn(['data', 'account']);
};

helloSelector.getFirstUserName = getFirstUserName;

export default helloSelector;
