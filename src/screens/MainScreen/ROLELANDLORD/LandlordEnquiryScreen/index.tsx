import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../constants/colors';
import styles from './styles';
import AppButton from '../../../../ui/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLandlordEnquiries } from '../../../../store/mainSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { appLog } from '../../../../utils/appLog';

type EnquiryNavProp = NativeStackNavigationProp<RootStackParamList>;

const LandlordEnquiryScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<EnquiryNavProp>();
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const { pgEnquiries, loading } = useSelector((state: any) => state.main);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    dispatch(
      fetchLandlordEnquiries({
        company_id: userData?.company_id,
        landlord_id: userData?.user_id,
      }),
    );
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const enquiriesList = pgEnquiries ? Object.values(pgEnquiries) : [];

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
      status === 'Active'
        ? '#4CAF50'
        : status === 'Pending'
        ? '#FFD54F'
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
    appLog('renderItem', 'item', item),
    (
      <View style={styles.card}>
        {[
          { label: 'Name', value: item.name },
          { label: 'Mobile', value: item.mobile },
          { label: 'Check In', value: item.check_in_date },
          { label: 'Check Out', value: item.check_out_date },
          { label: 'Stay Duration', value: item.stay_duration },
          { label: 'No. of Persons', value: item.no_of_persons },
          { label: 'Food Preference', value: item.food_preference },
        ].map((field, index) => (
          <View key={index} style={styles.row}>
            <Typography weight="medium" variant="label" style={styles.label}>
              {field.label}:
            </Typography>
            <Typography weight="regular" variant="label" style={styles.value}>
              {field.value}
            </Typography>
          </View>
        ))}

        <View style={[styles.row, { marginTop: 5 }]}>
          <Typography weight="medium" variant="label" style={styles.label}>
            Payment Detail:
          </Typography>
          {renderPaymentStatusBadge(item.payment_status_text)}
        </View>
        <View style={[styles.row, { marginTop: 5 }]}>
          <Typography weight="medium" variant="label" style={styles.label}>
            Status:
          </Typography>
          {renderStatusBadge(
            item?.status == 1
              ? 'Pending'
              : item?.status == 2
              ? 'Accepted'
              : 'Rejected',
          )}
        </View>

        <View style={[styles.row, { marginTop: 5, alignItems: 'center' }]}>
          <Typography weight="medium" variant="label" style={styles.label}>
            Action:
          </Typography>
          <View style={styles.actionRight}>
            <AppButton
              title="View"
              onPress={() =>
                navigation.navigate(NAV_KEYS.LandlordViewEnquiryDetails, {
                  EnquiryId: item?.enquiry_id || '',
                  companyId: userData?.company_id,
                })
              }
              style={styles.viewBtn}
            />
            <AppButton
              title="Payment Detail"
              onPress={() =>
                navigation.navigate(NAV_KEYS.LandlordPaymentHistory, {
                  EnquiryId: item?.enquiry_id || '',
                  companyId: userData?.company_id,
                })
              }
              style={styles.paymentBtn}
            />
          </View>
        </View>
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Enquiries"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      {loading && !refreshing ? (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading enquiries...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={enquiriesList}
          keyExtractor={(item: any, i) =>
            item.enquiry_id?.toString() || i.toString()
          }
          renderItem={renderItem}
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
            <Typography
              style={{ textAlign: 'center', marginTop: 50 }}
              weight="medium"
            >
              No Enquiries Found
            </Typography>
          }
        />
      )}
    </View>
  );
};

export default LandlordEnquiryScreen;
