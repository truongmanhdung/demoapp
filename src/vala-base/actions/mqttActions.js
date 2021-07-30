/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 22/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import createActionNoAppID from './createActionNoAppID';
import convertToImmutableJs from '../utils/convertToImmutableJs';

export const MQTT = {
  MESSAGE_ARRIVED: 'MQTT_MESSAGE_ARRIVED',
  CONNECTED: 'MQTT_CONNECTED',
  DISCONNECTED: 'MQTT_DISCONNECTED',
};

/**
 * arrived: Hành động nhận các gói tin từ mqtt nhận được.
 * @param {*} payload
 * @param {*} condition
 */
export const arrived = (
  _payload,
  condition,
  needConverToImmutableJS = true,
) => {
  const payload = _payload;
  if (needConverToImmutableJS && payload.body) {
    payload.body = convertToImmutableJs(payload.body);
  }
  return createActionNoAppID(MQTT.MESSAGE_ARRIVED, payload, null, condition);
};

/**
 * connected: Hành động connect mqtt
 * @param {*} payload
 * @param {*} condition
 */
export const connected = (payload, condition) =>
  createActionNoAppID(MQTT.CONNECTED, payload, null, condition);

/**
 * disconnected: Hành động disconnect mqtt
 * @param {*} payload
 * @param {*} condition
 */
export const disconnected = (payload, condition) =>
  createActionNoAppID(MQTT.DISCONNECTED, payload, null, condition);
