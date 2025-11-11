import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../../../../ui/AppHeader';
import Typography from '../../../../ui/Typography';
import AppButton from '../../../../ui/AppButton';
import colors from '../../../../constants/colors';
import styles from './styles';
import { fetchUserMyBooking } from '../../../../store/mainSlice';
import { formatDate } from '../../../../utils/formatDate';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EnquiryNavProp = NativeStackNavigationProp<RootStackParamList>;

const UserMyBookingScreen = () => {
  const navigation = useNavigation<EnquiryNavProp>();
  const dispatch = useDispatch<any>();
  const isFocused = useIsFocused();

  const { userData } = useSelector((state: any) => state.auth);
  const { myBookings, loading } = useSelector((state: any) => state.main);

  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (userData?.company_id && userData?.user_id) {
      await dispatch(
        fetchUserMyBooking({
          company_id: userData.company_id,
          user_id: userData.user_id,
        }),
      );
    }
  }, [dispatch, userData]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const StatusBadge = ({ label, color }: { label: string; color: string }) => (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Typography variant="caption" weight="medium" style={styles.statusText}>
        {label}
      </Typography>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FFD54F';
      case 'Accepted':
      case 'Active':
        return '#4CAF50';
      default:
        return '#E57373';
    }
  };

  const renderItem = ({ item }: any) => {
    const property = item?.property || {};

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Typography variant="label" weight="medium" style={styles.label}>
            PG Name:
          </Typography>
          <Typography variant="label" style={styles.value}>
            {property.property_title || '-'}
          </Typography>
        </View>

        <View style={styles.row}>
          <Typography variant="label" weight="medium" style={styles.label}>
            Location:
          </Typography>
          <Typography variant="label" style={styles.value}>
            {property.property_address || '-'}
          </Typography>
        </View>

        <View style={styles.row}>
          <Typography variant="label" weight="medium" style={styles.label}>
            Check In:
          </Typography>
          <Typography variant="label" style={styles.value}>
            {formatDate(item?.check_in_date) || '-'}
          </Typography>
        </View>

        {/* Payment Detail */}
        <View style={styles.row}>
          <Typography variant="label" weight="medium" style={styles.label}>
            Payment Detail:
          </Typography>

          {item?.payment_status_text === 'Pending' ? (
            <StatusBadge
              label="Pending"
              color={getStatusColor(item?.payment_status_text)}
            />
          ) : (
            <View style={styles.paymentBox}>
              <Typography
                variant="caption"
                weight="medium"
                style={styles.leftText}
              >
                Amount: ₹{property?.property_price || '-'}
              </Typography>
              <Typography
                variant="caption"
                weight="medium"
                style={styles.leftText}
              >
                Start Date: {formatDate(item?.payment_start_date) || '-'}
              </Typography>
              <Typography
                variant="caption"
                weight="medium"
                style={styles.leftText}
              >
                End Date: {formatDate(item?.payment_end_date) || '-'}
              </Typography>
              <View style={{ marginTop: 5 }}>
                <StatusBadge
                  label={item?.payment_status_text}
                  color={getStatusColor(item?.payment_status_text)}
                />
              </View>
            </View>
          )}
        </View>

        {/* Status */}
        <View style={[styles.row, styles.statusRow]}>
          <Typography variant="label" weight="medium" style={styles.label}>
            Status:
          </Typography>
          <StatusBadge
            label={item?.status}
            color={getStatusColor(item?.status)}
          />
        </View>

        {/* Action Buttons */}
        <View style={[styles.row, styles.actionRow]}>
          <Typography variant="label" weight="medium" style={styles.label}>
            Action:
          </Typography>

          <View style={styles.actionRight}>
            <AppButton
              title="View"
              titleSize="label"
              onPress={() =>
                navigation.navigate(NAV_KEYS.UserBookingDetailScreen, {
                  BookingData: item,
                })
              }
              style={styles.viewBtn}
            />

            {item?.pay_action && (
              <AppButton
                title="Pay"
                titleSize="label"
                onPress={() =>
                  navigation.navigate(NAV_KEYS.UserPaymentScreen, {
                    LandlordId: property?.landlord_id,
                    Amount: item?.amount,
                    EnquiryId: item?.enquiry_id,
                    PaymentStartDate: item?.payment_start_date,
                    PaymentStartEnd: item?.payment_end_date
                  })
                }
                style={styles.paymentBtn}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Booking"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loaderText} weight="medium">
            Loading booking...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={myBookings || []}
          renderItem={renderItem}
          keyExtractor={(item, i) =>
            item?.enquiry_id?.toString() || i.toString()
          }
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
            <Typography style={styles.emptyText} weight="medium">
              No Booking Found
            </Typography>
          }
        />
      )}
    </View>
  );
};

export default UserMyBookingScreen;
