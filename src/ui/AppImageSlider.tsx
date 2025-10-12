import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import colors from '../constants/colors';

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
};

const AppImageSlider: React.FC<Props> = ({
  data,
  onPressBanner,
  autoScroll = true,
  showThumbnails = false,
  intervalTime = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<FlatList<any>>(null);
  const thumbRef = useRef<FlatList<any>>(null);

  // Auto-scroll main slider
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % data.length;
      mainRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [activeIndex, autoScroll, data.length, intervalTime]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      setActiveIndex(index);
      if (showThumbnails) {
        thumbRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }).current;

  //Simple Slider with dots (Home page)
  if (!showThumbnails) {
    return (
      <View style={styles.sliderContainer}>
        <FlatList
          ref={mainRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPressBanner?.(item.screen)}
            >
              <Image source={item.image} style={styles.bannerImage} />
            </TouchableOpacity>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
        {/* Dots Indicator */}
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

  //Thumbnail Style (PG Detail page)
  return (
    <View>
      {/* Main Slider */}
      <FlatList
        ref={mainRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={item.image}
              style={[
                styles.mainImage,
                {
                  marginLeft: index == 0 ? 0 : 20,
                },
              ]}
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
                mainRef.current?.scrollToIndex({ index, animated: true });
                setActiveIndex(index);
              }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.20)',
                padding: 5,
              }}
            >
              <Animated.Image
                source={item.image}
                style={[
                  styles.thumbImage,
                  {
                    opacity: isActive ? 1 : 0.5,
                    transform: [{ scale: isActive ? 1.05 : 1 }],
                  },
                ]}
                blurRadius={isActive ? 0 : 1.5}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default React.memo(AppImageSlider);

const styles = StyleSheet.create({
  sliderContainer: {
    width,
    alignItems: 'center',
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 16,
    resizeMode: 'stretch',
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
    backgroundColor: 'red',
  },
  thumbList: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  thumbImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginHorizontal: 10,
    resizeMode: 'stretch',
  },
});
