import React, {memo} from 'react';
import {Image, TouchableOpacity} from 'react-native';

const FloatingButton = memo(() => {
  return (
    <TouchableOpacity style={{position: 'absolute', right: 4, bottom: 4}}>
      <Image source={require('../image/add.png')} />
    </TouchableOpacity>
  );
});

export default FloatingButton;
