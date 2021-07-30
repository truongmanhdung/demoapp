/**
 * Copyright 2021-present, Bkav Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author vandd@bkav.com on 10/7/2021.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

import {connect} from 'react-redux';
import Hello from './Hello';
import helloSelector from './selector/helloSelector';

function mapStateToProps(state) {
  const name = helloSelector.getFirstUserName(state);
  return {
    name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPress: () =>
      dispatch({
        type: 'HELLO_GET_DATA',
        /*        condition: {actionKey: 'addMessage'},
        payload: {text},*/
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
