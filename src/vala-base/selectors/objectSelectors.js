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

import {Map} from 'immutable';
import {EmptyMap} from '../utils/immutableHelper';
import {createSelector as createSelectorLib} from 'reselect';

/**
 * get: Lấy một object
 * @param {*} state
 * @param {*} id
 */
const get = (state, id) => state.get(id);

const getIds = (state, ids) => ids;
/**
 * makeGetList: (reselect) Tạo selector lấy tất cả các object theo list các id tương ứng.
 */
const makeGetList = getState =>
  createSelectorLib([getState, getIds], (state, ids) => {
    // TODO by NhatPA: Như này chưa tối ưu, thay thế bằng cách phía dưới
    // return state.filter((object) => ids.includes(object.getIn(['data', 'id'])));
    if (ids.size === 0) {
      return EmptyMap;
    }
    const result = Map();
    return result.withMutations(clone => {
      ids.forEach(id => {
        clone.set(id, state.get(id));
      });
    });
  });

/**
 * getAll: Lấy tất cả các cục state.
 * @param {*} state
 */
const getAll = state => state;

/**
 * getAll: Lấy một giá trị trong một object.
 * @param {*} state
 * @param {*} id
 * @param {*} field
 */
const getField = (state, id, ...field) => state.getIn([id, 'data', ...field]);

/**
 * getAll: Lấy thông tin cho một object.
 * @param {*} state
 * @param {*} id
 * @param {*} info
 */
const getInfo = (state, id, info) => state.getIn([id, info]);

export {getAll, get, makeGetList, getField, getInfo};
