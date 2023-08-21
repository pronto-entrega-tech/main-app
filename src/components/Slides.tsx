import React, { useCallback, useEffect, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import { globalStyles } from '~/constants';
import { getImageUrl } from '~/functions/converter';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { api } from '~/services/api';

const slideHeight = 456;
const slideWidth = 1024;

const Slider = (p: { slidesNames?: string[] }) => {
  const [index, setIndex] = useState(0);
  const [slidesNames, setSlidesNames] = useState(p.slidesNames);
  const { width, size } = useMediaQuery();

  useEffect(() => {
    if (slidesNames) return;

    api.products.slides().then(setSlidesNames);
  }, [slidesNames]);

  const columns = (
    {
      lg: 3,
      md: 1.25,
      sm: 1,
    } as const
  )[size];
  const itemWidth = (width - 32) / columns;
  const itemHeight = Math.round((itemWidth * slideHeight) / slideWidth);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);

      const distance = Math.abs(roundIndex - index);

      // Prevent one pixel triggering
      const isNoMansLand = 0.4 < distance;

      setIndex((i) => (roundIndex !== i && !isNoMansLand ? roundIndex : i));
    },
    [],
  );

  if (!slidesNames) return null;

  const images = slidesNames.map((slideName, index) => (
    <Image
      key={index}
      source={{ uri: getImageUrl('slide', slideName) }}
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
  ));

  const dots =
    slidesNames.length > 1 &&
    slidesNames.map((_, i) => (
      <View
        key={i}
        style={[styles.dot, index === i ? styles.active : styles.inactive]}
      />
    ));

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
        snapToInterval={itemWidth + 8}
        contentContainerStyle={styles.scrollContainer}
        style={{
          width: '100%',
        }}>
        {images}
      </ScrollView>
      <View style={styles.dotContainer}>{dots}</View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  slide: {
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  dotContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    top: -22,
    height: 7,
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
