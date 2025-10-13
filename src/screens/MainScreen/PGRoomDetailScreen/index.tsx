import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import Typography from '../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import AppImageSlider from '../../../ui/AppImageSlider';
import images from '../../../assets/images';

const banners = [
  { id: '1', image: images.PGRoom },
  { id: '2', image: images.AttachRoom },
  { id: '3', image: images.CommonRoom },
  { id: '4', image: images.Dormitory },
  { id: '5', image: images.FourRoom },
  { id: '6', image: images.SingleBed },
];

const PGRoomDetailScreen = () => {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Room Room-101"
        showBack
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        <AppImageSlider data={banners} showThumbnails autoScroll />
        {/* Room Info */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <View>
              <Typography numberOfLines={2} variant="body" weight="medium">
                Code World International PG - Room Room-101
              </Typography>
            </View>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Room Type:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              Double
            </Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Security Deposit:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              ₹1,000
            </Typography>
          </View>

          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Price / Month:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              ₹7,000
            </Typography>
          </View>

          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Availability:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              1
            </Typography>
          </View>

          {/* Facilities */}
          <View style={{ marginTop: 12 }}>
            <Typography variant="label" weight="medium">
              Facilities:
            </Typography>
            <View style={styles.facilityRow}>
              {['AC', 'Attached Bathroom', 'Geyser', 'WiFi'].map((item, i) => (
                <View key={i} style={styles.facilityBadge}>
                  <Typography variant="label" color={colors.white}>
                    {item}
                  </Typography>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={{ marginTop: 16 }}>
            <Typography variant="label" weight="medium">
              Description:
            </Typography>
            <Typography
              variant="caption"
              color={colors.gray}
              style={{ marginTop: 4, lineHeight: 18 }}
            >
              This spacious and bright single room offers a peaceful environment
              perfect for students or working individuals. It includes an
              attached bathroom, high-speed WiFi, a comfortable bed, a study
              table, and a cupboard. Located close to public transport and local
              markets for added convenience.
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PGRoomDetailScreen;
