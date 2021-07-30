/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author namvh@bkav.com on 18/07/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */


import { List } from 'immutable';

// Tham khảo issues dưới đây.
// https://github.com/immutable-js/immutable-js/issues/1452?fbclid=IwAR0-IR6OBom-CYQvi5NcThKXGCOrVRNZS2BCkbHaThaARiDRymF-aO2y0os
const isMergeable = (a) => (
  a && typeof a === 'object' && typeof a.mergeWith === 'function' && !List.isList(a)
);

const mergeDeep = (a, b) => {
  // If b is null, it would overwrite a, even if a is mergeable
  if (isMergeable(a) && b !== null) {
    return a.mergeWith(mergeDeep, b);
  }

  if (!List.isList(a) || !List.isList(b)) {
    return b;
  }

  return b.reduce((acc, nextItem, index) => {
    const existingItem = acc.get(index);
    if (isMergeable(existingItem)) {
      return acc.set(index, existingItem.mergeWith(mergeDeep, nextItem));
    }

    return acc.set(index, nextItem);
  }, a);
};

const mergeDeepOverwriteLists = (a, b) => {
  // If b is null, it would overwrite a, even if a is mergeable
  if (b === null) return b;

  if (isMergeable(a) && !List.isList(a)) {
    return a.mergeWith(mergeDeepOverwriteLists, b);
  }

  return b;
};

export {
  mergeDeep,
  mergeDeepOverwriteLists,
};
