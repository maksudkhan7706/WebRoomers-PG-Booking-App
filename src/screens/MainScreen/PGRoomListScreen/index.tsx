import React, { memo } from 'react';
import { View, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import AppImageSlider from '../../../ui/AppImageSlider';
import colors from '../../../constants/colors';
import images from '../../../assets/images';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import AppButton from '../../../ui/AppButton';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RoomListNavProp = NativeStackNavigationProp<RootStackParamList>;

const rooms = [
  {
    id: '1',
    title: 'Room-002',
    type: 'Double Room',
    pgName: 'Main Jaipur International PG',
    price: '₹3,000/month',
    deposit: '₹100',
    facilities: [
      'Cupboard',
      'Study Table',
      'Laundry Service',
      'Meals Included',
    ],
    banners: [images.AttachRoom, images.CommonRoom, images.Dormitory],
    gender: 'Boys',
    description: 'Test description ',
  },
  {
    id: '2',
    title: 'Example Room',
    type: 'Single Room',
    pgName: 'Main Jaipur International PG',
    price: '₹2,000/month',
    deposit: '₹1,000',
    facilities: ['AC', 'Attached Bathroom', 'Geyser', 'TV', 'WiFi'],
    banners: [images.FourRoom, images.SingleBed, images.PGRoom],
    gender: 'Girls',
    description:
      'This spacious and bright single room offers a peaceful environment perfect for security.',
  },
];

const RoomCard = memo(({ item }: { item: any }) => {
  const visibleFacilities = item.facilities.slice(0, 4);
  const hasMore = item.facilities.length > 4;
  const navigation = useNavigation<RoomListNavProp>();

  const bannerData = item.banners.map((img: any, idx: number) => ({
    id: `${item.id}-${idx}`,
    image: img,
    screen: NAV_KEYS.PGEnquiryScreen,
  }));

  return (
    <View style={styles.card}>
      {/* Slider inside RoomCard */}
      <AppImageSlider
        data={bannerData}
        showThumbnails={false}
        autoScroll
        contentContainerStyle={{
          paddingLeft: 16,
          marginTop: 10,
        }}
      />

      <View style={styles.cardBody}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body" weight="medium">
            {item.title}
          </Typography>
          <View
            style={{
              backgroundColor:
                item.gender == 'Boys' ? colors.mainColor : '#e83f8b',
              borderRadius: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Typography variant="label" weight="bold" color={colors.white}>
              {item.gender}
            </Typography>
          </View>
        </View>

        <Typography variant="label" color={colors.gray}>
          {item.type}
        </Typography>
        <Typography variant="caption" color={colors.gray}>
          {item.pgName}
        </Typography>

        <View style={styles.rowBetween}>
          <Typography variant="body" weight="bold" color={colors.mainColor}>
            {item.price}
          </Typography>
          <Typography variant="caption" color={colors.gray}>
            Security Deposit: ₹{item.deposit}
          </Typography>
        </View>

        <View style={styles.facilityRow}>
          {visibleFacilities.map((f: string, i: number) => (
            <View key={i} style={styles.facilityTag}>
              <Typography variant="caption" color={colors.gray}>
                {f}
              </Typography>
            </View>
          ))}
          {hasMore && (
            <View
              style={[
                styles.facilityTag,
                { backgroundColor: colors.mainColor + '15' },
              ]}
            >
              <Typography variant="caption" color={colors.mainColor}>
                + more
              </Typography>
            </View>
          )}
        </View>
        <Typography numberOfLines={2} variant="caption" color={colors.gray}>
          {item.description}
        </Typography>

        <AppButton
          title="View Details"
          onPress={() => {
            navigation.navigate(NAV_KEYS.PGRoomDetailScreen);
          }}
          style={{
            marginTop: 10,
            height: 40,
          }}
        />
      </View>
    </View>
  );
});

const PGRoomListScreen = memo(() => {
  return (
    <View style={styles.container}>
      <AppHeader
        title="PG Rooms"
        showBack
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />

      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Typography variant="body" weight="bold">
              Main Jaipur International PG Rooms
            </Typography>
            <Typography variant="label" color={colors.gray}>
              Rooms That Fit Your Lifestyle & Budget
            </Typography>
          </View>
        }
        renderItem={({ item }) => <RoomCard item={item} />}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

export default PGRoomListScreen;
