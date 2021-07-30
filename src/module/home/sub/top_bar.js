import React, {memo} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

const TopBar = memo(() => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 4,
        alignItems: 'center',
      }}>
      <Image source={require('../image/app_icon.png')} />
      <Text
        style={{
          flex: 1,
          color: '#212121',
          fontWeight: '700',
          fontSize: 19,
          marginLeft: 4,
        }}>
        Oneness
      </Text>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('../image/search.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginLeft: 4,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('../image/notification.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginLeft: 4,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#E1BEE7',
          }}
        />
      </TouchableOpacity>
    </View>
  );
});

export default TopBar;
