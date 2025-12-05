import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchPGDetailData } from '../../../../store/mainSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../../ui/AppHeader';
import Typography from '../../../../ui/Typography';
import AppImageSlider from '../../../../ui/AppImageSlider';
import colors from '../../../../constants/colors';
import AppButton from '../../../../ui/AppButton';
import styles from './styles';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { appLog } from '../../../../utils/appLog';

type PGDetailStNavProp = NativeStackNavigationProp<RootStackParamList>;

const PGDetailScreen = () => {
  const navigation = useNavigation<PGDetailStNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { pgDetail, loading } = useSelector((state: RootState) => state.main);
  const route = useRoute();
  const { propertyId, companyId }: any = route.params;
  const { userRole, userData } = useSelector((state: RootState) => state.auth);
  const property = pgDetail?.data?.property;
  const features = property?.features || [];
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (propertyId && companyId) {
      dispatch(fetchPGDetailData({ pg_id: propertyId, company_id: companyId }));
    }
  }, [dispatch, propertyId, companyId]);

  // Images
  const gallery = pgDetail?.data?.property?.gallery_images?.[0] || {};
  const allImages = [
    ...(gallery.living_room || []),
    ...(gallery.bedroom || []),
    ...(gallery.kitchen || []),
    ...(gallery.bathroom || []),
    ...(gallery.floorplan || []),
    ...(gallery.extra || []),
  ];

  const banners =
    allImages.length > 0
      ? allImages.map((img: string, idx: number) => ({
          id: `${idx}`,
          image: { uri: img },
        }))
      : [
          {
            id: 'featured',
            image: {
              uri: pgDetail?.data?.property?.property_featured_image,
            },
          },
        ];
  // Additional Details
  const additionalDetails = [
    // { label: 'PG ID', value: property?.property_code },
    { label: 'PG For', value: property?.pg_for },
    { label: 'Parking', value: property?.property_parking || 'N/A' },
    { label: 'Furniture', value: property?.property_furnished || 'N/A' },
    {
      label: 'Price',
      value: `₹${property?.property_price}/${property?.property_price_type}`,
    },

    {
      label: 'PG Type',
      value: property?.property_category_title || property?.property_type,
    },
    {
      label: 'Security Charges',
      value: `₹${property?.property_security_charges}`,
    },
    { label: 'On Floor', value: property?.floor || 'N/A' },

    {
      label: 'Maintainance Charges',
      value: `₹${property?.property_maintainance_charges}`,
    },

    { label: 'Notice Period', value: property?.notice_period || '-' },
    { label: 'Lock In Period', value: property?.lock_in_period || '-' },
  ];

  const detailIconMap: Record<string, string> = {
    'PG For': 'users',
    Parking: 'car',
    Furniture: 'bed',
    Price: 'rupee',
    'PG Type': 'building',
    'Security Charges': 'shield',
    'On Floor': 'sort-numeric-asc',
    'Maintainance Charges': 'wrench',
    'Notice Period': 'hourglass-half',
    'Lock In Period': 'lock',
  };


  return (
    <View style={styles.container}>
      <AppHeader title={property?.property_title || 'PG Detail'} showBack />
      {loading || !property ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Image Slider */}
          {banners.length > 0 ? (
            <AppImageSlider data={banners} showThumbnails={true} />
          ) : (
            <View
              style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="label" color={colors.gray}>
                No images available
              </Typography>
            </View>
          )}
          {/* PG Title */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium">
              {property?.property_title}
            </Typography>
            <Typography variant="label" color={colors.gray}>
              Code: {property?.property_code}
            </Typography>
            <View style={styles.forPgButton}>
              <Typography variant="label" weight="bold" color={colors.white}>
                For {property?.pg_for} ₹{property?.property_price}/
                {property?.property_price_type}
              </Typography>
            </View>
          </View>
          {/* Description */}
          {property?.property_description && (
            <View style={styles.card}>
              <Typography variant="body" weight="medium" style={styles.title}>
                Description
              </Typography>
              <Typography variant="label" color={colors.textDark}>
                {property.property_description.replace(/<[^>]*>/g, '').trim()}
              </Typography>
            </View>
          )}
          {/* Address */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.title}>
              Address
            </Typography>
            <View style={styles.addressRow}>
              <FontAwesome name="map-marker" size={16} color={colors.gray} />
              <Typography
                variant="label"
                color={colors.gray}
                style={styles.addressText}
              >
                {property?.property_address}
              </Typography>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.title}>
              Additional Details
            </Typography>
            <View style={styles.detailWrapper}>
              {additionalDetails.map((item, index) => (
                <View key={index} style={styles.detailItemCard}>
                  <View style={styles.detailIconWrapper}>
                    <FontAwesome
                      name={detailIconMap[item.label] || 'info-circle'}
                      size={14}
                      color={colors.mainColor}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      weight="medium"
                      color={colors.gray}
                      style={styles.detailLabel}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      weight="medium"
                      color={colors.textDark}
                      style={styles.detailValue}
                    >
                      {item.value || 'N/A'}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          </View>
          {/* Features */}
          {features?.length > 0 && (
            <View style={styles.card}>
              <Typography variant="body" weight="medium" style={styles.title}>
                Features
              </Typography>
              <View style={styles.featuresWrapper}>
                {features?.map((item: string, index: number) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconWrapper}>
                      <FontAwesome
                        name="check"
                        size={14}
                        color={colors.mainColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        weight="medium"
                        color={colors.textDark}
                        style={styles.featureText}
                        numberOfLines={2}
                      >
                        {item.trim()}
                      </Typography>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          {userRole == 'landlord' ? null : (
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              {/* Checkbox Section */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setIsAgreed(prev => !prev)}
                  activeOpacity={0.8}
                >
                  <FontAwesome
                    name={isAgreed ? 'check-square' : 'square-o'}
                    size={20}
                    color={isAgreed ? colors.mainColor : '#888'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(NAV_KEYS.PGTermsConditionScreen, {
                      pgId: property?.property_id,
                      companyId: property?.company_id,
                    })
                  }
                >
                  <Typography
                    weight="medium"
                    variant="label"
                    style={styles.checkboxText}
                  >
                    I agree to the Terms of Services and Privacy Policy
                  </Typography>
                </TouchableOpacity>
              </View>

              <AppButton
                title="Book PG"
                disabled={!isAgreed}
                onPress={() => {
                  navigation.navigate(NAV_KEYS.UserPGBookScreen, {
                    screenType: 'isPG',
                    roomId: property?.property_id,
                    pgId: property?.property_id,
                    companyId: property?.company_id,
                    genderType: property?.pg_for,
                  });
                }}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PGDetailScreen;
