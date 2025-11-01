import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import AppButton from '../../../ui/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserMyBooking } from '../../../store/mainSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { formatDate } from '../../../utils/formatDate';

type EnquiryNavProp = NativeStackNavigationProp<RootStackParamList>;

const UserMyBookingScreen = () => {
  const navigation = useNavigation<EnquiryNavProp>();
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const { myBookings, loading } = useSelector((state: any) => state.main);

  useEffect(() => {
    dispatch(
      fetchUserMyBooking({
        company_id: userData?.company_id,
        user_id: userData?.user_id,
      }),
    );
  }, [dispatch]);

  const renderStatusBadge = (status: string) => {
    const bgColor =
      status === 'Pending'
        ? '#FFD54F'
        : status === 'Accepted'
        ? '#4CAF50'
        : '#E57373';

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Typography variant="caption" weight="medium" style={styles.statusText}>
          {status}
        </Typography>
      </View>
    );
  };

  const renderPaymentStatusBadge = (status: string) => {
    const bgColor =
      status === 'Pending'
        ? '#FFD54F'
        : status === 'Active'
        ? '#4CAF50'
        : '#E57373';

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Typography variant="caption" weight="medium" style={styles.statusText}>
          {status}
        </Typography>
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* PG Name */}
      <View style={styles.row}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Pg Name:
        </Typography>
        <Typography weight="regular" variant="label" style={styles.value}>
          {item?.property?.property_title || '-'}
        </Typography>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Location:
        </Typography>
        <Typography weight="regular" variant="label" style={styles.value}>
          {item?.property?.property_address || '-'}
        </Typography>
      </View>

      {/* Check In */}
      <View style={styles.row}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Check In:
        </Typography>
        <Typography weight="regular" variant="label" style={styles.value}>
          {formatDate(item?.check_in_date) || '-'}
        </Typography>
      </View>

      {/* Payment Detail */}
      <View style={styles.row}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Payment Detail:
        </Typography>
        {item?.payment_status_text === 'Pending' ? (
          renderPaymentStatusBadge(item?.payment_status_text)
        ) : (
          <View style={styles.paymentBox}>
            <Typography
              weight="medium"
              variant="caption"
              style={styles.leftText}
            >
              Amount:{' '}
              <Typography weight="regular" variant="caption">
                ₹{item?.property?.property_price}
              </Typography>
            </Typography>
            <Typography
              weight="medium"
              variant="caption"
              style={styles.leftText}
            >
              Start Date:{' '}
              <Typography weight="regular" variant="caption">
                {formatDate(item?.payment_start_date)}
              </Typography>
            </Typography>
            <Typography
              weight="medium"
              variant="caption"
              style={styles.leftText}
            >
              End Date:{' '}
              <Typography weight="regular" variant="caption">
                {formatDate(item?.payment_end_date)}
              </Typography>
            </Typography>
            <Typography
              weight="medium"
              variant="caption"
              style={styles.leftText}
            >
              Payment Status:{' '}
              <View style={{ marginTop: 5 }}>
                {renderPaymentStatusBadge(item?.payment_status_text)}
              </View>
            </Typography>
          </View>
        )}
      </View>

      {/* Status */}
      <View style={[styles.row, styles.statusRow]}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Status:
        </Typography>
        {renderStatusBadge(item?.status)}
      </View>

      {/* Action Buttons */}
      <View style={[styles.row, styles.actionRow]}>
        <Typography weight="medium" variant="label" style={styles.label}>
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
          {item?.pay_action ? (
            <AppButton
              title="Pay"
              titleSize="label"
              onPress={() =>
                navigation.navigate(NAV_KEYS.UserPaymentScreen, {
                  LandlordId: item?.property?.landlord_id,
                  Amount: item?.amount,
                  EnquiryId:item?.enquiry_id
                })
              }
              style={styles.paymentBtn}
            />
          ) : null}
        </View>
      </View>
    </View>
  );

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
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loaderText} weight="medium">
            Loading booking...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={myBookings || []}
          keyExtractor={(item: any, i) =>
            item.enquiry_id?.toString() || i.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
