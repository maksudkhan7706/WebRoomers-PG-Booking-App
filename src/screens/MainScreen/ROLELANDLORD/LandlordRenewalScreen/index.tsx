import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchRenewalUsersDetail,
  apiUserDataFetch,
  fetchAllUserPermissions,
} from '../../../../store/mainSlice';
import AppHeader from '../../../../ui/AppHeader';
import AppButton from '../../../../ui/AppButton';
import Typography from '../../../../ui/Typography';
import colors from '../../../../constants/colors';
import styles from './styles';
import { showErrorMsg } from '../../../../utils/appMessages';
import { hasPermission } from '../../../../utils/permissions';
import AccessDeniedScreenView from '../../../../ui/AccessDeniedScreenView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/NavKeys';

type LandlordRenewalProp = NativeStackNavigationProp<RootStackParamList>;

const LandlordRenewalScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LandlordRenewalProp>();
  const {
    landlordRenewalUsers,
    loading,
    apiUserData,
    userAllPermissions,
  } = useSelector((state: RootState) => state.main);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    if (!userData?.company_id || !userData?.user_id) return;

    const payload = {
      company_id: userData.company_id,
      landlord_id: userData.user_id,
      user_type: userData?.user_type,
      property_id: userData?.assigned_pg_ids,
    };

    dispatch(fetchRenewalUsersDetail(payload));
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isFocused]);

  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      dispatch(
        apiUserDataFetch({
          user_id: userData.user_id,
          company_id: userData.company_id,
        }),
      );
      dispatch(
        fetchAllUserPermissions({
          company_id: userData.company_id,
        }),
      );
    }
  }, [isFocused, dispatch, userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchData(),
      userData?.user_id &&
        userData?.company_id &&
        dispatch(
          apiUserDataFetch({
            user_id: userData.user_id,
            company_id: userData.company_id,
          }),
        ),
      userData?.company_id &&
        dispatch(
          fetchAllUserPermissions({
            company_id: userData.company_id,
          }),
        ),
    ]);
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const expiredDays = Number(item?.days_expired) || 0;
    const isExpired = expiredDays > 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Typography weight="bold" style={styles.pgName} numberOfLines={2}>
              {item?.property_title || 'PG name unavailable'}
            </Typography>
            <Typography
              variant="caption"
              style={styles.pgAddress}
              numberOfLines={2}
            >
              {item?.property_address || 'Address unavailable'}
            </Typography>
          </View>
          <View
            style={[
              styles.statusPill,
              isExpired ? styles.statusPillExpired : styles.statusPillActive,
            ]}
          >
            <Typography
              weight="medium"
              variant="caption"
              style={[
                styles.statusText,
                isExpired ? styles.statusTextExpired : styles.statusTextActive,
              ]}
            >
              {isExpired ? 'Expired' : 'Due Soon'}
            </Typography>
            <Typography weight="bold" style={styles.statusDays}>
              {`${expiredDays} ${expiredDays === 1 ? 'day' : 'days'}`}
            </Typography>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.scheduleRow}>
          <View style={styles.scheduleCard}>
            <Typography variant="caption" style={styles.scheduleLabel}>
              Start Date
            </Typography>
            <Typography weight="bold">{item?.start_date || '-'}</Typography>
          </View>
          <View style={[styles.scheduleCard, styles.scheduleCardLast]}>
            <Typography variant="caption" style={styles.scheduleLabel}>
              End Date
            </Typography>
            <Typography weight="bold">{item?.end_date || '-'}</Typography>
          </View>
        </View>

        {[
          { label: 'Tenant', value: item?.user_fullname || '-', icon: 'user' },
          { label: 'Mobile', value: item?.user_mobile || 'NA', icon: 'phone' },
          {
            label: 'Amount',
            value: item?.amount ? `₹ ${item.amount}` : 'NA',
            icon: 'money',
          },
        ].map(action => (
          <View style={styles.detailRow} key={action.label}>
            <View style={styles.iconWrapper}>
              <FontAwesome
                name={action.icon as any}
                size={16}
                color={colors.mainColor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="caption" style={styles.detailLabel}>
                {action.label}
              </Typography>
              <Typography weight="bold" style={styles.detailValue}>
                {action.value}
              </Typography>
            </View>
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
          style={styles.callButton}
        />
      </View>
    );
  };

  const dataList = Array.isArray(landlordRenewalUsers)
    ? landlordRenewalUsers
    : Object.values(landlordRenewalUsers || {});

  const hasAccess = hasPermission(
    userData,
    apiUserData,
    'renewal',
    userAllPermissions,
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Renewal" />
      {/*Loader (loading or refreshing) */}
      {loading || refreshing ? (
        <View
          style={[
            styles.container,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading renewals...
          </Typography>
        </View>
      ) : apiUserData?.data?.user_permissions &&
        !hasAccess ? (
        <AccessDeniedScreenView
          message="Your account doesn't have access to view renewal details."
          onBackPress={() => navigation.goBack()}
        />
      ) : (
        <FlatList
          data={dataList}
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
  );
};

export default LandlordRenewalScreen;