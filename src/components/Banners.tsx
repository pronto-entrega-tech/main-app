import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { getImageUrl } from "~/functions/converter";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { api } from "~/services/api";
import IconButton from "./IconButton";
import { Banner } from "~/core/models";
import MyImage from "./MyImage";
import globalStyles from "~/constants/globalStyles";

const slideHeight = 456;
const slideWidth = 1024;

const gap = 8;

const Banners = (p: { banners?: Banner[] }) => {
  const [index, setIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [banners, setBanners] = useState(p.banners);
  const { width, size, isMobile } = useMediaQuery();
  const ref = useRef<ScrollView>();

  useEffect(() => {
    if (banners) return;

    api.products.banners().then(setBanners);
  }, [banners]);

  const margins = (
    {
      lg: 40,
      md: 30,
      sm: 20,
    } as const
  )[size];

  const itemHeight = (
    {
      lg: 300,
      md: 200,
      sm: 150,
    } as const
  )[size];
  const itemWidth = Math.round((itemHeight * slideWidth) / slideHeight);
  const gappedItemWidth = itemWidth + gap;

  const scrollableWidth =
    gappedItemWidth * (banners?.length ?? 0) - 8 + margins * 2 - width;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = event.nativeEvent.contentOffset.x / gappedItemWidth;
      const roundIndex = Math.round(index);

      setIndex((i) => (roundIndex !== i ? roundIndex : i));
      setHasEnded(event.nativeEvent.contentOffset.x >= scrollableWidth);
    },
    [gappedItemWidth, scrollableWidth],
  );

  const images = !banners
    ? [
        <View
          key={index}
          style={[
            globalStyles.elevation5,
            styles.slide,
            {
              height: itemHeight,
              width: itemWidth,
              marginRight: margins * 2,
              transform: `translateX(${margins}px)`,
              backgroundColor: "white",
            },
          ]}
        />,
      ]
    : banners.map((banner, index) => (
        <View
          key={index}
          style={[
            globalStyles.elevation5,
            styles.slide,
            {
              height: itemHeight,
              width: itemWidth,
              marginRight: index === banners.length - 1 ? margins * 2 : gap,
              transform: `translateX(${margins}px)`,
              backgroundColor: "white",
            },
          ]}
        >
          <MyImage
            thumbhash={banner.thumbhash}
            source={getImageUrl("banners", banner.name)}
            alt={banner.description}
            style={{ flex: 1 }}
            height={itemHeight}
            width={itemWidth}
          />
        </View>
      ));

  return (
    <View style={styles.container}>
      <ScrollView
        ref={(view) => {
          ref.current = view ?? undefined;
        }}
        onScroll={onScroll}
        scrollEventThrottle={100}
        horizontal
        pagingEnabled
        snapToInterval={gappedItemWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={true}
        contentContainerStyle={styles.scrollContainer}
        style={{
          width: "100%",
          minHeight: itemHeight,
        }}
      >
        {images}
      </ScrollView>
      {isMobile ? (
        <View style={styles.dotContainer}>
          {images.length > 1 &&
            images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  index === i ? styles.active : styles.inactive,
                ]}
              />
            ))}
        </View>
      ) : (
        <>
          <NavButton
            icon="arrow-left"
            onPress={() => {
              ref.current?.scrollTo({ x: gappedItemWidth * (index - 1) });
            }}
            disabled={index === 0}
          />
          <NavButton
            right
            icon="arrow-right"
            onPress={() => {
              ref.current?.scrollTo({ x: gappedItemWidth * (index + 1) });
            }}
            disabled={hasEnded}
          />
        </>
      )}
    </View>
  );
};

const NavButton = (
  p: ComponentProps<typeof IconButton> & { right?: boolean },
) => {
  return (
    <View
      style={{
        right: p.right ? 0 : undefined,
        marginHorizontal: 12,
        position: "absolute",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <IconButton
        style={{
          height: 40,
          width: 40,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
        hoverStyle={{ backgroundColor: "white" }}
        {...p}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  slide: {
    borderRadius: 8,
    overflow: "hidden",
  },
  dotContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    height: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: "#444",
  },
  inactive: {
    backgroundColor: "#ECECEC",
  },
});

export default Banners;
