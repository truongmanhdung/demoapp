import ObjectApi from '../../../vala-base/apis/ObjectApi';
import {configServer} from '../../../vala-base/configs/server/configServer';

class HelloApi extends ObjectApi {
  constructor() {
    super({}, {}, {}, 'https://testapi.io/api/vandd/user/563087392384907');
  }
}

const helloApi = new HelloApi();

export default helloApi;
