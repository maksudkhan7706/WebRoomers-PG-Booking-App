import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import Typography from '../../../../ui/Typography';
import colors from '../../../../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import AppImageSlider from '../../../../ui/AppImageSlider';
import {
  apiUserDataFetch,
  fetchAllUserPermissions,
  fetchDashboardData,
} from '../../../../store/mainSlice';
import AppImage from '../../../../ui/AppImage';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AppButton from '../../../../ui/AppButton';
import AppImagePlaceholder from '../../../../ui/AppImagePlaceholder';
import { appLog } from '../../../../utils/appLog';
import { hasPermission } from '../../../../utils/permissions';
import AccessDeniedModal from '../../../../ui/AccessDeniedModal';
import AppLogo from '../../../../ui/AppLogo';
import AnimatedCounter from './components/AnimatedCounter';
import CategoriesSection from './components/CategoriesSection';
import BookPGStepsSection from './components/BookPGStepsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import DashboardReviewsSection from './components/DashboardReviewsSection';
import RecentPGSection from './components/RecentPGSection';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { data, loading, apiUserData, userAllPermissions } = useSelector(
    (state: RootState) => state.main,
  );
  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(
    'You do not have permission to perform this action.',
  );

  // Animated values for buttons
  const buttonAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Use userData company_id with fallback
  const companyId = useMemo(
    () => userData?.company_id,
    [userData?.company_id],
  );

  // Memoize derived data to avoid unnecessary recalculations
  const banners = useMemo(
    () => data?.data?.banners || [],
    [data?.data?.banners],
  );
  const recentPGs = useMemo(
    () => data?.data?.recent_pgs || [],
    [data?.data?.recent_pgs],
  );
  const categories = useMemo(
    () => data?.data?.property_categories || [],
    [data?.data?.property_categories],
  );
  const dashBoardReviews = useMemo(() => {
    return Array.isArray(data?.data?.reviews) ? data.data.reviews : [];
  }, [data?.data?.reviews]);

  const userName = useMemo(
    () => userData?.user_fullname || apiUserData?.user_fullname || 'Guest',
    [userData?.user_fullname, apiUserData?.user_fullname],
  );
  const isLandlord = useMemo(
    () => userData?.user_type === 'landlord',
    [userData?.user_type],
  );

  const summaryStats = useMemo(
    () => [
      { label: 'Listings', value: recentPGs?.length || 0, target: 'listings' },
      {
        label: 'Paid',
        value: data?.data?.received_payment || 0,
        target: 'received_payment',
      },
      {
        label: 'Due',
        value: data?.data?.due_payment || 0,
        target: 'due_payment',
      },
    ],
    [recentPGs?.length, data?.data?.received_payment, data?.data?.due_payment],
  );

  const fetchData = useCallback(async () => {
    setIsDashboardLoading(true);
    const payload = {
      company_id: companyId,
      user_id: userData?.user_id,
    };
    try {
      await dispatch(fetchDashboardData(payload));
    } catch (error) {
      appLog('HomeScreen', 'fetchData Error', error);
      // Error is handled by Redux, but we log it here for debugging
    } finally {
      setIsDashboardLoading(false);
    }
  }, [dispatch, companyId, userData]);

  const fetchUserAndPermissions = useCallback(async () => {
    try {
      if (!userData?.user_id || !userData?.company_id) return;
      const userPayload = {
        user_id: userData?.user_id,
        company_id: userData?.company_id,
      };
      const permissionPayload = {
        company_id: userData?.company_id,
      };
      // Parallel dispatch for better performance
      await Promise.all([
        dispatch(apiUserDataFetch(userPayload)),
        dispatch(fetchAllUserPermissions(permissionPayload)),
      ]);
    } catch (error) {
      appLog('HomeScreen', 'fetchUserAndPermissions Error', error);
    }
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch latest user info from API
  useEffect(() => {
    if (isFocused) {
      fetchUserAndPermissions();
    }
  }, [isFocused, fetchUserAndPermissions]);

  // Animate buttons when screen is focused and data is loaded
  useEffect(() => {
    if (isFocused && !loading && !isDashboardLoading && !refreshing) {
      // Reset animations
      buttonAnimations.forEach(anim => anim.setValue(0));

      // Create staggered animations for buttons
      const animations = buttonAnimations.map((anim, index) => {
        const delay = index * 100; // Stagger each button by 100ms
        return Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      Animated.parallel(animations).start();
    }
  }, [isFocused, loading, isDashboardLoading, refreshing, buttonAnimations]);

  const handleStatPress = useCallback((target: string) => {
    const position = sectionPositions.current[target];
    if (typeof position === 'number' && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.max(position - 20, 0),
        animated: true,
      });
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchData(), // Dashboard API
        fetchUserAndPermissions(), // User + Permission APIs
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, fetchUserAndPermissions]);

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View
        style={[
          styles.modernHeader,
          { paddingTop: Math.max(insets.top + 10, 20) },
        ]}
      >
        <View style={styles.headerAccentOne} />
        <View style={styles.headerAccentTwo} />
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <AppLogo
              style={styles.headerLogo}
              resizeMode="cover"
            />
            <View style={styles.greetingContainer}>
              <Typography
                variant="subheading"
                weight="bold"
                color={colors.white}
                style={styles.heroTitle}
              >
                Hi, {userName}
              </Typography>
              <Typography
                variant="label"
                color="rgba(255, 255, 255, 0.85)"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.addressText}
              >
                Complete your profile?
              </Typography>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(NAV_KEYS.ProfileScreen as any)}
          >
            <View style={styles.profileIconContainer}>
              <FontAwesome
                name="user-circle-o"
                size={26}
                color={colors.white}
              />
            </View>
          </TouchableOpacity>
        </View>
        {userData?.user_type === 'user' ? null : (
          <View style={styles.heroStatsRow}>
            {summaryStats.map(stat => (
              <TouchableOpacity
                key={stat.label}
                style={styles.heroStatCard}
                activeOpacity={0.9}
                onPress={() => handleStatPress(stat.target)}
              >
                <AnimatedCounter value={stat.value} trigger={isFocused} />
                <Typography
                  align="center"
                  variant="caption"
                  color="rgba(255,255,255,0.85)"
                >
                  {stat.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/*Show loader when loading or refreshing */}
      {loading || refreshing || isDashboardLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading dashboard...
          </Typography>
        </View>
      ) : (
        //Main Home Content
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainColor]}
            />
          }
        >
          {/* Promo Slider + CTA */}
          <View style={styles.promoContainer}>
            <View style={styles.promoSliderWrapper}>
              {banners && banners.length > 0 ? (
                <AppImageSlider
                  data={banners.map((b: any, index: number) => ({
                    id: b.banner_id || index.toString(),
                    image: { uri: b.banner_image },
                  }))}
                  showThumbnails={false}
                />
              ) : (
                <View style={styles.promoSliderPlaceholder}>
                  <AppImagePlaceholder />
                </View>
              )}
            </View>
            {userData?.user_type === 'user' ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  justifyContent: 'space-between',
                  marginTop: 15,
                  marginBottom: 12,
                }}
              >
                <Animated.View
                  style={[
                    styles.buttonWrapper,
                    {
                      opacity: buttonAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [
                        {
                          translateY: buttonAnimations[0].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <AppButton
                    title="Add PG"
                    onPress={() => {
                      if (
                        hasPermission(
                          userData,
                          apiUserData,
                          'add_pg',
                          userAllPermissions,
                        )
                      ) {
                        navigation.navigate(NAV_KEYS.LandlordAddPG, {
                          type: 'addPG',
                        });
                      } else {
                        setAccessDeniedMessage(
                          'You do not have permission to add a new PG.',
                        );
                        setShowAccessDenied(true);
                      }
                    }}
                    style={styles.bannerCtaButton}
                    titleColor={colors.mainColor}
                    titleSize="caption"
                    iconPosition="left"
                    titleIcon={
                      <MaterialIcons
                        name={'add-business'}
                        size={18}
                        color={colors.mainColor}
                      />
                    }
                  />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.buttonWrapper,
                    {
                      opacity: buttonAnimations[1].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [
                        {
                          translateY: buttonAnimations[1].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <AppButton
                    title="Add Tenant"
                    onPress={() => {
                      if (
                        hasPermission(
                          userData,
                          apiUserData,
                          'add_tenant',
                          userAllPermissions,
                        )
                      ) {
                        navigation.navigate(NAV_KEYS.AddNewTenantScreen);
                      } else {
                        setAccessDeniedMessage(
                          'You do not have permission to add a new tenant.',
                        );
                        setShowAccessDenied(true);
                      }
                    }}
                    titleColor={colors.mainColor}
                    titleSize="caption"
                    style={styles.bannerCtaButton}
                    titleIcon={
                      <MaterialIcons
                        name={'person-add'}
                        size={18}
                        color={colors.mainColor}
                      />
                    }
                  />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.buttonWrapper,
                    {
                      opacity: buttonAnimations[2].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [
                        {
                          translateY: buttonAnimations[2].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <AppButton
                    title="Enquiry"
                    onPress={() => {
                      navigation.navigate(NAV_KEYS.LandlordEnquiryScreen);
                    }}
                    titleColor={colors.mainColor}
                    titleSize="caption"
                    style={styles.bannerCtaButton}
                    iconPosition="left"
                    titleIcon={
                      <MaterialIcons
                        name={'message'}
                        size={18}
                        color={colors.mainColor}
                      />
                    }
                  />
                </Animated.View>
              </View>
            )}
          </View>

          {/*Recent PG */}
          <RecentPGSection
            recentPGs={recentPGs}
            isLandlord={isLandlord}
            navigation={navigation}
            onLayout={({ nativeEvent }) => {
              sectionPositions.current.listings = nativeEvent.layout.y;
            }}
          />

          {/*Categories */}
          {/* <CategoriesSection
            categories={categories}
            onLayout={({ nativeEvent }) => {
              sectionPositions.current.categories = nativeEvent.layout.y;
            }}
          /> */}

          {/*Book PG in 3 Steps */}
          <BookPGStepsSection
            onLayout={({ nativeEvent }) => {
              sectionPositions.current.steps = nativeEvent.layout.y;
            }}
          />

          {/* ---- Why Choose Us ---- */}
          <WhyChooseUsSection />

          {/* Dashboard Reviews */}
          <DashboardReviewsSection
            reviews={dashBoardReviews}
            onLayout={({ nativeEvent }) => {
              sectionPositions.current.reviews = nativeEvent.layout.y;
            }}
          />
          <View style={{ height: 120 }} />
          <AccessDeniedModal
            visible={showAccessDenied}
            onClose={() => setShowAccessDenied(false)}
            message={accessDeniedMessage}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
