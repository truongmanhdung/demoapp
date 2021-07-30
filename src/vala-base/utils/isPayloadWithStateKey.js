/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 09/02/2018.
 *
 * History:
 * @modifier hieunvb@bkav.com - 22/02/2018 đã thay hàm isPayloadWithStateKey để tính được cho cả trường hợp key đầu tiên không có dữ liệu
 */

import {isImmutable} from 'immutable';

const isPayloadWithStateKey = payload => {
  let flag = false;
  const rootKeys = Object.keys(payload);
  rootKeys.every(rootKey => {
    if (!payload[rootKey]) {
      return true;
    } // Key không có data bên trong
    // HieuNVb - Bổ sung trường hợp dữ liệu được convert sang immutbale qua hàm convertToImmutableJs
    if (isImmutable(payload[rootKey])) {
      const branchKeys = payload[rootKey].keySeq().toArray();
      branchKeys.every(branchKey => {
        const branch = payload[rootKey].get(branchKey);
        if (branch) {
          const leafKeys = branch.keySeq().toArray();
          flag =
            leafKeys.includes('data') ||
            leafKeys.includes('itemIds') ||
            leafKeys.includes('items');
          return !flag; // every sẽ dừng lại nếu flag = true (!flag = false)
        }
        return true; // chạy tiếp để duyệt branchKey tiếp theo
      });
      return !flag; // every sẽ dừng lại nếu flag = true
    }
    // Trường hợp không phải immutable
    const branchKeys = Object.keys(
      typeof payload[rootKey] === 'object' ? payload[rootKey] : {},
    );
    if (branchKeys.length > 0) {
      branchKeys.every(branchKey => {
        const branch = payload[rootKey][branchKey];
        if (branch) {
          const leafKeys = Object.keys(branch);
          flag =
            leafKeys.includes('data') ||
            leafKeys.includes('itemIds') ||
            leafKeys.includes('items');
          return !flag; // every sẽ dừng lại nếu flag = true (!flag = false)
        }
        return true; // chạy tiếp để duyệt branchKey tiếp theo
      });
    }
    return !flag; // every sẽ dừng lại nếu flag = true
  });

  return flag;
};

export default isPayloadWithStateKey;
