/**
 * Copyright 2016-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 31/08/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

/**
 * http://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html
 *
 * @param reducerFunction
 * @param reducerPredicate
 * @returns {function(*=, *=)}
 */
export default function createFilteredReducer(
  reducerFunction,
  reducerPredicate,
) {
  return (state, action) => {
    const isInitializationCall = state === undefined;
    const shouldRunWrappedReducer =
      reducerPredicate(action) || isInitializationCall;
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
  };
}
