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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../../constants/colors';
import AppImageSlider from '../../../../ui/AppImageSlider';
import AppButton from '../../../../ui/AppButton';
import styles from './styles';
import {
  apiUserDataFetch,
  fetchMyPgList,
  fetchAllUserPermissions,
} from '../../../../store/mainSlice';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AppImagePlaceholder from '../../../../ui/AppImagePlaceholder';
import {
  handlePermissionAction,
  hasPermission,
} from '../../../../utils/permissions';
import AccessDeniedModal from '../../../../ui/AccessDeniedModal';
import AccessDeniedScreenView from '../../../../ui/AccessDeniedScreenView';

type LandlordMyPGSProp = NativeStackNavigationProp<RootStackParamList>;

const LandlordMyPGScreen = () => {
  const dispatch = useDispatch<any>();
  const isFocused = useIsFocused();
  const navigation = useNavigation<LandlordMyPGSProp>();
  const { loading, myPgList, apiUserData, userAllPermissions } = useSelector(
    (state: any) => state.main,
  );
  const { userData } = useSelector((state: any) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');

  const fetchData = useCallback(() => {
    dispatch(
      fetchMyPgList({
        company_id: userData?.company_id,
        landlord_id: userData?.user_id,
        user_type: userData?.user_type,
        property_id: userData?.assigned_pg_ids,
      }),
    );
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      dispatch(
        apiUserDataFetch({
          user_id: userData?.user_id,
          company_id: userData?.company_id,
        }),
      );
      dispatch(
        fetchAllUserPermissions({
          company_id: userData?.company_id,
        }),
      );
    }
  }, [isFocused, dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userData?.user_id && userData?.company_id) {
      await Promise.all([
        fetchData(),
        dispatch(
          apiUserDataFetch({
            user_id: userData?.user_id,
            company_id: userData?.company_id,
          }),
        ),
        dispatch(
          fetchAllUserPermissions({
            company_id: userData?.company_id,
          }),
        ),
      ]);
    } else {
      await fetchData();
    }
    setRefreshing(false);
  };

  const handleEditPress = (item: any) => {
    handlePermissionAction({
      userData,
      apiUserData,
      key: 'edit_pg',
      userAllPermissions,
      onAllow: () => {
        navigation.navigate(NAV_KEYS.LandlordAddPG, {
          type: 'editPG',
          propertyData: item,
        });
      },
      onDeny: () => {
        setAccessMessage('You do not have permission to edit this PG.');
        setShowAccessDenied(true);
      },
    });
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
        {/* Room Statistics Header */}
        <View style={styles.roomStatsHeader}>
          <View style={styles.roomStatItem}>
            <View
              style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}
            >
              <MaterialIcons
                name="meeting-room"
                size={16}
                color={colors.mainColor}
              />
            </View>
            <View style={styles.statContent}>
              <Typography
                variant="caption"
                color="#666"
                style={styles.statLabel}
              >
                Total Room
              </Typography>
              <Typography
                variant="label"
                weight="bold"
                color={colors.mainColor}
                style={{ fontSize: 14 }}
              >
                {item?.total_room || 0}
              </Typography>
            </View>
          </View>

          <View style={styles.roomStatItem}>
            <View
              style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}
            >
              <MaterialIcons
                name="check-circle"
                size={16}
                color={colors.succes}
              />
            </View>
            <View style={styles.statContent}>
              <Typography
                variant="caption"
                color="#666"
                style={styles.statLabel}
              >
                Available
              </Typography>
              <Typography
                variant="label"
                weight="bold"
                color={colors.succes}
                style={{ fontSize: 14 }}
              >
                {item?.available_room || 0}
              </Typography>
            </View>
          </View>

          <View style={styles.roomStatItem}>
            <View
              style={[styles.statIconContainer, { backgroundColor: '#FFEBEE' }]}
            >
              <MaterialIcons name="event-busy" size={16} color={colors.red} />
            </View>
            <View style={styles.statContent}>
              <Typography
                variant="caption"
                color="#666"
                style={styles.statLabel}
              >
                Booked
              </Typography>
              <Typography
                variant="label"
                weight="bold"
                color={colors.red}
                style={{ fontSize: 14 }}
              >
                {item?.booked_room || 0}
              </Typography>
            </View>
          </View>
        </View>

        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleSection}>
            <Typography
              numberOfLines={2}
              variant="body"
              weight="bold"
              style={styles.pgTitle}
            >
              {item?.title || '-'}
            </Typography>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.editButton}
              onPress={() => handleEditPress(item)}
            >
              <Feather name="edit-3" size={14} color={colors.mainColor} />
              <Typography
                variant="label"
                color={colors.mainColor}
                style={styles.propertyCode}
              >
                {item?.property_code}
              </Typography>
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red'
            }}
          >
            <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
              <Typography variant="caption" weight="medium" color={textColor}>
                {statusLabel}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(NAV_KEYS.PGTermsConditionScreen, {
                  pgId: item?.property_id,
                  companyId: userData?.company_id,
                  isLandlord: true,
                });
              }}
              style={{ alignSelf: 'flex-end', marginTop: 10 }}
            >
              <Typography
                variant="caption"
                weight="bold"
                color={textColor}
                style={{ textDecorationLine: 'underline' }}
              >
                Terms & Conditions
              </Typography>
            </TouchableOpacity>
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
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons
                name="location-city"
                size={14}
                color={colors.mainColor}
              />
              <Typography
                variant="label"
                weight="medium"
                style={styles.detailLabel}
              >
                City
              </Typography>
            </View>
            <Typography variant="label" color="#333" style={{ fontSize: 13 }}>
              {item?.city_name || '-'}
            </Typography>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons
                name="category"
                size={14}
                color={colors.mainColor}
              />
              <Typography
                variant="label"
                weight="medium"
                style={styles.detailLabel}
              >
                Type
              </Typography>
            </View>
            <Typography variant="label" color="#333" style={{ fontSize: 13 }}>
              {item?.property_type || '-'}
            </Typography>
          </View>

          <View style={[styles.detailRow, styles.categoryRow]}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons name="label" size={14} color={colors.mainColor} />
              <Typography
                variant="label"
                weight="medium"
                style={styles.detailLabel}
              >
                Category
              </Typography>
            </View>
            <View style={styles.categoryContainer}>
              <Typography
                variant="label"
                color="#333"
                numberOfLines={2}
                style={{ fontSize: 13 }}
              >
                {item?.categories && item.categories.length > 0
                  ? item.categories
                      .map((cat: any) => cat.category_title)
                      .join(', ')
                  : '-'}
              </Typography>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons
                name="currency-rupee"
                size={14}
                color={colors.mainColor}
              />
              <Typography
                variant="label"
                weight="medium"
                style={styles.detailLabel}
              >
                Price
              </Typography>
            </View>
            <Typography
              variant="label"
              weight="bold"
              color={colors.mainColor}
              style={{ fontSize: 14 }}
            >
              ₹{item?.price || '0'}
            </Typography>
          </View>

          <View style={styles.roomsActionRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons name="hotel" size={14} color={colors.mainColor} />
              <Typography
                variant="label"
                weight="medium"
                style={styles.detailLabel}
              >
                Rooms
              </Typography>
            </View>
            <AppButton
              style={styles.addRoomsButton}
              title={'Add Rooms'}
              titleSize="label"
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
      <AppHeader title="My PG" />
      {/*Show loader if loading or refreshing */}
      {loading || refreshing ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading PG details...
          </Typography>
        </View>
      ) : apiUserData?.data?.user_permissions &&
        !hasPermission(userData, apiUserData, 'pg_list', userAllPermissions) ? (
        <AccessDeniedScreenView
          message="Your account doesn't have access to view your PG list."
          onBackPress={() => navigation?.goBack()}
        />
      ) : (
        //Main Data View
        <FlatList
          data={myPgList?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item.property_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainColor]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={64} color="#ccc" />
              <Typography style={styles.emptyText} weight="medium" color="#999">
                No PGs Found!
              </Typography>
            </View>
          }
        />
      )}

      <AccessDeniedModal
        visible={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        message={accessMessage}
      />
    </View>
  );
};

export default LandlordMyPGScreen;
