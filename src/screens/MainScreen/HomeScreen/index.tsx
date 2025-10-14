import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import colors from '../../../constants/colors';
import images from '../../../assets/images';
import { RootStackParamList, NAV_KEYS } from '../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppImageSlider from '../../../ui/AppImageSlider';

const { width } = Dimensions.get('window');
type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const banners = [
    { id: '1', image: images.BannerOne, screen: NAV_KEYS.PGEnquiryScreen },
    { id: '2', image: images.BannerTwo, screen: NAV_KEYS.ProfileScreen },
    { id: '3', image: images.BannerOne, screen: NAV_KEYS.PGEnquiryScreen },
    { id: '4', image: images.BannerTwo, screen: NAV_KEYS.HomeScreen },
  ];

  //Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleBannerPress = (screen: keyof RootStackParamList) => {
    navigation.navigate({ name: screen as any, params: undefined });
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  //Dummy PG data
  const recentPGs = [
    {
      id: '1',
      name: 'TDI Delhi International PG',
      address: 'Naharlagun',
      rent: '₹11,000',
      image: images.AttachRoom,
      isRoomAvailable: 0
    },
    {
      id: '2',
      name: 'Cozy Nest PG',
      address: 'Koramangala, Bangalore',
      rent: '₹5000',
      image: images.SingleBed,
      isRoomAvailable: 2

    },
    {
      id: '3',
      name: 'Urban Rooms PG',
      address: 'BTM Layout, Bangalore',
      rent: '₹12,500',
      image: images.CommonRoom,
      isRoomAvailable: 1

    },
  ];

  const categories = [
    { id: '1', name: 'AC Room', image: images.PGRoom },
    { id: '2', name: 'Attached Bathroom Room', image: images.AttachRoom },
    { id: '3', name: 'Common Bathroom Room', image: images.CommonRoom },
    { id: '4', name: 'Dormitory (5+ sharing)', image: images.Dormitory },
    { id: '5', name: 'Double Sharing Room', image: images.Dormitory },
    { id: '6', name: 'Four Sharing Room', image: images.FourRoom },
    { id: '7', name: 'Non-AC Room', image: images.Dormitory },
    { id: '8', name: 'Single Sharing Room', image: images.CommonRoom },
    { id: '9', name: 'Triple Sharing Room', image: images.AttachRoom },
  ];

  return (
    <View style={styles.container}>
      {/*Header */}
      <AppHeader
        title="Home"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Auto Banner Slider */}
        <View style={styles.sliderContainer}>
          <AppImageSlider
            data={banners}
            showThumbnails={false}
            onPressBanner={(screen: any) => navigation.navigate(screen)}
          />
        </View>

        {/* Recent PGs */}
        <View style={styles.sectionContainer}>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.mainColor}
          >
            Recent PG
          </Typography>

          {recentPGs.map(item => (
            <TouchableOpacity
              onPress={() => {
                if (item.isRoomAvailable <= 0) {
                  navigation.navigate(NAV_KEYS.PGDetailScreen);
                } else {
                  navigation.navigate(NAV_KEYS.PGRoomListScreen);
                }
              }}
              activeOpacity={0.9}
              key={item.id}
              style={styles.pgCard}
            >
              <View style={styles.pgInfoRow}>
                <View>
                  <Typography variant="body" weight="medium">
                    {item.name}
                  </Typography>
                  <View style={styles.addressRow}>
                    <Feather name="map-pin" size={14} color={colors.gray} />
                    <Typography
                      variant="caption"
                      weight="regular"
                      color={colors.gray}
                      style={{ marginLeft: 4 }}
                    >
                      {item.address}
                    </Typography>
                  </View>
                </View>

                <View style={styles.forPgContainer}>
                  <Typography
                    variant="caption"
                    weight="medium"
                    color={colors.white}
                  >
                    FOR PG
                  </Typography>
                </View>
              </View>

              <Image source={item.image} style={styles.pgImage} />

              <Typography
                variant="body"
                weight="bold"
                color={colors.mainColor}
                style={styles.rentText}
              >
                {item.rent}
              </Typography>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
            <Typography variant="label" weight="medium" color={colors.white}>
              View All PG
            </Typography>
          </TouchableOpacity>
        </View>

        {/*Browse by Category */}
        <View style={styles.sectionContainer}>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.mainColor}
          >
            Browse by Category
          </Typography>

          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <View style={styles.categoryCard}>
                <Image source={item.image} style={styles.categoryImage} />
                <Typography
                  variant="body"
                  weight="bold"
                  align="center"
                  style={{ marginTop: 10 }}
                >
                  {item.name}
                </Typography>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
