/**
 * Copyright 2016-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 21/07/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import axios from 'axios';
import cookies from '../utils/cookies';

const querys = ['token', 'companyId', 'mqttClientId', 'tokenUnLogin'];
// const Code2xx = [204, 205];

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  const {status} = response;
  // 204 No Content: The server successfully processed the request and is not returning any content.[14]
  // 205 Reset Content: The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.[15]
  if (status === 204 || status === 205) {
    // HieuNVb: Response with "No Content"
    return {status}; // Added DamBV 26/12/201&: fix de tao thread 1-1
  }
  return response.data;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
const callApi = function callApi(url, _options) {
  const options = _options;
  return cookies.getList(querys).then(results => {
    const {token, companyId, mqttClientId} = results;
    if (options.headers) {
      if (!options.headers.Authorization) {
        Object.assign(options.headers, {Authorization: token});
      }

      if (!options.headers['Company-Id']) {
        Object.assign(options.headers, {'Company-Id': companyId});
      }
      let xHeader = options.headers['x-header'];
      if (token) {
        if (xHeader) {
          const curXHeader = JSON.parse(xHeader);
          xHeader = Object.assign(curXHeader, {
            isAuto: curXHeader && curXHeader.isAuto ? curXHeader.isAuto : false,
            clientId: mqttClientId || window.mqttClientId,
          });
        } else {
          xHeader = {
            isAuto: false,
            clientId: mqttClientId || window.mqttClientId,
          };
        }
        Object.assign(options.headers, {
          'x-header': JSON.stringify(xHeader),
        });
      }
    } else {
      let xHeader = options.headers && options.headers['x-header'];
      if (token) {
        if (xHeader) {
          const curXHeader = JSON.parse(xHeader);
          xHeader = Object.assign(curXHeader, {
            isAuto: false,
            clientId: mqttClientId || window.mqttClientId,
          });
        } else {
          xHeader = {
            isAuto: false,
            clientId: mqttClientId || window.mqttClientId,
          };
        }
      }
      options.headers = {
        Authorization: token,
        'Company-Id': companyId,
        'x-header': JSON.stringify(xHeader),
      };
    }
    if (!options.mode) {
      options.mode = 'cors';
    }
    const {type = '', dataBody} = options.headers;
    if (dataBody) {
      options.data = dataBody;
    }
    if (type === 'removeHeader') {
      delete options.headers;
      delete options.mode;
    }
    options.url = url;
    return axios(options)
      .then(checkStatus)
      .then(parseJSON)
      .then(
        response => ({response}),
        error => ({error}),
      );
  });
};

/**
 * Requests upload file, returning a promise
 *
 * @return {object}           The response information of file upload.
 */
const callApiUpload = function callApiUpload(options) {
  return cookies.getList(querys).then(results => {
    const {token, companyId, tokenUnLogin} = results;
    options.data.append('jwt', token || tokenUnLogin);
    options.data.append('Company-Id', companyId);
    return axios(options).then(
      response => ({response}),
      error => ({error}),
    );
  });
};

export {callApi, callApiUpload};
