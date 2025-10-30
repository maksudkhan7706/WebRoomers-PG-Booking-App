import React, { memo, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchPgRooms } from '../../../store/mainSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import AppImageSlider from '../../../ui/AppImageSlider';
import colors from '../../../constants/colors';
import AppButton from '../../../ui/AppButton';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import AppImagePlaceholder from '../../../ui/AppImagePlaceholder';

type RoomListNavProp = NativeStackNavigationProp<RootStackParamList>;

const PGRoomListScreen = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const navigation = useNavigation<RoomListNavProp>();
  const { propertyId, companyId }: any = route.params;

  const { pgRooms, loading } = useSelector((state: RootState) => state.main);

  useEffect(() => {
    if (propertyId && companyId) {
      dispatch(fetchPgRooms({ pg_id: propertyId, company_id: companyId }));
    }
  }, [dispatch, propertyId, companyId]);

  if (loading) {
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

  const rooms = pgRooms?.data || [];

  const renderRoom = ({ item }: { item: any }) => {
    const visibleFacilities = item.facilities?.slice(0, 4) || [];
    const hasMore = item.facilities && item.facilities.length > 4;
    const banners = (item.images || []).map((img: string, idx: number) => ({
      id: `${item.id}-${idx}`,
      image: img.replace(/[\[\]\"]/g, ''),
    }));

    return (
      <View style={styles.card}>
        <View style={styles.sliderContainer}>
          {banners.length > 0 ? (
            <AppImageSlider
              data={banners}
              showThumbnails={false}
              autoScroll
              contentContainerStyle={{ paddingLeft: 16, marginTop: 10 }}
            />
          ) : (
            <AppImagePlaceholder/>
          )}
        </View>

        <View style={styles.cardBody}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body" weight="medium">
              {item.room_number}
            </Typography>
            <View
              style={{
                backgroundColor:
                  item.room_type.toLowerCase() === 'double'
                    ? colors.mainColor
                    : '#e83f8b',
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Typography variant="label" weight="bold" color={colors.white}>
                {item.room_type === 'double' ? 'Boys' : 'Girls'}
              </Typography>
            </View>
          </View>

          <Typography variant="label" color={colors.gray}>
            {item.room_type.charAt(0).toUpperCase() + item.room_type.slice(1)}{' '}
            Room
          </Typography>
          <Typography variant="caption" color={colors.gray}>
            {pgRooms?.pg_name || ''}
          </Typography>

          <View style={styles.rowBetween}>
            <Typography variant="body" weight="bold" color={colors.mainColor}>
              ₹{item.price}/month
            </Typography>
            <Typography variant="caption" color={colors.gray}>
              Security Deposit: ₹{item.security_deposit}
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

          <Typography
            style={{ paddingVertical: 2 }}
            numberOfLines={2}
            variant="label"
            color={colors.gray}
          >
            {item.description}
          </Typography>

          <AppButton
            title="View Details"
            onPress={() => {
              navigation.navigate(NAV_KEYS.PGRoomDetailScreen, {
                roomId: item.id,
                pgId: item.pg_id,
                companyId: item.company_id,
              });
            }}
            style={{ marginTop: 10, height: 40 }}
          />
        </View>
      </View>
    );
  };

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
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Typography variant="body" weight="bold">
              {pgRooms?.pg_name || ''}
            </Typography>
            <Typography variant="label" color={colors.gray}>
              {rooms.length >= 0
                ? ''
                : 'Rooms That Fit Your Lifestyle & Budget'}
            </Typography>
          </View>
        }
        renderItem={renderRoom}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.listEmpty}>
            <FontAwesome name="inbox" size={48} color={colors.gray} />
            <Typography variant="body" weight="bold" style={{ marginTop: 12 }}>
              No data found
            </Typography>
            <Typography
              variant="label"
              color={colors.gray}
              style={{ marginTop: 6 }}
            >
              There are no rooms available right now. Please check back later.
            </Typography>
          </View>
        )}
      />
    </View>
  );
});

export default PGRoomListScreen;
