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

import React, {useState} from 'react';
import {Text, Button, TouchableOpacity, View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const Demo = props => {
  const [textName, setTextName] = useState('');

  const onTextChanged = text => {
    setTextName(text);
  };

  const onButtonPressed = () => {
    const {onPress} = props;
    onPress(textName);
  };
  const {name} = props;
  const styles = StyleSheet.create({
    container: {
      width: 200,
      height: 40,
      marginStart: "auto",
      marginEnd: "auto",
      padding: 20
    },
    input: {
      borderStyle: "solid",
      borderColor: "red",
    },
    text: {
      textAlign: "center",
      margin: 20,

    }
  })
  return (
    <View>
        <TextInput style={styles.input} onChangeText={onTextChanged} />
        <TouchableOpacity activeOpacity={0.5}>
          <Button style={styles.container} title={'add message'} onPress={onButtonPressed} />
        </TouchableOpacity>
        {name ? <Text style={styles.text}>Hello {name}</Text> : null}
    </View>
  );


};


export default Demo;
