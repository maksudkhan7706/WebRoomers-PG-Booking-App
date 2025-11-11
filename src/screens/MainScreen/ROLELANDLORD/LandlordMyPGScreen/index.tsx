import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../../constants/colors';
import AppImageSlider from '../../../../ui/AppImageSlider';
import AppButton from '../../../../ui/AppButton';
import styles from './styles';
import { fetchMyPgList } from '../../../../store/mainSlice';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppImagePlaceholder from '../../../../ui/AppImagePlaceholder';
import { appLog } from '../../../../utils/appLog';

type LandlordMyPGSProp = NativeStackNavigationProp<RootStackParamList>;

const LandlordMyPGScreen = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<LandlordMyPGSProp>();
  const { loading, myPgList } = useSelector((state: any) => state.main);
  const { userData } = useSelector((state: any) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    dispatch(
      fetchMyPgList({
        company_id: userData?.company_id || '35',
        landlord_id: userData?.user_id || '197',
      }),
    );
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    let statusLabel = '';
    let bgColor = '';
    let textColor = '';

    switch (item.property_status) {
      case '0':
        statusLabel = 'Pending';
        bgColor = '#FFF3CD';
        textColor = '#856404';
        break;
      case '1':
        statusLabel = 'Activate';
        bgColor = '#D4EDDA';
        textColor = '#155724';
        break;
      case '2':
        statusLabel = 'Deactive';
        bgColor = '#F8D7DA';
        textColor = '#721C24';
        break;
      case '3':
        statusLabel = 'Deleted';
        bgColor = '#E2E3E5';
        textColor = '#383D41';
        break;
      default:
        statusLabel = '-';
        bgColor = '#CCE5FF';
        textColor = '#004085';
    }

    return (
      <View style={styles.card}>
        {/* Header */}
        <View
          style={[
            styles.card,
            {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderRadius: 0,
              marginBottom: 0,
            },
          ]}
        >
          <View>
            <View style={styles.roomContainer}>
              <View style={styles.roomCommon}>
                <Typography
                  color={colors.mainColor}
                  variant="label"
                  weight="medium"
                >
                  Total Room:
                </Typography>
                <Typography
                  color={colors.mainColor}
                  variant="label"
                  weight="medium"
                >
                  {item?.total_room}
                </Typography>
              </View>

              <View style={styles.roomCommon}>
                <Typography
                  color={colors.succes}
                  variant="label"
                  weight="medium"
                >
                  Available:
                </Typography>
                <Typography
                  color={colors.succes}
                  variant="label"
                  weight="medium"
                >
                  {item?.available_room}
                </Typography>
              </View>

              <View style={styles.roomCommon}>
                <Typography color={colors.red} variant="label" weight="medium">
                  Booked:
                </Typography>
                <Typography color={colors.red} variant="label" weight="medium">
                  {item?.booked_room}
                </Typography>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View
              style={{
                width: '78%',
              }}
            >
              <Typography
                numberOfLines={2}
                style={{ marginBottom: 3 }}
                variant="body"
                weight="medium"
              >
                {item?.title || '-'}
              </Typography>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.headerLeft}
                onPress={() =>
                  navigation.navigate(NAV_KEYS.LandlordAddPG, {
                    type: 'editPG',
                    propertyData: item,
                  })
                }
              >
                <Feather name="edit-3" size={14} color={colors.mainColor} />
                <Typography variant="label" style={{ marginLeft: 6 }}>
                  {item?.property_code}
                </Typography>
              </TouchableOpacity>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
              <Typography variant="label" color={textColor}>
                {statusLabel}
              </Typography>
            </View>
          </View>
        </View>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          {(() => {
            const galleryImages = [
              ...(item?.gallery?.living_room || []),
              ...(item?.gallery?.bedroom || []),
              ...(item?.gallery?.kitchen || []),
              ...(item?.gallery?.bathroom || []),
              ...(item?.gallery?.extra || []),
            ];
            const imagesToShow =
              galleryImages.length > 0
                ? galleryImages
                : item?.featured_image
                ? [item.featured_image]
                : [];
            if (imagesToShow.length > 0) {
              return (
                <AppImageSlider
                  data={imagesToShow.map((img: string, index: number) => ({
                    id: index.toString(),
                    image: { uri: img },
                  }))}
                  bannerImageStyle={{ marginRight: 10 }}
                  showThumbnails={false}
                />
              );
            } else {
              return <AppImagePlaceholder />;
            }
          })()}
        </View>
        {/* Details */}
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              City
            </Typography>
            <Typography variant="label">{item?.city_name || '-'}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Type
            </Typography>
            <Typography variant="label">{item?.property_type}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Category
            </Typography>
            <Typography variant="label">{item?.category_name}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="label" weight="medium">
              Price
            </Typography>
            <Typography variant="label">₹{item?.price}</Typography>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Typography variant="label" weight="medium">
              Rooms
            </Typography>
            <AppButton
              style={{ width: 100, height: 35}}
              title={'Add Rooms'}
              titleSize='label'
              onPress={() => {
                navigation.navigate(NAV_KEYS.PGRoomManagement, {
                  roomId: item?.property_id,
                  companyId: userData?.company_id,
                });
              }}
            />
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <AppHeader
        title="My PG"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      {loading && !refreshing ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <FlatList
          data={myPgList?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item.property_id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainColor]}
            />
          }
          ListEmptyComponent={
            <Typography
              style={{ textAlign: 'center', marginTop: 50 }}
              weight="medium"
            >
              No PGs Found!
            </Typography>
          }
        />
      )}
    </View>
  );
};

export default LandlordMyPGScreen;
