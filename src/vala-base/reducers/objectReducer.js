/* eslint-disable */
/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 25/10/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

'use strict';

import {fromJS, isImmutable} from 'immutable';

// action.
import {OBJECT_ACTIONS} from './objectReducerActions';

// util.
import createReducer from './createReducer';
import {UPDATE_OBJECT_TYPE, UPDATE_BRANCH_TYPE} from '../configs/Constants';
import convertJSONDataAddListReducer from '../utils/convertJSONDataAddListReducer'

const jsonKeys = ['extend', 'config'];
/*
* XỬ LÝ CHO MỘT ĐỐI TƯỢNG (OBJECT).
*/

const convertJSONKey = (path = []) => object => object.withMutations(clone => {
    jsonKeys.forEach((jsonKey) => {
        const dataStr = object.getIn([...path, jsonKey]);
        if(dataStr) {
            let data = {};
            try {
                data = JSON.parse(dataStr);
            } catch (e) {
                console.warn(`${jsonKey}::add JSON.parse error`);
            }
            clone.setIn([...path, jsonKey], data);
        }
    })
});

export const convertJSONToAdd = convertJSONKey(['data']);
export const convertJSONUpdateFields = convertJSONKey([]);

/*
 * Gọi khi thêm mới một object.
 */
const add = (state, action) => {
    const {object} = action.payload;
    return state.set(object.getIn(['data', 'id']), convertJSONToAdd(object));
};

/*
 * Gọi khi cập nhập data của một object.
 */
const update = (state, action) => {
    const {id, data} = action.payload;
    const {updateBranchType, updateObjectType} = action.condition;
    if (updateBranchType === UPDATE_BRANCH_TYPE.UPDATE_AT_STATE_KEY) {
        const dataTmp = data[Object.keys(data)[0]];
        return state.update(id, (_data) => _data ? _data.mergeDeep(dataTmp) : dataTmp);

        // const allStateKeys = Object.keys(data);
        // return state.withMutations(st =>
        //     allStateKeys.forEach(stateKey => {
        //         const dataTmp = data[stateKey];
        //         st.update(id, _data => _data ? _data.mergeDeep(dataTmp) : dataTmp);
        //     })
        // );
    }

    // Trường hợp cần update full object
    if (updateBranchType === UPDATE_BRANCH_TYPE.UPDATE_AT_ID_KEY) {
        if (updateObjectType === UPDATE_OBJECT_TYPE.OVERWRITE) {
            return state.set(id, data);
        }
        const cData = convertJSONToAdd(data);
        return state.update(id, (_data) => _data ? _data.merge(cData) : cData);
    }
    // const cData = convertJSONUpdateFields(data);
    // Trường hợp chỉ cần update vào trong nhánh data của object
    // return state.setIn([id, 'data'], cData);

    const payloadData = convertJSONUpdateFields(data);
    return state.updateIn([id, 'data'], (_data) => {
        if(!_data) return payloadData;
        return _data.mergeDeep(payloadData).withMutations((mergeData) => {
            const keys = payloadData.keys();
            let key = keys.next();
            while (!key.done) {
                if(jsonKeys.includes(key.value) || !isImmutable(mergeData.get(key.value))) {
                    mergeData.set(key.value, payloadData.get(key.value));
                } else {
                    mergeData.set(key.value, mergeData.get(key.value).mergeDeep(payloadData.get(key.value)));
                }
                key = keys.next();
            }
        });
    });
};

/*
 * Gọi khi cập nhập một phần dữ liệu của một object.
 */
const patch = (state, action) => {
    const {id, data} = action.payload;
    const payloadData = convertJSONUpdateFields(data);

    return state.updateIn([id, 'data'], (_data) => {
        if(!_data) return payloadData;
        return _data.mergeDeep(payloadData).withMutations((mergeData) => {
            const keys = payloadData.keys();
            let key = keys.next();
            while (!key.done) {
                if(jsonKeys.includes(key.value) || !isImmutable(mergeData.get(key.value))) {
                    mergeData.set(key.value, payloadData.get(key.value));
                } else {
                    mergeData.set(key.value, mergeData.get(key.value).mergeDeep(payloadData.get(key.value)));
                }
                key = keys.next();
            }
        });
    });
};

