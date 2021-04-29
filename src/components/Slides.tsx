import React from 'react';
import { ImageSourcePropType, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Image } from 'react-native-elements';
import { device, globalStyles } from '../constants'
import requests from '../services/requests';

const slidesData: ImageSourcePropType[] = [
  {uri: requests+'images/slide1.jpeg'}, 
  {uri: requests+'images/slide2.jpeg'},
];

function AdsSlider() {
  const [index, setIndex] = React.useState(0)
  const indexRef = React.useRef(index);
  indexRef.current = index;
  
  const onScroll = React.useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    //Prevent one pixel triggering
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={100}
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={ true } 
        decelerationRate={0.9}
        snapToInterval={width - 24}
        style={{ width}}>
        {
          slidesData.map((image, index) => (
            <View key={index} style={[index === 0 ? styles.ad1 : styles.ad2, globalStyles.elevation5]} >
              <Image 
                source={image} 
                containerStyle={{
                  height: Math.round((itemWidth * 320) / 720),
                  width: itemWidth,
                  borderRadius: 8}} />
            </View>
          ))
        }
      </ScrollView>
      <View style={{alignSelf: 'center', flexDirection: 'row', top: -20}} >
        {
          slidesData.map((_item, i) => (
            <View key={i} style={[styles.dot, index == i? styles.active:styles.inactive]} />
          ))
        }
      </View>
    </>
  )
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
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: "#444"
  },
  inactive: {
    backgroundColor: "#ECECEC"
  },
})

export default AdsSlider