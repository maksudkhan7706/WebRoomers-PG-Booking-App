import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import styles from './styles';
import AppButton from '../../../ui/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchLandlordEnquiries,
  fetchLandlordPaymentHistory,
} from '../../../store/mainSlice';
import { useRoute } from '@react-navigation/native';
import AppImage from '../../../ui/AppImage';
import { formatDate } from '../../../utils/formatDate';

const LandlordPaymentHistory = () => {
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const { landlordPaymentHistory, loading } = useSelector(
    (state: any) => state.main,
  );
  const route = useRoute();
  const { EnquiryId, companyId }: any = route.params;

  useEffect(() => {
    if (userData?.user_type === 'landlord') {
      dispatch(
        fetchLandlordPaymentHistory({
          company_id: companyId || userData?.company_id,
          enquiry_id: EnquiryId || '',
        }),
      );
    }
  }, [userData]);

  const renderStatusBadge = (status: string) => {
    const bgColor =
      status === 'pending'
        ? '#FFD54F'
        : status === 'approved'
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
      {[
        { label: 'Created date', value: formatDate(item?.created_at) },
        { label: 'Amount', value: item?.amount },
        { label: 'Start Date', value: formatDate(item?.start_date) },
        { label: 'End Date', value: formatDate(item?.end_date) },
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
          Payment Status:
        </Typography>
        {renderStatusBadge(item?.payment_status)}
      </View>
      <View style={[{ marginTop: 5 }]}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Screenshot:
        </Typography>
        <View
          style={{
            height: 100,
            marginTop: 10,
          }}
        >
          <AppImage
            source={{ uri: item?.screenshot }}
            style={styles.screenshotImg}
            resizeMode="stretch"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Payment Detail"
        showBack
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      {loading ? (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading payment...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={landlordPaymentHistory || []}
          keyExtractor={(item: any, i) =>
            item.enquiry_id?.toString() || i.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Typography
              style={{ textAlign: 'center', marginTop: 50 }}
              weight="medium"
            >
              No Payment History Found!
            </Typography>
          }
        />
      )}
    </View>
  );
};

export default LandlordPaymentHistory;
