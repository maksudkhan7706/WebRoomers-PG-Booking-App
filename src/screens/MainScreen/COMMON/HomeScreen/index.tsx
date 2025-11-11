import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import AppHeader from '../../../../ui/AppHeader';
import Typography from '../../../../ui/Typography';
import colors from '../../../../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import AppImageSlider from '../../../../ui/AppImageSlider';
import { fetchDashboardData } from '../../../../store/mainSlice';
import AppImage from '../../../../ui/AppImage';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../../../ui/AppButton';
import AppImagePlaceholder from '../../../../ui/AppImagePlaceholder';
import { appLog } from '../../../../utils/appLog';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const steps = [
  {
    id: 1,
    title: 'Sign Up',
    desc: 'Create your account in less than a minute with just your basic details.',
    btnText: 'Sign Up Now',
    icon: 'user-plus',
  },
  {
    id: 2,
    title: 'Select PG Room',
    desc: 'Browse through our verified PG listings and choose your perfect room.',
    btnText: 'Browse Rooms',
    icon: 'home',
  },
  {
    id: 3,
    title: 'Pay Rent Online',
    desc: 'Secure online payment with multiple options. No hidden charges.',
    btnText: 'Pay Now',
    icon: 'credit-card',
  },
];

const whyChooseUs = [
  {
    title: 'Why We Exist',
    desc: 'Our company stands out for quality, trust, and innovation. We ensure every client receives the best service experience possible.',
  },
  {
    title: 'Our Mission',
    desc: 'To deliver innovative and reliable solutions that help our customers grow and achieve their goals.',
  },
  {
    title: 'Our Vision',
    desc: 'To be the leading brand in our industry, recognized for excellence, integrity, and customer satisfaction.',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.main);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const companyId = '35';
  const ITEM_WIDTH = width - 80;
  const SPACING = 14;
  const banners = data?.data?.banners || [];
  const recentPGs = data?.data?.recent_pgs || [];
  const categories = data?.data?.property_categories || [];
  const dashBoardReviews = data?.data?.reviews || [];

  const fetchData = useCallback(() => {
    const payload: any = {
      company_id: companyId,
    };
    if (userData?.user_type === 'landlord' && userData?.user_id) {
      payload.user_id = userData.user_id;
    }
    appLog('HomeScreen', 'Dashboard Payload', payload);
    dispatch(fetchDashboardData(payload));
  }, [dispatch, companyId, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const reviewsRenderItem = ({ item, index }: any) => {
    return (
      <View
        style={[
          styles.reviewCard,
          {
            width: ITEM_WIDTH,
            marginRight: index === dashBoardReviews?.length - 1 ? 0 : SPACING,
          },
        ]}
      >
        <Typography
          variant="body"
          color="#333"
          style={{
            marginBottom: 20,
            lineHeight: 22,
          }}
        >
          {item.review_text}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
            style={{
              marginRight: 12,
            }}
            name="user-circle-o"
            size={30}
            color={colors.mainColor}
          />
          <View style={{ width: '88%' }}>
            <Typography style={{ fontWeight: 'bold', color: '#3A3A3A' }}>
              {item.name}
            </Typography>
            <Typography style={{ color: '#666' }}>
              {item.company_name} - {item.role}
            </Typography>
          </View>
        </View>
      </View>
    );
  };
  // console.log('HOME.  userData ============',userData);
  return (
    <View style={styles.container}>
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

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainColor]}
            />
          }
        >
          {/* Banner Slider */}
          <View style={styles.sliderContainer}>
            {banners && banners.length > 0 ? (
              <AppImageSlider
                data={banners.map((b: any, index: number) => ({
                  id: b.banner_id || index.toString(),
                  image: { uri: b.banner_image },
                }))}
                showThumbnails={false}
              />
            ) : (
              <AppImagePlaceholder />
            )}
          </View>

          {userData?.user_type == 'landlord' ? (
            <View style={{ paddingHorizontal: 40, marginTop: 15 }}>
              <AppButton
                title={'Add PG'}
                loading={loading}
                disabled={loading}
                onPress={() =>
                  navigation.navigate(NAV_KEYS.LandlordAddPG, { type: 'addPG' })
                }
              />
            </View>
          ) : null}

          {/* Recent PG */}
          <View style={styles.sectionContainer}>
            {recentPGs?.length > 0 ? (
              <Typography
                variant="subheading"
                weight="bold"
                color={colors.mainColor}
              >
                Recent PG
              </Typography>
            ) : null}

            <FlatList
              data={recentPGs}
              keyExtractor={item => item.property_id}
              contentContainerStyle={{ paddingBottom: 10, padding: 5 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pgCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    const { room_available, property_id, company_id } = item;
                    if (room_available?.toLowerCase() === 'available') {
                      navigation.navigate(NAV_KEYS.PGRoomListScreen, {
                        propertyId: property_id,
                        companyId: company_id,
                      });
                    } else {
                      navigation.navigate(NAV_KEYS.PGDetailScreen, {
                        propertyId: property_id,
                        companyId: company_id,
                      });
                    }
                  }}
                >
                  <View style={styles.pgInfoRow}>
                    <View style={styles.pgTextContainer}>
                      <Typography
                        variant="body"
                        weight="medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        color={colors.mainColor}
                      >
                        {item.property_title}
                      </Typography>
                      <View style={styles.addressRow}>
                        <Feather name="map-pin" size={14} color={colors.gray} />
                        <Typography
                          variant="caption"
                          color={colors.gray}
                          style={styles.addressText}
                          ellipsizeMode="tail"
                          numberOfLines={2}
                        >
                          {item.property_address}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  {item?.pg_for == null ? null : (
                    <View
                      style={[
                        styles.forPgContainer,
                        {
                          backgroundColor:
                            item.pg_for !== 'Girls'
                              ? colors.mainColor
                              : '#e83f8b',
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="medium"
                        color={colors.white}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        FOR {item.pg_for}
                      </Typography>
                    </View>
                  )}

                  <AppImage
                    source={{ uri: item.property_featured_image }}
                    style={styles.pgImage}
                  />

                  <Typography
                    style={{ marginTop: 8 }}
                    variant="body"
                    weight="bold"
                    color={colors.mainColor}
                  >
                    ₹{item.property_price}
                  </Typography>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Categories */}
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
              keyExtractor={item => item.property_category_id}
              contentContainerStyle={{ paddingBottom: 15 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.categoryCard}>
                  <AppImage
                    source={{ uri: item.property_category_icon }}
                    style={styles.categoryImage}
                  />
                  <Typography
                    variant="body"
                    weight="bold"
                    align="center"
                    style={{ marginTop: 10 }}
                    color={colors.mainColor}
                  >
                    {item.property_category_title}
                  </Typography>
                </View>
              )}
            />
          </View>

          <View style={styles.sectionContainer}>
            {/* ---- Book PG in Just 3 Steps ---- */}
            <View>
              <Typography
                variant="subheading"
                weight="bold"
                color={colors.mainColor}
              >
                Book PG in Just 3 Steps
              </Typography>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              >
                {steps.map(step => (
                  <View key={step.id} style={styles.card}>
                    <View style={styles.stepBadgeWrapper}>
                      <View style={styles.stepBadge}>
                        <Typography
                          variant="label"
                          weight="bold"
                          color={colors.white}
                        >
                          {step.id}
                        </Typography>
                      </View>
                    </View>

                    <FontAwesome
                      name={step.icon}
                      size={30}
                      color={colors.mainColor}
                    />

                    <Typography
                      variant="body"
                      weight="bold"
                      align="center"
                      color={colors.mainColor}
                      style={styles.stepTitle}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="label"
                      align="center"
                      color={colors.gray}
                      style={styles.stepDesc}
                    >
                      {step.desc}
                    </Typography>

                    <AppButton
                      title={step.btnText}
                      onPress={() => console.log(`${step.btnText} clicked`)}
                      style={styles.stepButton}
                      titleSize="label"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
            {/* ---- Why Choose Us ---- */}
            <View style={styles.whyChooseUsContainer}>
              <Typography
                variant="subheading"
                weight="bold"
                color={colors.mainColor}
              >
                Why Choose Us
              </Typography>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              >
                {whyChooseUs.map((item, index) => (
                  <View key={index} style={styles.whyCard}>
                    <Typography
                      variant="body"
                      weight="bold"
                      color={colors.mainColor}
                      style={styles.whyTitle}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="label" color={colors.gray}>
                      {item.desc}
                    </Typography>
                  </View>
                ))}
              </ScrollView>
            </View>

            {dashBoardReviews?.length <= 0 ? null : (
              <View style={{ marginTop: 20 }}>
                <Typography
                  variant="subheading"
                  weight="bold"
                  color={colors.mainColor}
                  style={{ marginBottom: 5 }}
                >
                  Customer Reviews
                </Typography>

                <FlatList
                  ref={flatListRef}
                  data={dashBoardReviews}
                  renderItem={reviewsRenderItem}
                  snapToInterval={ITEM_WIDTH + SPACING}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.review_id}
                  // onMomentumScrollEnd={event => {
                  //   const newIndex = Math.round(
                  //     event.nativeEvent.contentOffset.x / width,
                  //   );
                  //   setCurrentIndex(newIndex);
                  // }}
                  onMomentumScrollEnd={event => {
                            const newIndex = Math.min(
                              Math.max(
                                Math.round(
                                  event.nativeEvent.contentOffset.x /
                                    (ITEM_WIDTH + SPACING),
                                ),
                                0,
                              ),
                              dashBoardReviews.length - 1,
                            );
                            setCurrentIndex(newIndex);
                  }}
                  contentContainerStyle={{
                    paddingLeft: 0,
                    paddingRight: (width - ITEM_WIDTH) / 2,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                >
                  {dashBoardReviews?.map((item: any, index: number) => (
                    <View
                      key={item?.review_id ?? index.toString()}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor:
                          currentIndex === index ? colors.primary : '#D3D3D3',
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
