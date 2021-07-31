import React, {memo} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import PushNotification from 'util/push-notification';
import Banner from './sub/banner';
import FavoriteService from './sub/favorite_service';
import FloatingButton from './sub/floating_button';
import TopBar from './sub/top_bar';
import Hello from "../Hello/HelloContainer";
import Demo from "../demo/DemoContainer";

const Home = memo(() => {
  return (
    <SafeAreaView style={styles.main}>
      <TopBar />
      <ScrollView style={{flex: 1}}>
            <Banner />
            <FavoriteService />
              <Demo />
              {/*<Hello/>*/}
          </ScrollView>
      <FloatingButton />
      <PushNotification />
    </SafeAreaView>
  );
});

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
});
