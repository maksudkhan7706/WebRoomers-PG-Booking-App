import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import AppImage from '../../../../ui/AppImage';
import { formatDate } from '../../../../utils/formatDate';
import { fetchLandlordPaymentHistory } from '../../../../store/mainSlice';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';

const UserPaymentDetailScreen = () => {
  const dispatch = useDispatch<any>();
  const route = useRoute();
  const { EnquiryId, companyId }: any = route.params || {};

  const { userData } = useSelector((state: any) => state.auth);
  const { landlordPaymentHistory, loading } = useSelector(
    (state: any) => state.main,
  );

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentHistory();
  }, [userData, EnquiryId, companyId]);

  const loadPaymentHistory = () => {
    if (!userData?.company_id && !companyId) {
      return;
    }

    dispatch(
      fetchLandlordPaymentHistory({
        company_id: companyId || userData?.company_id,
        enquiry_id: EnquiryId || '',
      }),
    );
  };

  const renderStatusBadge = (status: string) => {
    const bgColor =
      status === 'approved'
        ? '#E8F6EF'
        : status === 'pending'
        ? '#FFF6E5'
        : '#FFE8E5';
    const textColor =
      status === 'approved'
        ? '#1B875B'
        : status === 'pending'
        ? '#C98A24'
        : '#C43D37';

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Typography
          variant="caption"
          weight="bold"
          style={[styles.statusText, { color: textColor }]}
        >
          {status || 'N/A'}
        </Typography>
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Typography variant="caption" style={styles.cardMetaLabel}>
            Payment ID
          </Typography>
          <Typography variant="body" weight="bold" style={styles.cardMetaValue}>
            #{item?.payment_id || '--'}
          </Typography>
        </View>
        {renderStatusBadge(item?.payment_status)}
      </View>

      <View style={styles.infoGrid}>
        {[
          {
            label: 'Created Date',
            value: formatDate(item?.created_at),
            icon: 'calendar',
          },
          {
            label: 'Payment Mode',
            value: item?.payment_mode,
            icon: 'credit-card',
          },

          {
            label: 'Discount',
            value: `₹${item?.discount || '0'}`,
            icon: 'percent',
          },
          {
            label: 'Amount',
            value: `₹${item?.amount || '0'}`,
            icon: 'credit-card',
          },
          {
            label: 'Start Date',
            value: formatDate(item?.start_date),
            icon: 'play-circle',
          },
          {
            label: 'End Date',
            value: formatDate(item?.end_date),
            icon: 'stop-circle',
          },
        ].map(info => (
          <View style={styles.infoItem} key={info.label}>
            <View style={styles.infoLabelRow}>
              <View style={styles.infoIconWrap}>
                <Feather
                  name={info.icon as any}
                  size={14}
                  color={colors.mainColor}
                />
              </View>
              <Typography variant="caption" style={styles.infoLabel}>
                {info.label}
              </Typography>
            </View>
            <Typography
              variant="label"
              weight="medium"
              style={styles.infoValue}
            >
              {info.value || '--'}
            </Typography>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View>
        <View style={styles.screenshotHeader}>
          <Typography variant="caption" style={styles.infoLabel}>
            Screenshot
          </Typography>
          {item?.screenshot ? (
            <Typography
              variant="caption"
              style={styles.viewFullLink}
              onPress={() => {
                setPreviewImage(item?.screenshot);
                setPreviewVisible(true);
              }}
            >
              View full
            </Typography>
          ) : null}
        </View>
        {item?.screenshot ? (
          <TouchableOpacity
            style={styles.screenshotWrapper}
            activeOpacity={0.9}
            onPress={() => {
              setPreviewImage(item?.screenshot);
              setPreviewVisible(true);
            }}
          >
            <View style={styles.screenshotInner}>
              <AppImage
                source={{ uri: item?.screenshot }}
                style={styles.screenshotImg}
                resizeMode="center"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.screenshotPlaceholder}>
            <Typography align="center" variant="caption" color={colors.gray}>
              No screenshot provided
            </Typography>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Detail" showBack />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loaderText} weight="medium">
            Fetching payment details...
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
            <View style={styles.emptyState}>
              <Typography variant="body" weight="medium" color={colors.gray}>
                No payments found for this booking.
              </Typography>
            </View>
          }
        />
      )}

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
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserPaymentDetailScreen;
