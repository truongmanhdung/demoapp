import messaging from '@react-native-firebase/messaging';
// import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';

export default props => {
  //   const navigation = useNavigation();

  useEffect(() => {
    checkPermissionPN();
    refreshTokenPN();
    receivePNInForeground();
    receivePNInBackground();
  }, [
    checkPermissionPN,
    receivePNInBackground,
    receivePNInForeground,
    refreshTokenPN,
  ]);

  const checkPermissionPN = useCallback(async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const fcmToken = await messaging().getToken();
      console.log('getFCMToken:', fcmToken);
      registerToken(fcmToken);
    }
  }, [registerToken]);

  const receivePNInForeground = useCallback(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('receivePNInForeground:', remoteMessage);
      checkReceivedMessage(remoteMessage);
    });
  }, [checkReceivedMessage]);

  const receivePNInBackground = useCallback(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('receivePNInBackground:', remoteMessage);
      checkReceivedMessage(remoteMessage);
    });
  }, [checkReceivedMessage]);

  const checkReceivedMessage = useCallback(message => {
    if (!message) {
      return;
    }
    const {data} = message;
    if (!data) {
      return;
    }
  }, []);

  const refreshTokenPN = useCallback(() => {
    messaging().onTokenRefresh(fcmToken => {
      console.log('refreshFCMToken:', fcmToken);
      registerToken(fcmToken);
    });
  }, [registerToken]);

  const registerToken = useCallback(token => {
    // call API
  }, []);

  return <></>;
};
