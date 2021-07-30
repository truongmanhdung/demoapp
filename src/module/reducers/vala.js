import {combineReducers} from 'redux-immutable';
import reduceReducers from 'reduce-reducers';
import updateDataLotReducer from '../../vala-base/reducers/updateDataLotToStateReducer/updateDataLotReducer';
import storeConfig from '../../vala-base/configs/storeConfig';
import helloReducer from '../Hello/reducer/HelloReducer';
import helloIdsReducer from '../Hello/reducer/HelloIdsReducer';

const rootReducer = combineReducers({
  [storeConfig.hello]: helloReducer,
  [storeConfig.helloIds]: helloIdsReducer,
});

const wrapReducer = reduceReducers(rootReducer, updateDataLotReducer);

export {wrapReducer};
