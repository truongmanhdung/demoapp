/* eslint-disable */
/**
 * Copyright 2016-present, Bkav, Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author namvh@bkav.com on 09/11/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */


import getData from './getData';
import {
  DOMAIN_URL,
  DOMAIN_SSO,
  DOMAIN_COOKIE,
  DOMAIN_MXH,
  URI_INFO_DEFAULT,
  MESSENGER_URI_INFO_DEFAULT,
  NOTE_URI_INFO_DEFAULT,
  DOC_URI_INFO_DEFAULT,
  MQTT_URI_INFO_DEFAULT,
  PUSH_URI_INFO_DEFAULT,
  UPLOAD_URI_INFO_DEFAULT,
  CHATBOT_DEFAULT,
  LOCATION,
  ROUTER_DEFAULT,
  CONFIGURATION,
} from '../Constants';

const dataDefault = {
  DOMAIN_URL,
  DOMAIN_SSO,
  DOMAIN_COOKIE,
  DOMAIN_MXH,
  URI_INFO_DEFAULT,
  MESSENGER_URI_INFO_DEFAULT,
  NOTE_URI_INFO_DEFAULT,
  DOC_URI_INFO_DEFAULT,
  MQTT_URI_INFO_DEFAULT,
  PUSH_URI_INFO_DEFAULT,
  UPLOAD_URI_INFO_DEFAULT,
  CHATBOT_DEFAULT,
  LOCATION,
  ROUTER_DEFAULT,
  CONFIGURATION,
  FAVICON: 'favicon.ico',
  TITLE: '',
};

const myConfigServer = (function() {
  // Instance stores a reference to the Singleton
  let instance;
  let data = dataDefault;

  function init() {
    return {

      // Public methods allow get data config.
      async getData(finishSuccess) {
        const _data = await getData(finishSuccess);
        data = _data.response;
      },

      DOMAIN_URL: () => data.DOMAIN_URL,
      IP_URL: () => data.IP_URL,
      DOMAIN_COOKIE: () => data.DOMAIN_COOKIE,
      DOMAIN_MXH: () => data.DOMAIN_MXH,
      URI_INFO_DEFAULT: () => data.URI_INFO_DEFAULT,
      MESSENGER_URI_INFO_DEFAULT: () => data.MESSENGER_URI_INFO_DEFAULT,
      NOTE_URI_INFO_DEFAULT: () => data.NOTE_URI_INFO_DEFAULT,
      DOC_URI_INFO_DEFAULT: () => data.DOC_URI_INFO_DEFAULT,
      MQTT_URI_INFO_DEFAULT: () => data.MQTT_URI_INFO_DEFAULT,
      PUSH_URI_INFO_DEFAULT: () => data.PUSH_URI_INFO_DEFAULT,
      UPLOAD_URI_INFO_DEFAULT: () => data.UPLOAD_URI_INFO_DEFAULT,
      CHATBOT_DEFAULT: () => data.CHATBOT_DEFAULT,
      LOCATION: () => data.LOCATION,
      ROUTER_DEFAULT: () => data.ROUTER_DEFAULT,
      CONFIGURATION: () => data.CONFIGURATION,
      FAVICON: () => data.FAVICON,
      TITLE: () => data.TITLE,
      getDataConfiguration: () => {
        const configuration = data.CONFIGURATION;
        const version = configuration && configuration.version;
        const __data = configuration && configuration.data;
        return __data ? __data[version] : {};
      },
      getVersion: () => {
        const configuration = data.CONFIGURATION;
        return configuration && configuration.version;
      },
      getLocationId: () => {
        const configuration = data.CONFIGURATION;
        return configuration && configuration.locationId;
      },
      getUseDesktopApp: () => {
        const configuration = data.CONFIGURATION;
        return configuration && configuration.useDesktopApp;
      },
      getConfigVNR: () => data.VNR_CONFIG,
    };
  }

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance() {
      if (!instance) {
        instance = init();
      }

      return instance;
    },

  };
}());

export const configServer = myConfigServer.getInstance();
