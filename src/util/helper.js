import React from 'react';
import {Image} from 'react-native';

export const navigationScreenOptions = {
  headerStyle: {
    backgroundColor: '#006fe6',
  },
  headerTintColor: 'white',
  // headerBackTitleVisible: false,
  headerBackTitle: ' ',
  headerBackImage: () => (
    <Image
      source={require('module/tabbar/image/home.png')}
      style={{marginLeft: 18}}
    />
  ),
};
