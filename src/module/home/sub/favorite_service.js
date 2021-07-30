import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const FavoriteServices = memo(() => {
  return (
    <View style={{marginTop: 16, paddingHorizontal: 16}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontWeight: '700', fontSize: 15, color: '#424242'}}>
          Dịch vụ yêu thích
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={require('../image/more.png')} />
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', marginTop: 16}}>
        <TouchableOpacity style={styles.box}>
          <View style={[styles.image, {backgroundColor: '#E1BEE7'}]}>
            <Image source={require('../image/account.png')} />
          </View>
          <Text style={styles.title}>Tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={[styles.image, {backgroundColor: '#D1FEC6'}]}>
            <Image source={require('../image/analytic.png')} />
          </View>
          <Text style={styles.title}>Phân tích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={[styles.image, {backgroundColor: '#FBF9BF'}]}>
            <Image source={require('../image/invest.png')} />
          </View>
          <Text style={styles.title}>Đầu tư</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={[styles.image, {backgroundColor: '#BBDEFB'}]}>
            <Image source={require('../image/payment.png')} />
          </View>
          <Text style={styles.title}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default FavoriteServices;

const styles = StyleSheet.create({
  title: {
    fontWeight: '400',
    fontSize: 13,
    color: '#424242',
  },
  image: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
