import React from 'react';
import { ImageURISource, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';
import { getImageUrl } from '~/functions/converter';
import { device, globalStyles } from '~/constants';
import { getSlidesJson } from '~/services/requests';

const slideWidth = 1024;
const slideHeight = 456;

function createSlideList(json: any[]) {
  const slideList = [] as ImageURISource[];
  for (const i in json) {
    slideList.push({
      uri: getImageUrl('slide', json[i]),
    });
  }
  return slideList;
}

function Slider() {
  const [index, setIndex] = React.useState(0);
  const [slidesData, setSlidesData] = React.useState<ImageURISource[]>([]);
  const indexRef = React.useRef(index);
  indexRef.current = index;

  React.useEffect(() => {
    getSlidesJson()
      .then(({ data }) => setSlidesData(createSlideList(data)))
      .catch((error) => console.error(error));
  }, []);

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
        disableIntervalMomentum={true}
        decelerationRate='fast'
        snapToEnd={false}
        snapToInterval={device.width - 24}
        style={styles.scroll}>
        {slidesData.map((image, index) => (
          <View
            key={index}
            style={[
              styles.slide,
              index === 0 ? { marginLeft: 16 } : {},
              globalStyles.elevation5,
            ]}>
            <Image
              source={image}
              containerStyle={{
                height: itemHeight,
                width: itemWidth,
                borderRadius: 8,
              }}
            />
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          top: -22,
          height: 7,
        }}>
        {slidesData.length < 2
          ? null
          : slidesData.map((_item, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  index == i ? styles.active : styles.inactive,
                ]}
              />
            ))}
      </View>
    </>
  );
}

const itemWidth = device.width / 1 - 32;
const itemHeight = Math.round((itemWidth * slideHeight) / slideWidth);
const styles = StyleSheet.create({
  scroll: {
    //width: device.width,
    height: itemHeight + 4 + 8,
    paddingTop: 4,
    paddingBottom: 8,
  },
  slide: {
    height: itemHeight,
    width: itemWidth,
    borderRadius: 8,
    marginRight: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: '#444',
  },
  inactive: {
    backgroundColor: '#ECECEC',
  },
});

export default Slider;
