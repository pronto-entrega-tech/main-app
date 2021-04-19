import React from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, View } from 'react-native';
import { device, globalStyles } from '../constants'
import requests from '../services/requests';

const slidesData: ImageSourcePropType[] = [
  {uri: requests+'images/slide1.jpeg'}, 
  {uri: requests+'images/slide2.jpeg'},
];

class AdsSlider extends React.Component {
  state = {
    currentIndex: 0,
  };

  render = () => {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={ true } 
        decelerationRate={0.9}
        snapToInterval={width - 24}
        style={{ width }}>
        {
          slidesData.map(( image, index ) => (
            <View key={index} style={[index === 0 ? styles.ad1 : styles.ad2, globalStyles.elevation5]} >
              <Image 
                source={image} 
                style={{
                  height: Math.round((itemWidth * 320) / 720),
                  width: itemWidth,
                  borderRadius: 8,}} />
            </View>
          ))
        }
      </ScrollView>
    );
  };
}


const width = device.width;
const itemWidth = device.width - 32;
const styles = StyleSheet.create({
  ad1: {
    height: Math.round((itemWidth * 320) / 720),
    width: itemWidth,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 8,
  },
  ad2: {
    height: Math.round((itemWidth * 320) / 720),
    width: itemWidth,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 6,
    marginLeft: 0,
    marginRight: 8,
  }
})

export default AdsSlider