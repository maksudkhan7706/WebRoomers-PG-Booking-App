import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import colors from '../../../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import AppImageSlider from '../../../ui/AppImageSlider';
import { fetchDashboardData } from '../../../store/mainSlice';
import AppImage from '../../../ui/AppImage';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;
const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.main);

  useEffect(() => {
    const companyId = '35';
    dispatch(fetchDashboardData({ company_id: companyId }));
  }, [dispatch]);

  const banners = data?.data?.banners || [];
  const recentPGs = data?.data?.recent_pgs || [];
  const categories = data?.data?.property_categories || [];

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
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner Slider */}
          <View style={styles.sliderContainer}>
            <AppImageSlider
              data={banners.map((b: any) => ({
                id: b.banner_id,
                image: { uri: b.banner_image },
              }))}
              showThumbnails={false}
            />
          </View>
          {/* Recent PG */}
          <View style={styles.sectionContainer}>
            <Typography
              variant="subheading"
              weight="bold"
              color={colors.mainColor}
            >
              Recent PG
            </Typography>
            <FlatList
              data={recentPGs}
              keyExtractor={item => item.property_id}
              contentContainerStyle={{ paddingBottom: 20, padding: 5 }}
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
              contentContainerStyle={{ paddingBottom: 200 }}
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
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;