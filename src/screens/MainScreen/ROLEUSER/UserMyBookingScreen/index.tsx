import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AppHeader from '../../../../ui/AppHeader';
import Typography from '../../../../ui/Typography';
import AppButton from '../../../../ui/AppButton';
import CheckoutModal from '../../../../ui/CheckoutModal';
import colors from '../../../../constants/colors';
import styles from './styles';
import {
  fetchUserMyBooking,
  submitCheckout,
} from '../../../../store/mainSlice';
import { formatDate } from '../../../../utils/formatDate';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { appLog } from '../../../../utils/appLog';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';

type EnquiryNavProp = NativeStackNavigationProp<RootStackParamList>;

const UserMyBookingScreen = () => {
  const navigation = useNavigation<EnquiryNavProp>();
  const dispatch = useDispatch<any>();
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const { userData } = useSelector((state: any) => state.auth);
  const { myBookings, loading } = useSelector((state: any) => state.main);
  const [refreshing, setRefreshing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const isCompactLayout = width < 380;

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
    <View style={[styles.statusBadge, { borderColor: color }]}>
      <Typography
        variant="caption"
        weight="medium"
        style={[styles.statusText, { color }]}
      >
        {label || '-'}
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

  const getCheckoutStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#E57373';
      case 'pending':
        return '#FFD54F';
      default:
        return '#94A3B8';
    }
  };

  const formatCheckoutStatus = (status: string) => {
    if (!status) return '-';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const renderItem = ({ item }: any) => {
    const property = item?.property || {};
    // 🔥 Room hai to room charges, otherwise property charges
    const isRoom = !!item?.room;
    const securityCharges = isRoom
      ? item?.room?.security_deposit ?? 0
      : item?.property?.property_security_charges ?? 0;
    const maintainanceCharges = isRoom
      ? item?.room?.mantinance_deposit ?? 0
      : item?.property?.property_maintainance_charges ?? 0;
    const totalAmount = item?.amount ?? 0;
    // Room rent logic
    const RoomRent = isRoom
      ? item?.room?.room_rent ?? 0
      : item?.property?.room_rent ?? 0;
    // Get pg_id: from room if available, otherwise from property
    const pgId = isRoom ? item?.room?.pg_id : item?.property?.property_id;
    // Get landlord_id: from room if available, otherwise from property
    const landlordId = isRoom
      ? item?.room?.landlord_id
      : item?.property?.landlord_id;

    const canMakePayment =
      item?.pay_action === true ||
      item?.pay_action === 1 ||
      item?.pay_action === '1';


    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(NAV_KEYS.UserBookingDetailScreen, {
                  BookingData: item,
                })
              }
            >
              <Typography variant="body" weight="bold" style={styles.pgTitle}>
                {property?.property_title || '-'}
              </Typography>
            </TouchableOpacity>

            <View style={styles.locationRow}>
              <FontAwesome
                name="map-marker"
                size={14}
                color={colors.mainColor}
              />
              <Typography style={styles.locationText} variant="label">
                {property?.property_address || '-'}
              </Typography>
            </View>
          </View>
          <View style={styles.statusColumn}>
            <View style={styles.statusEntry}>
              <Typography variant="caption" style={styles.statusLabel}>
                Booking Status
              </Typography>
              <StatusBadge
                label={item?.status}
                color={getStatusColor(item?.status)}
              />
            </View>
            <View style={styles.statusEntry}>
              <Typography variant="caption" style={styles.statusLabel}>
                Payment Status
              </Typography>
              <StatusBadge
                label={item?.payment_status_text}
                color={getStatusColor(item?.payment_status_text)}
              />
            </View>
          </View>
        </View>

        {/* Check-in / Check-out */}
        <View style={styles.infoGrid}>
          {[
            {
              label: 'Check In',
              value: formatDate(item?.check_in_date) || '-',
              icon: 'login',
            },
            {
              label: 'Due Date',
              value: formatDate(item?.check_out_date) || '-',
              icon: 'logout',
            },
          ].map(tile => (
            <View key={tile.label} style={styles.infoTile}>
              <MaterialIcons
                name={tile.icon as any}
                size={18}
                color={colors.mainColor}
              />
              <View style={styles.infoTextWrap}>
                <Typography variant="caption" style={styles.infoLabel}>
                  {tile.label}
                </Typography>
                <Typography variant="label" weight="medium">
                  {tile.value}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        {/* Checkout Information Card */}
        {item?.checkout && (
          <View style={styles.checkoutCard}>
            <View style={styles.checkoutHeader}>
              <View style={styles.checkoutHeaderLeft}>
                <Feather name="log-out" size={18} color={colors.mainColor} />
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.checkoutTitle}
                >
                  Checkout Information
                </Typography>
              </View>
              <StatusBadge
                label={formatCheckoutStatus(item.checkout.status)}
                color={getCheckoutStatusColor(item.checkout.status)}
              />
            </View>

            <View style={styles.checkoutContent}>
              <View style={styles.checkoutRow}>
                <View style={styles.checkoutLabelContainer}>
                  <Feather name="calendar" size={16} color="#64748B" />
                  <Typography variant="caption" style={styles.checkoutLabel}>
                    Checkout Date
                  </Typography>
                </View>
                <Typography
                  variant="label"
                  weight="medium"
                  style={styles.checkoutValue}
                >
                  {formatDate(item.checkout.checkout_date) || '-'}
                </Typography>
              </View>

              <View style={styles.checkoutRow}>
                <View style={styles.checkoutLabelContainer}>
                  <Feather name="file-text" size={16} color="#64748B" />
                  <Typography variant="caption" style={styles.checkoutLabel}>
                    Reason
                  </Typography>
                </View>
                <Typography variant="label" style={styles.checkoutReason}>
                  {item.checkout.checkout_reason || '-'}
                </Typography>
              </View>
            </View>
          </View>
        )}

        {/* Footer Buttons */}
        <View
          style={[
            styles.actionFooter,
            isCompactLayout
              ? styles.actionFooterColumn
              : styles.actionFooterRow,
          ]}
        >
          {item?.status === 'Accepted' &&
            item.checkout?.status !== 'approved' && (
              <>
                <AppButton
                  title="Check Out"
                  titleSize="caption"
                  titleColor={colors.mainColor}
                  onPress={() => {
                    setSelectedBooking(item);
                    setShowCheckoutModal(true);
                  }}
                  style={[
                    styles.footerButton,
                    isCompactLayout && styles.footerButtonFullWidth,
                    styles.viewBtn,
                  ]}
                />
              </>
            )}

          <AppButton
            title="Payment Details"
            titleSize="caption"
            titleColor={colors.primary}
            onPress={() =>
              navigation.navigate(NAV_KEYS.UserPaymentDetailScreen, {
                EnquiryId: item?.enquiry_id,
                companyId: userData?.company_id,
              })
            }
            style={[
              styles.footerButton,
              isCompactLayout && styles.footerButtonFullWidth,
              styles.paymentDetailsBtn,
            ]}
          />

          {canMakePayment && (
            <AppButton
              title="Make Payment"
              titleSize="caption"
              titleColor="#0E9F6E"
              onPress={() =>
                navigation.navigate(NAV_KEYS.UserPaymentScreen, {
                  LandlordId: landlordId,
                  PgId: pgId,
                  Amount: totalAmount, // final amount
                  EnquiryId: item?.enquiry_id,
                  PaymentStartDate: item?.check_in_date,
                  PaymentStartEnd: item?.check_out_date,
                  SecurityCharges: securityCharges,
                  MaintainanceCharges: maintainanceCharges,
                  RoomRent: RoomRent,
                  LandlordName: property?.property_user_name,
                  LandlordEmail: property?.property_user_email,
                  LandlordMobile: property?.property_user_mobile,
                })
              }
              style={[
                styles.footerButton,
                isCompactLayout && styles.footerButtonFullWidth,
                styles.paymentBtn,
              ]}
            />
          )}
        </View>
      </View>
    );
  };

  const handleCheckoutSubmit = async (checkoutDate: Date, reason: string) => {
    if (!selectedBooking || !userData) {
      appLog('UserMyBookingScreen', 'Missing booking or user data');
      return;
    }
    // Format date to YYYY-MM-DD
    const formatDateForAPI = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const lockInPeriod = selectedBooking?.property?.lock_in_period
      ? selectedBooking.property.lock_in_period
      : '0';

    const payload = {
      user_id: userData?.user_id.toString(),
      checkout_date: formatDateForAPI(checkoutDate),
      company_id: userData?.company_id.toString(),
      property_enquiry_id: selectedBooking?.enquiry_id.toString(),
      lockin_period: lockInPeriod,
      checkout_reason: reason,
    };
    try {
      const result = await dispatch(submitCheckout(payload));

      if (submitCheckout.fulfilled.match(result)) {
        showSuccessMsg(result?.payload?.message || 'Checkout successfully');
        setShowCheckoutModal(false);
        setSelectedBooking(null);
        await fetchBookings();
      } else {
        appLog('UserMyBookingScreen', 'Checkout failed:', result.payload);
        showErrorMsg(result?.payload?.message || 'Checkout failed');
      }
    } catch (error) {
      showErrorMsg('Checkout failed. Please try again.');
    }
  };

  const lockInPeriod = selectedBooking?.property?.lock_in_period
    ? parseInt(selectedBooking.property.lock_in_period, 10)
    : 0;

  return (
    <View style={styles.container}>
      <AppHeader title="My Booking" />

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

      <CheckoutModal
        visible={showCheckoutModal}
        pgTitle={selectedBooking?.property?.property_title || '-'}
        lockInPeriod={lockInPeriod}
        onCancel={() => {
          setShowCheckoutModal(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleCheckoutSubmit}
        loading={loading}
      />
    </View>
  );
};

export default UserMyBookingScreen;
