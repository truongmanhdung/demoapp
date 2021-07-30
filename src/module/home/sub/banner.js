import React, {memo, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const LIST = [
  {
    image: require('../image/temp/temp_slide.png'),
  },
  {
    image: require('../image/temp/temp_slide.png'),
  },
  {
    image: require('../image/temp/temp_slide.png'),
  },
  {
    image: require('../image/temp/temp_slide.png'),
  },
  {
    image: require('../image/temp/temp_slide.png'),
  },
];

const {width} = Dimensions.get('window');

const Banner = memo(() => {
  const [index, setIndex] = useState(0);

  const renderItem = ({item}) => {
    const {image} = item;
    return (
      <Image
        source={image}
        style={{
          width,
          height: undefined,
          aspectRatio: 375 / 150,
        }}
      />
    );
  };

  return (
    <View style={{alignItems: 'center'}}>
      <Carousel
        autoplay
        loop
        data={LIST}
        sliderWidth={width}
        itemWidth={width}
        renderItem={renderItem}
        onSnapToItem={newIndex => setIndex(newIndex)}
      />
      <Pagination
        containerStyle={{
          paddingBottom: 8,
          position: 'absolute',
          bottom: 0,
        }}
        dotsLength={LIST.length}
        activeDotIndex={index}
        dotStyle={{
          width: 16,
          height: 2,
          borderRadius: 5,
          marginHorizontal: -5,
          backgroundColor: '#ffffff',
        }}
        inactiveDotStyle={{
          backgroundColor: '#ffffff40',
          width: 16,
          height: 2,
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    </View>
  );
});

export default Banner;
