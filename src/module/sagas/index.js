import {all, call} from 'redux-saga/effects';

import helloSaga from '../Hello/sagas/index';
import baseSaga from '../../vala-base/sagas';

const getRouterSaga = function* getRouterSaga() {
  yield all([call(helloSaga), call(baseSaga)]);
};

export default getRouterSaga;
