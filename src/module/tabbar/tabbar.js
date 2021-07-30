import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CategoryStackScreen from 'module/category';
import ChatStackScreen from 'module/chat';
import DTopStackScreen from 'module/dtop';
import HomeStackScreen from 'module/home';
import DFeedStackScreen from 'module/sontest';
import React from 'react';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

const ICONS = {
  HomeStackScreen: {title: 'Trang chủ', image: require('./image/home.png')},
  DFeedStackScreen: {title: 'DFeed', image: require('./image/dfeed.png')},
  ChatStackScreen: {title: 'Chat', image: require('./image/chat.png')},
  DTopStackScreen: {title: 'DTop', image: require('./image/dtop.png')},
  CategoryStackScreen: {
    title: 'Danh mục',
    image: require('./image/category.png'),
  },
};

const screenOptions = ({route}) => {
  return {
    tabBarIcon: ({focused}) => (
      <Image
        source={ICONS[route.name].image}
        style={{tintColor: focused ? '#8B65FB' : '#757575'}}
      />
    ),
    // tabBarLabel: ({focused}) => (
    //   <Text style={{color: focused ? '#8B65FB' : '#757575'}}>
    //     {ICONS[route.name].title}
    //   </Text>
    // ),
  };
};

const tabBarOptions = {
  showLabel: false,
  style: {
    backgroundColor: 'white',
  },
};

const tabScreenOptions = ({route}) => ({
  tabBarVisible: route.state === undefined || route.state.index === 0,
});

export default () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStackScreen"
      screenOptions={screenOptions}
      tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={tabScreenOptions}
      />
      <Tab.Screen
        name="DFeedStackScreen"
        component={DFeedStackScreen}
        options={tabScreenOptions}
      />
      <Tab.Screen
        name="ChatStackScreen"
        component={ChatStackScreen}
        options={tabScreenOptions}
      />
      <Tab.Screen
        name="DTopStackScreen"
        component={DTopStackScreen}
        options={tabScreenOptions}
      />
      <Tab.Screen
        name="CategoryStackScreen"
        component={CategoryStackScreen}
        options={tabScreenOptions}
      />
    </Tab.Navigator>
  );
};
