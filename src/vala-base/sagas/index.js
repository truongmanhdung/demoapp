/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author cuongnt@bkav.com on 11/12/2017.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {call} from './redux-saga-catch';
import makeRestartable from './makeRestartable';
/*import { watchGetList, watchGetListSuccess } from './objectGetList';
import { watchDeleteObject, watchDeleteObjectSuccess } from './objectDelete';
import { watchPatchObjectSuccess, watchPatchObject } from './objectPatch';*/
import {
  watchGetObject,
  watchGetObjectSuccess,
  watchObjectDisplay,
} from './objectGet';
import {watchPostObject, watchPostObjectSuccess} from './objectPost';
/*import { watchPutObject, watchPutObjectSuccess } from './objectPut';
import { watchGetEdge, watchGetEdgeSuccess } from './edgeGet';*/
import {watchPostEdge, watchPostEdgeSuccess} from './edgePost';
/*import { watchPutEdge, watchPutEdgeSuccess } from './edgePut';
import { watchPatchEdge, watchPatchEdgeSuccess } from './edgePatch';
import { watchDeleteEdge, watchDeleteEdgeSuccess } from './edgeDelete';
import { watchPutListEdge, watchPutListEdgeSuccess } from './edgePutList';
import { watchPostListEdge, watchPostListEdgeSuccess } from './edgePostList';*/

// import getMqttSagas from './mqttSaga';

const baseSagas = [
  // objects

  /*  watchGetList,
  watchGetListSuccess,*/

  watchGetObject,
  watchGetObjectSuccess,
  watchObjectDisplay,

  watchPostObject,
  watchPostObjectSuccess,

  /*  watchPutObject,
  watchPutObjectSuccess,

  watchPatchObject,
  watchPatchObjectSuccess,

  watchDeleteObject,
  watchDeleteObjectSuccess,

  // edges

  watchGetEdge,
  watchGetEdgeSuccess,*/

  watchPostEdge,
  watchPostEdgeSuccess,

  /*  watchPutEdge,
  watchPutEdgeSuccess,

  watchPatchEdge,
  watchPatchEdgeSuccess,

  watchDeleteEdge,
  watchDeleteEdgeSuccess,

  watchPutListEdge,
  watchPutListEdgeSuccess,

  watchPostListEdge,
  watchPostListEdgeSuccess,*/

  // mqtt

  // getMqttSagas
].map(makeRestartable);

const baseSaga = function* baseSaga() {
  yield baseSagas.map(saga => call(saga));
};

baseSaga.NAME = 'BaseSaga';

export default baseSaga;
