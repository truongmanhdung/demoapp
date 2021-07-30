import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

export default memo(() => {
  return (
    <SafeAreaView style={styles.main}>
      <Text>DFeed</Text>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
