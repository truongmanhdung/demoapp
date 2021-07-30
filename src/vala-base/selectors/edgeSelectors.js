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
import {EmptyOrderedSet} from '../utils/immutableHelper';

/**
 * getSelf
 * @param {*} state
 */
const getSelf = state => state;

/**
 * getList: getList các itemId
 * @param {*} state
 * @param {*} parentIds
 */
// const getList = (state, parentIds) => state.filter((object, key) => parentIds.includes(key));

const getParentIds = (state, parentIds) => parentIds;

/**
 * makeGetList: (reselect)
 */
const makeGetList = getState =>
  createSelectorLib([getState, getParentIds], (state, parentIds) => {
    if (parentIds.size === 0) {
      return EmptyMap;
    }

    const result = Map();
    return result.withMutations(clone => {
      parentIds.forEach(id => {
        clone.set(id, state.get(id));
      });
    });
  });

/**
 * getItemIds: Lấy tất cả các id trong itemIds.
 * @param {*} state
 * @param {*} parentId
 */
const getItemIds = (state, parentId) =>
  state.getIn([parentId, 'itemIds'])
    ? state.getIn([parentId, 'itemIds'])
    : EmptyOrderedSet;

/**
 * getItems: Lấy tất cả các object theo parentId.
 * @param {*} state
 * @param {*} parentId
 */
const getItems = (state, parentId) => state.getIn([parentId, 'items']);

/**
 * getItem: Get một object.
 * @param {*} state
 * @param {*} parentId
 * @param {*} id
 */
const getItem = (state, parentId, id) => state.getIn([parentId, 'items', id]);

/**
 * getItemField: Get một trường trong môt object.
 * @param {*} state
 * @param {*} parentId
 * @param {*} id
 * @param {*} field
 */
const getItemField = (state, parentId, id, field) =>
  state.getIn([parentId, 'items', id, 'data', field]);

/**
 * getMinScore: Get giá trị minScore của một cạnh.
 * @param {*} state
 * @param {*} parentId
 */
const getMinScore = (state, parentId) => state.getIn([parentId, 'minScore']);

/**
 * getMaxScore: Get giá trị maxScore của một cạnh.
 * @param {*} state
 * @param {*} parentId
 */
const getMaxScore = (state, parentId) => state.getIn([parentId, 'maxScore']);

/**
 * getTotal: Get tổng số lượng itemId của một cạnh.
 * @param {*} state
 * @param {*} parentId
 */
const getTotal = (state, parentId) => state.getIn([parentId, 'total']);

/**
 * getIndex: Get giá trị index của một cạnh.
 * @param {*} state
 * @param {*} parentId
 */
const getIndex = (state, parentId) => state.getIn([parentId, 'index']);

/**
 * Dieu kien tim kiem khi get list. VD: /newfeed?type=task.
 */
/**
 * getSearchParams: Get giá trị SearchParams.
 * @param {*} state
 * @param {*} parentId
 */
const getSearchParams = (state, parentId) =>
  state.getIn([parentId, 'searchParams']);

/**
 * getInfo: .
 * @param {*} state
 * @param {*} parentId
 * @param {*} info
 */
const getInfo = (state, parentId, info) => state.getIn([parentId, info]);

export {
  getSelf,
  getItem,
  getItemIds,
  getItemField,
  getItems,
  getMaxScore,
  getMinScore,
  getTotal,
  getIndex,
  getSearchParams,
  getInfo,
  makeGetList,
};