/*
 * Gọi khi xóa một object.
 */
const remove = (state, action) => {
    const {id} = action.payload;
    return state.delete(id);
};

/*
* XỬ LÝ CHO NHIỀU ĐỐI TƯỢNG (OBJECT - LIST).
*/

/*
 * Gọi khi server trả về danh sách tin
 * objects: {objectId1: {}, objectId2: {}...};
 */
export const addList = (state, action) => {
    const {objects} = action.payload;

    const data = convertJSONDataAddListReducer(objects, jsonKeys);
    const keys = data.keys();
    // TODO by NhatPA: Cần viết lại đoạn này, chưa được tối ưu.
    return state.withMutations(clone => {
        let key = keys.next();
        while (!key.done) {

            if(clone.get(key.value)) {
                // Xử lý trương hợp chỉ ghi đè dữ liệu tới cấp data
                clone.set(
                    key.value,
                    data.get(key.value).set(
                        'data',
                        clone.getIn([key.value, 'data']).merge(data.getIn([key.value, 'data'])),
                    )
                );
            } else {
                clone.set(key.value, data.get(key.value));
            }
            key = keys.next();
        }
    });
};

/*
 * Gọi khi xóa list object.
 */
const removeList = (state, action) => {
    const {objectIds} = action.payload;
    return state.withMutations((stateTmp) => {
        objectIds.forEach((id) => stateTmp.delete(id));
    });
};

/*
 * Gọi khi cập nhập các thông tin server trả về khi tạo mới một object.
 */
const updateNewId = (state, action) => {
    const {id, offlineId, createdDate, timestamp} = action.payload;
    // Cập nhập một số thông tin chuẩn do server trả về : id, createDate, timestamp.
    const newObject = state.get(offlineId)
        .setIn(['data', 'id'], id)
        .updateIn(['data', 'createdDate'], (_createdDate) => createdDate ? createdDate : timestamp ? timestamp : _createdDate)
        .updateIn(['data', 'timestamp'], (_timestamp) => createdDate ? createdDate : timestamp ? timestamp : _timestamp);
    return state.set(id, newObject);
};

/*
*  Cập nhập các trường dữ liệu bên trong data.
*/
const updateFields = (state, action) => {
    const {id, fields} = action.payload;
    return state.updateIn([id, 'data'], (data) => data.merge(convertJSONUpdateFields(fields)));
};

/*
 * Xóa toàn bộ dữ liệu.
 */
const clear = (state, action) => {
    const {objectIds} = action.payload;
    return state.withMutations((stateTmp) => {
        objectIds.forEach((id) => stateTmp.delete(id));
    });
};

const defaultHandles = {
    [OBJECT_ACTIONS.ADD]: add,
    [OBJECT_ACTIONS.UPDATE]: update,
    [OBJECT_ACTIONS.PATCH]: patch,
    [OBJECT_ACTIONS.REMOVE]: remove,
    [OBJECT_ACTIONS.ADD_LIST]: addList,
    [OBJECT_ACTIONS.REMOVE_LIST]: removeList,
    [OBJECT_ACTIONS.UPDATE_NEW_ID]: updateNewId,
    [OBJECT_ACTIONS.UPDATE_FIELDS]: updateFields,
    [OBJECT_ACTIONS.CLEAR]: clear,
};

const createObjectReducer = (defaultState = {}) => createReducer(fromJS(defaultState), defaultHandles);

const objectReducer = createObjectReducer();

const overrideObjectReducer = (defaultState = {}, overrideHandles) => {
    const ov = Object.assign({}, defaultHandles, overrideHandles);
    return createReducer(fromJS(defaultState), ov);
};

export default objectReducer;
export { overrideObjectReducer };
