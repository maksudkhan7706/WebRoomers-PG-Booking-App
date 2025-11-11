import React, { useEffect, memo } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchPgRoomDetail } from '../../../../store/mainSlice';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../constants/colors';
import AppButton from '../../../../ui/AppButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import styles from './styles';
import AppImageSlider from '../../../../ui/AppImageSlider';
import { appLog } from '../../../../utils/appLog';

type PGRoomDetailStNavProp = NativeStackNavigationProp<RootStackParamList>;

const PGRoomDetailScreen = memo(() => {
  const navigation = useNavigation<PGRoomDetailStNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { roomId, pgId, companyId, genderType } = (route.params as any) || {};
  const { userRole } = useSelector((state: RootState) => state.auth);
  const { pgRoomDetail, loading } = useSelector(
    (state: RootState) => state.main,
  );

  useEffect(() => {
    if (roomId && pgId && companyId) {
      dispatch(
        fetchPgRoomDetail({
          room_id: roomId,
          pg_id: pgId,
          company_id: companyId,
        }),
      );
    }
  }, [dispatch, roomId, pgId, companyId]);

  if (loading || !pgRoomDetail?.data) {
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

  const room = pgRoomDetail?.data?.room_details;
  const pg = pgRoomDetail?.data?.pg_details;
  // Clean images for slider
  const roomImages = pgRoomDetail?.data?.room_details?.images || [];
  const banners =
    roomImages.length > 0
      ? roomImages.map((img: string, idx: number) => ({
        id: `${idx}`,
        image: { uri: img },
      }))
      : [
        {
          id: 'featured',
          image: {
            uri: pgRoomDetail?.data?.pg_details?.property_featured_image,
          },
        },
      ];

  appLog('PGRoomDetailScreen', 'pg', pg?.pg_for)

  return (
    <View style={styles.container}>
      <AppHeader
        title={room.room_number || 'Room'}
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
            <Typography numberOfLines={2} variant="body" weight="medium">
              {pg.property_title} - {room.room_number}
            </Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Room Type:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}
            </Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Security Deposit:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              ₹{room.security_deposit}
            </Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Price / Month:
            </Typography>
            <Typography variant="label" color={colors.gray}>
              ₹{room.price}
            </Typography>
          </View>
          {/* Facilities */}
          <View style={{ marginTop: 12 }}>
            <Typography variant="label" weight="medium">
              Facilities:
            </Typography>
            <View style={styles.facilityRow}>
              {(room.facilities || []).map((f: string, i: number) => (
                <View key={i} style={styles.facilityBadge}>
                  <Typography variant="label" color={colors.white}>
                    {f}
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
              {room.description || 'No description available.'}
            </Typography>
          </View>
        </View>

        {userRole == 'landlord' ? null : (
          <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
            <AppButton
              title="Book Room"
              onPress={() => {
                navigation.navigate(NAV_KEYS.UserPGBookScreen, {
                  screenType: 'isRoom',
                  roomId: room.id,
                  pgId: room.pg_id,
                  companyId: room.company_id,
                  genderType: pg?.pg_for
                });
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
});

export default PGRoomDetailScreen;
