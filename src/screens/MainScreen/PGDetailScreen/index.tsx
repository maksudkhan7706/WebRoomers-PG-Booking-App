import React from 'react';
import { View, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import AppImageSlider from '../../../ui/AppImageSlider';
import colors from '../../../constants/colors';
import images from '../../../assets/images';
import styles from './styles';
import AppButton from '../../../ui/AppButton';

const PGDetailScreen = () => {
  const banners = [
    { id: '1', image: images.BannerOne },
    { id: '2', image: images.AttachRoom },
    { id: '3', image: images.CommonRoom },
    { id: '4', image: images.BannerTwo },
    { id: '5', image: images.FourRoom },
    { id: '6', image: images.SingleBed },
  ];

  const additionalDetails = [
    { label: 'HP ID', value: 'HP00027' },
    { label: 'Purpose', value: 'PG' },
    { label: 'Parking', value: '2 Wheeler' },
    { label: 'Availability', value: 'Ready to Move' },
    { label: 'Furniture', value: 'Semi Furnished' },
    { label: 'Price', value: '₹6,000' },
    { label: 'Property Type', value: 'AC Room' },
    { label: 'On Floor', value: '1st Floor' },
    { label: 'Area', value: '200 sqFt' },
    { label: 'Flooring', value: 'Granite' },
  ];

  const features = [
    'Power Backup',
    'Reserved Parking',
    'Land Allotment Documents Available',
    'Within 200-500 meter from National Highway Road',
    'Readymade Grocery shop',
    'CCTV Surveillance',
    'Boundary is clear',
    'Visitor Parking',
    'Park nearby',
    'LPC documents available',
    'Readymade Commercial Shop With Full Equipment',
    'Readymade Cyber Cafe Shop',
    'Near Donyi polo Airport',
    'Service / Goods Lift',
    'Museums Nearby',
    'Entrance Gate',
    'Readymade Restaurant Space',
    'Electricity Available',
    'Best View point of capital Itanagar',
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        title="PG Detail"
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
        <AppImageSlider data={banners} showThumbnails autoScroll />
        {/* PG Title */}
        <View style={styles.card}>
          <Typography variant="body" weight="medium">
            Code World International PG
          </Typography>
          <Typography variant="label" color={colors.gray}>
            no any description
          </Typography>
          <View style={styles.forPgButton}>
            <Typography variant="label" weight="bold" color={colors.white}>
              For PG ₹6000
            </Typography>
          </View>
        </View>

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
              Udaipur, Bhuwana, 313001
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
                  numberOfLines={2}
                  weight="medium"
                  variant="label"
                  color={colors.textDark}
                >
                  {item.value}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Typography variant="body" weight="medium" style={styles.title}>
            Features
          </Typography>
          <View style={styles.featuresWrapper}>
            {features.map((item, index) => (
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
                  {item}
                </Typography>
              </View>
            ))}
          </View>
        </View>
        <View style={{ paddingHorizontal: 16,marginTop:30 }}>
          <AppButton
            title="Book PG"
            onPress={() => {console.log('Book PG');
             }}
          />
        </View>

      </ScrollView>
    </View>
  );
};

export default PGDetailScreen;
