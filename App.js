/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Tabbar from 'module/tabbar';
import React from 'react';
import {LogBox, Text, TextInput} from 'react-native';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {RecoilRoot} from 'recoil';
import {navigationScreenOptions} from 'util/helper';
// redux
import {store} from './src/module/store';

LogBox.ignoreAllLogs();

const oldRender = Text.render;
Text.render = function (...args) {
  let origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{fontFamily: 'MyriadPro-Regular'}, origin.props.style],
  });
};

const oldInputRender = TextInput.render;
TextInput.render = function (...args) {
  let origin = oldInputRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{fontFamily: 'MyriadPro-Regular'}, origin.props.style],
  });
};

export default () => {
  const Stack = createStackNavigator();

  return (
    <RecoilRoot>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={navigationScreenOptions}>
            <Stack.Screen
              name="Tabbar"
              component={Tabbar}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
          <Toast ref={ref => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </RecoilRoot>
  );
};
