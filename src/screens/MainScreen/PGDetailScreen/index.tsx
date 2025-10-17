import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchPGDetailData } from '../../../store/mainSlice';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import AppImageSlider from '../../../ui/AppImageSlider';
import colors from '../../../constants/colors';
import AppButton from '../../../ui/AppButton';
import styles from './styles';

const PGDetailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pgDetail, loading } = useSelector((state: RootState) => state.main);
  const route = useRoute();
  const { propertyId, companyId }: any = route.params;

  useEffect(() => {
    if (propertyId && companyId) {
      dispatch(fetchPGDetailData({ pg_id: propertyId, company_id: companyId }));
    }
  }, [dispatch, propertyId, companyId]);

  const property = pgDetail?.data?.property;

  if (loading || !property) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.mainColor} />
      </View>
    );
  }

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
  // Features
  const features = property.features || [];

  // Additional Details
  const additionalDetails = [
    { label: 'HP ID', value: property.property_code },
    { label: 'Purpose', value: property.property_type },
    { label: 'Parking', value: property.property_parking || 'N/A' },
    { label: 'Availability', value: property.property_availability || 'N/A' },
    { label: 'Furniture', value: property.property_furnished || 'N/A' },
    {
      label: 'Price',
      value: `₹${property.property_price}/${property.property_price_type}`,
    },
    {
      label: 'Property Type',
      value: property.property_category_title || property.property_type,
    },
    { label: 'On Floor', value: property.floor || 'N/A' },
  ];

  console.log('pgDetail ========>>>>>>', pgDetail);

  return (
    <View style={styles.container}>
      <AppHeader
        title={property.property_title || 'PG Detail'}
        showBack
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
            {property.property_title}
          </Typography>
          <Typography variant="label" color={colors.gray}>
            Code: {property.property_code}
          </Typography>
          <View style={styles.forPgButton}>
            <Typography variant="label" weight="bold" color={colors.white}>
              For {property.pg_for} ₹{property.property_price}/
              {property.property_price_type}
            </Typography>
          </View>
        </View>
        {/* Description */}
        {property.property_description && (
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
              {property.property_address}
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
              <View key={index} style={styles.detailItem}>
                <Typography variant="label" weight="medium" color={colors.gray}>
                  {item.label}
                </Typography>
                <Typography
                  variant="label"
                  weight="medium"
                  color={colors.textDark}
                >
                  {item.value}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        {features.length > 0 && (
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.title}>
              Features
            </Typography>
            <View style={styles.featuresWrapper}>
              {features.map((item: string, index: number) => (
                <View key={index} style={styles.featureRow}>
                  <FontAwesome
                    name="check"
                    size={14}
                    color={colors.lightGary}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <Typography
                    variant="label"
                    color={colors.textDark}
                    style={{ flex: 1 }}
                  >
                    {item.trim()}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
          <AppButton title="Book PG" onPress={() => { }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PGDetailScreen;
