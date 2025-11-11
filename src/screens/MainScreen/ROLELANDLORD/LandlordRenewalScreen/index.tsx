import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../constants/colors';
import Typography from '../../../../ui/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { appLog } from '../../../../utils/appLog';
import { fetchRenewalUsersDetail } from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { showErrorMsg } from '../../../../utils/appMessages';
import { useIsFocused } from '@react-navigation/native';

const LandlordRenewalScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { landlordRenewalUsers, loading } = useSelector(
    (state: RootState) => state.main,
  );
  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    const payload: any = {
      company_id: userData?.company_id,
      landlord_id: userData?.user_id,
    };
    appLog('LandlordRenewalScreen', 'Dashboard Payload', payload);
    dispatch(fetchRenewalUsersDetail(payload));
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        {[
          { label: 'PG Name', value: item?.property_title },
          { label: 'PG Address', value: item?.property_address },
          { label: 'Name', value: item?.user_fullname },
          { label: 'Mobile', value: item?.user_mobile },
          { label: 'Start Date', value: item?.start_date },
          { label: 'End Date', value: item?.end_date },
          { label: 'Amount', value: item?.amount },
          { label: 'Expired', value: `${item?.days_expired} days` },
        ].map((field, index) => (
          <View key={index} style={styles.row}>
            <Typography
              weight="medium"
              variant="label"
              style={[
                styles.label,
                field.label === 'Expired' && { color: 'red' },
              ]}
            >
              {field.label}:
            </Typography>
            <Typography
              weight="regular"
              variant="label"
              style={[
                styles.value,
                field.label === 'Expired' && { color: 'red' },
              ]}
            >
              {field.value}
            </Typography>
          </View>
        ))}

        <AppButton
          title="📞  Call Now"
          onPress={() => {
            const phoneNumber = item?.user_mobile?.trim();
            if (phoneNumber) {
              Linking.openURL(`tel:${phoneNumber}`);
            } else {
              showErrorMsg('Phone number not available');
            }
          }}
          style={{ backgroundColor: '#1ca04dff', marginTop: 20 }}
        />
      </View>
    );
  };

  appLog('LandlordRenewalScreen', 'landlordRenewalUsers', landlordRenewalUsers);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Renewal"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />

      <View style={styles.contentContainer}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.mainColor} />
            <Typography
              variant="label"
              style={{ marginTop: 10, color: colors.mainColor }}
            >
              Loading, please wait...
            </Typography>
          </View>
        ) : (
          // 🔹 Data load hone ke baad FlatList render hogi
          <FlatList
            data={
              Array.isArray(landlordRenewalUsers)
                ? landlordRenewalUsers
                : Object.values(landlordRenewalUsers || {})
            }
            keyExtractor={(item: any, i) =>
              item.payment_id?.toString() || i.toString()
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
                No Renewal Found!
              </Typography>
            }
          />
        )}
      </View>
    </View>
  );
};

export default LandlordRenewalScreen;
