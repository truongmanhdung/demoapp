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

import React from 'react';
import {Text, Button} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const Hello = props => {
  let textName = '';

  const onTextChanged = text => {
    textName = text;
  };

  const onButtonPressed = () => {
    const {onPress} = props;
    onPress(textName);
  };
  const {name} = props;
  return (
    <>
      <TextInput onChangeText={onTextChanged} />
      <Button title={'Send hello Message'} onPress={onButtonPressed} />
      {name ? <Text>Hello {name}</Text> : null}
    </>
  );
};

export default Hello;
