import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../constants/colors';
import styles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchLandlordPaymentHistory,
  updatePaymentStatus,
} from '../../../../store/mainSlice';
import { useRoute } from '@react-navigation/native';
import AppImage from '../../../../ui/AppImage';
import { formatDate } from '../../../../utils/formatDate';
import AppButton from '../../../../ui/AppButton';
import { showMessage } from 'react-native-flash-message';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

const LandlordPaymentHistory = () => {
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const route = useRoute();
  const { EnquiryId, companyId }: any = route.params;
  const { landlordPaymentHistory, loading } = useSelector(
    (state: any) => state.main,
  );

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentHistory();
  }, [userData]);

  const loadPaymentHistory = () => {
    if (userData?.user_type === 'landlord') {
      dispatch(
        fetchLandlordPaymentHistory({
          company_id: companyId || userData?.company_id,
          enquiry_id: EnquiryId || '',
        }),
      );
    }
  };

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

  const handleAction = (action: 'approved' | 'rejected', item: any) => {
    Alert.alert(
      `${action === 'approved' ? 'Approve' : 'Reject'} Payment`,
      `Are you sure you want to ${action} this payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const payload = {
              payment_id: item?.payment_id,
              action,
              company_id: companyId || userData?.company_id,
            };
            try {
              const response: any = await dispatch(
                updatePaymentStatus(payload),
              );
              if (response?.payload?.success) {
                showSuccessMsg(
                  response?.payload?.message || 'Payment Update successfully!',
                );
                loadPaymentHistory(); //Refresh list automatically
              } else {
                showErrorMsg(
                  response?.payload?.message || 'Something went wrong.',
                );
              }
            } catch (error) {
              appLog('LandlordPaymentHistory', 'Error:', error);
              showErrorMsg('Something went wrong while updating.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: any) => (
    console.log('item ============>>>>>>', item),
    (
      <View style={styles.card}>
        <View style={[styles.row, { marginTop: 5 }]}>
          <Typography weight="medium" variant="label" style={styles.label}>
            Payment Status:
          </Typography>
          {renderStatusBadge(item?.payment_status)}
        </View>

        {[
          { label: 'Created Date', value: formatDate(item?.created_at) },
          {
            label: 'Discount',
            value: `₹${item?.discount || '₹0'}`,
          },
          { label: 'Amount', value: `₹${item?.amount || '₹0'}` },
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

        {item?.payment_mode && (
          <View style={styles.row}>
            <Typography weight="medium" variant="label" style={styles.label}>
              Payment Mode:
            </Typography>
            <Typography weight="regular" variant="label" style={styles.value}>
              {item?.payment_mode}
            </Typography>
          </View>
        )}

        {/* Screenshot */}
        <View style={{ marginTop: 5 }}>
          <Typography weight="medium" variant="label" style={styles.label}>
            Screenshot:
          </Typography>
          <TouchableOpacity
            onPress={() => {
              setPreviewImage(item?.screenshot);
              setPreviewVisible(true);
            }}
            style={{ height: 100, marginTop: 10, width: 120 }}
          >
            <AppImage
              source={{ uri: item?.screenshot }}
              style={styles.screenshotImg}
              resizeMode="center"
            />
          </TouchableOpacity>
        </View>

        {/* Approve / Reject Buttons */}
        {item?.payment_status === 'pending' && (
          <View style={styles.buttonContainer}>
            <AppButton
              title="Approve"
              titleSize="label"
              onPress={() => handleAction('approved', item)}
              style={[styles.footerBtn, { backgroundColor: colors.succes }]}
            />
            <AppButton
              title="Reject"
              titleSize="label"
              onPress={() => handleAction('rejected', item)}
              style={[styles.footerBtn, { backgroundColor: colors.rejected }]}
            />
          </View>
        )}
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Detail" showBack />

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
            item?.payment_id?.toString() || i.toString()
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

      {/* Screenshot Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={() => setPreviewVisible(false)}
            hitSlop={20}
            style={styles.modalCloseBtn}
          >
            <Typography variant="caption" style={styles.modalCloseText}>
              ✕
            </Typography>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {previewImage && (
              <AppImage
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="center"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LandlordPaymentHistory;
