import {objectApi} from '../../../vala-base/apis/objectApiActions';
import storeConfig from '../../../vala-base/configs/storeConfig';
import helloApi from '../apis/HelloObjectApi';
import helloSelector from '../selector/helloSelector';
// import {MODIFY_STATE_BEFORE} from 'snw-base/lib/actions/ActionConstants';

const addMessage = (message, messageIds) => {
  /*  return objectApi.postUi(
    {
      [storeConfig.helloIds]: messageIds,
      [storeConfig.hello]: message,
    },
    {
      parentId: '123',
      modifyStateType: MODIFY_STATE_BEFORE,
      selector: helloSelector,
      api: helloApi,
      fetchRetry: 3,
      mainStateKey: storeConfig.helloIds,
      actionKey: 'addMessage',
    },
  );*/
};

const editMessage = (id, text) => {};

const removeMessage = id => {};

const getData = id => {
  return objectApi.getUi(null, {
    id,
    selector: helloSelector,
    api: helloApi,
  });
};

export {getData, addMessage, editMessage, removeMessage};
