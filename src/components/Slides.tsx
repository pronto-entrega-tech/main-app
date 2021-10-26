import React from 'react';
import {
  ImageURISource,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import { globalStyles } from '~/constants';
import { getImageUrl } from '~/functions/converter';
import { getSlidesJson } from '~/services/requests';

const slideHeight = 456;
const slideWidth = 1024;

function Slider({ data }: { data?: string[] }) {
  const [index, setIndex] = React.useState(0);
  const [slidesData, setSlidesData] = React.useState(data);
  const { width } = useWindowDimensions();
  const indexRef = React.useRef(index);
  indexRef.current = index;

  React.useEffect(() => {
    if (slidesData) return;
    getSlidesJson().then(setSlidesData).catch(console.error);
  }, [slidesData]);

  const [columns, setColumns] = React.useState(1);
  const [itemWidth, setItemWidth] = React.useState(0);
  const [itemHeight, setItemHeight] = React.useState(0);

  React.useEffect(() => {
    const columns = (() => {
      if (width > 768) return 3; // desktop
      if (width > 425) return 2; // tablet
      return 1; // mobile
    })();

    const itemWidth_ = (width - 32) / columns;
    const itemHeight_ = Math.round((itemWidth_ * slideHeight) / slideWidth);
    setItemWidth(itemWidth_);
    setItemHeight(itemHeight_);
    setColumns(columns);
  }, [width]);

  /* const itemWidth = (width - 32) / columns;
  const itemHeight = Math.round((itemWidth * slideHeight) / slideWidth); */

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
        /* snapToEnd={false} */
        snapToInterval={itemWidth + 8}
        style={[
          styles.scroll,
          {
            paddingBottom: columns === 1 ? 0 : 8,
            aspectRatio: ((slideWidth + 32) / slideHeight) * columns,
          },
        ]}>
        {slidesData?.map((image, index) => (
          <Image
            key={index}
            source={{
              uri: getImageUrl('slide', image),
            }}
            containerStyle={[
              globalStyles.elevation5,
              styles.slide,
              {
                width: itemWidth,
                height: itemHeight,
                marginLeft: index === 0 ? 20 - 4 * columns : 0,
              },
            ]}
          />
        ))}
      </ScrollView>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          top: columns === 1 ? -22 : -4,
          height: 7,
        }}>
        {slidesData &&
          slidesData.length >= 2 &&
          slidesData.map((_item, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                index === i ? styles.active : styles.inactive,
              ]}
            />
          ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    paddingTop: 4,
  },
  slide: {
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
