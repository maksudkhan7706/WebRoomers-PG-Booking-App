import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import colors from '../constants/colors';
import AppImage from './AppImage';

const { width } = Dimensions.get('window');

export type BannerItem = {
  id: string;
  image: any;
  screen?: string;
};

type Props = {
  data: BannerItem[];
  onPressBanner?: (screen?: string) => void;
  autoScroll?: boolean;
  showThumbnails?: boolean;
  intervalTime?: number;
  bannerImageStyle?: ImageStyle;
  contentContainerStyle?: ViewStyle;
};

const AppImageSlider: React.FC<Props> = ({
  data,
  onPressBanner,
  autoScroll = true,
  showThumbnails = false,
  intervalTime = 3000,
  bannerImageStyle,
  contentContainerStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<FlatList<any>>(null);
  const thumbRef = useRef<FlatList<any>>(null);

  //Auto-scroll feature
  useEffect(() => {
    if (!autoScroll || !data.length) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % data.length;
      mainRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [activeIndex, autoScroll, data.length, intervalTime]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) {
      const index = viewableItems[0]?.index ?? 0;
      setActiveIndex(index);
      if (showThumbnails) {
        thumbRef?.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }).current;

  //If Thumbnails are NOT shown (simple slider)
  if (!showThumbnails) {
    const ITEM_WIDTH = width - 80;
    const SPACING = 14;

    return (
      <View style={styles.sliderContainer}>
        <FlatList
          ref={mainRef}
          data={data}
          horizontal
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + SPACING}
          snapToAlignment="start"
          pagingEnabled={false}
          keyExtractor={item => item?.id}
          contentContainerStyle={[
            {
              paddingLeft: 0,
              paddingRight: (width - ITEM_WIDTH) / 2,
            },
            contentContainerStyle,
          ]}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPressBanner?.(item?.screen)}
              style={{ marginRight: index === data?.length - 1 ? 0 : SPACING }}
            >
              <AppImage
                source={
                  typeof item?.image === 'string'
                    ? { uri: item?.image }
                    : item?.image
                }
                style={StyleSheet.flatten([
                  {
                    width: ITEM_WIDTH,
                    height: 180,
                    borderRadius: 16,
                  },
                  bannerImageStyle,
                ])}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    );
  }

  //Thumbnail style (PG Detail Page)
  const ITEM_WIDTH = width - 80;
  const SPACING = 14;
  return (
    <View>
      {/* Main Slider */}
      <FlatList
        ref={mainRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        keyExtractor={item => item?.id}
        contentContainerStyle={{
          paddingLeft: data?.length == 1 ? 25: 0
        }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppImage
              source={
                typeof item?.image === 'string'
                  ? { uri: item?.image }
                  : item?.image
              }
              style={StyleSheet.flatten([
                {
                  width: ITEM_WIDTH,
                  height: 180,
                  borderRadius: 16,
                },
                bannerImageStyle,
              ])}
              resizeMode="stretch"
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Thumbnails */}
      <FlatList
        ref={thumbRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbList}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                mainRef?.current?.scrollToIndex({ index, animated: true });
                setActiveIndex(index);
              }}
              style={styles.thumbWrapper}
            >
              <Animated.View
                style={{
                  transform: [{ scale: isActive ? 1.05 : 1 }],
                }}
              >
                <AppImage
                  source={
                    typeof item?.image === 'string'
                      ? { uri: item?.image }
                      : item?.image
                  }
                  style={StyleSheet.flatten([
                    styles.thumbImage,
                    { opacity: isActive ? 1 : 0.5 },
                  ])}
                  resizeMode="stretch"
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default memo(AppImageSlider);

const styles = StyleSheet.create({
  sliderContainer: {
    width,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: colors.mainColor,
  },
  mainImage: {
    width: width - 35,
    height: 180,
    borderRadius: 16,
    resizeMode: 'stretch',
    backgroundColor: '#eee',
    marginLeft: 10,
  },
  thumbList: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  thumbWrapper: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  thumbImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
});
