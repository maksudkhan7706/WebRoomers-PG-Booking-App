import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../../constants/colors';
import styles from './styles';
import AppButton from '../../../../ui/AppButton';
import AppTextInput from '../../../../ui/AppTextInput';
import FiltersModal from './components/FiltersModal';
import { useSelector, useDispatch } from 'react-redux';
import {
  apiUserDataFetch,
  fetchLandlordEnquiries,
  fetchAllUserPermissions,
  fetchMyPgList,
  activeInactiveStatus,
  updateCheckoutStatusApi,
} from '../../../../store/mainSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { hasPermission } from '../../../../utils/permissions';
import AccessDeniedModal from '../../../../ui/AccessDeniedModal';
import AccessDeniedScreenView from '../../../../ui/AccessDeniedScreenView';
import InactiveModal from '../../../../ui/InactiveModal';
import { showSuccessMsg, showErrorMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

type EnquiryNavProp = NativeStackNavigationProp<RootStackParamList>;

type EnquiryStatusFilter = 'pending' | 'approved' | null;
type ActiveStatusFilter = 'active' | 'inactive' | null;
type CheckoutStatusFilter = 'pending' | 'approved' | 'rejected' | null;

const mapEnquiryStatusLabel = (status: any): string => {
  if (status == 1 || status === '1') return 'Pending';
  if (status == 2 || status === '2') return 'Accepted';
  return 'Rejected';
};

const filterEnquiries = (
  rawEnquiries: any,
  {
    enquiryStatusFilter,
    activeStatusFilter,
    checkoutStatusFilter,
  }: {
    enquiryStatusFilter: EnquiryStatusFilter;
    activeStatusFilter: ActiveStatusFilter;
    checkoutStatusFilter: CheckoutStatusFilter;
  },
) => {
  let enquiries = rawEnquiries ? Object.values(rawEnquiries) : [];
  // Filter by enquiry status (client-side)
  if (enquiryStatusFilter !== null) {
    enquiries = enquiries.filter((item: any) => {
      if (enquiryStatusFilter === 'pending') {
        return item?.status == 1 || item?.status === '1';
      }
      if (enquiryStatusFilter === 'approved') {
        return item?.status == 2 || item?.status === '2';
      }
      return true;
    });
  }
  // Filter by active status (client-side backup)
  if (activeStatusFilter !== null) {
    enquiries = enquiries.filter((item: any) => {
      const isActive =
        item?.active_status !== undefined
          ? item.active_status === 1 || item.active_status === '1'
          : item?.status !== '0' && item?.status !== 0;

      return activeStatusFilter === 'active' ? isActive : !isActive;
    });
  }
  // Filter by checkout status, but ignore items with no checkout_data
  if (checkoutStatusFilter !== null) {
    enquiries = enquiries.filter((item: any) => {
      const checkout = item?.checkout_data;
      if (!checkout || !checkout.status) {
        // Ignore filter for enquiries without checkout data
        return true;
      }
      const normalized = String(checkout.status).toLowerCase();
      if (checkoutStatusFilter === 'pending') return normalized === 'pending';
      if (checkoutStatusFilter === 'approved') return normalized === 'approved';
      if (checkoutStatusFilter === 'rejected') return normalized === 'rejected';
      return true;
    });
  }
  return enquiries;
};

const LandlordEnquiryScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<EnquiryNavProp>();
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const {
    pgEnquiries,
    loading,
    apiUserData,
    userAllPermissions,
    pgListSimple,
  } = useSelector((state: any) => state.main);
  const [refreshing, setRefreshing] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [enquiryStatusFilter, setEnquiryStatusFilter] =
    useState<EnquiryStatusFilter>('pending'); // default: Pending
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<ActiveStatusFilter>('active'); // default: Active
  const [checkoutStatusFilter, setCheckoutStatusFilter] =
    useState<CheckoutStatusFilter>(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [inactivating, setInactivating] = useState(false);
  const [showRejectCheckoutModal, setShowRejectCheckoutModal] = useState(false);
  const [selectedCheckoutEnquiry, setSelectedCheckoutEnquiry] =
    useState<any>(null);
  const [selectedCheckoutData, setSelectedCheckoutData] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState('');
  const [checkoutUpdating, setCheckoutUpdating] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const filterScrollRef = useRef<ScrollView>(null);
  const chipPositions = useRef<{ [key: string]: number }>({});
  const chipWidths = useRef<{ [key: string]: number }>({});

  const fetchData = useCallback(() => {
    const isLandlord = userData?.user_type === 'landlord';
    const propertyId = isLandlord
      ? selectedPropertyId || userData?.assigned_pg_ids
      : userData?.assigned_pg_ids;
    // Map active status filter: null = fetch all, 'active' = 1, 'inactive' = 0
    const activeStatus =
      activeStatusFilter === null
        ? null // Pass null to fetch all
        : activeStatusFilter === 'active'
        ? 1
        : 0;
    dispatch(
      fetchLandlordEnquiries({
        company_id: userData?.company_id,
        landlord_id: userData?.user_id,
        user_type: userData?.user_type,
        property_id: propertyId,
        active_status: activeStatus !== null ? activeStatus : 1, // Default to 1 if null for API compatibility
      }),
    );
  }, [dispatch, userData, selectedPropertyId, activeStatusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isFocused, selectedPropertyId, activeStatusFilter]);

  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      const isLandlord = userData?.user_type === 'landlord';
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
      // Only fetch PG list for landlords (needed for filter)
      if (isLandlord) {
        dispatch(
          fetchMyPgList({
            company_id: userData.company_id,
            landlord_id: userData.user_id,
            user_type: userData.user_type,
            property_id: userData.assigned_pg_ids,
          }),
        );
      }
    }
  }, [isFocused, dispatch, userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    const isLandlord = userData?.user_type === 'landlord';
    const refreshPromises = [
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
    ];
    // Only fetch PG list for landlords
    if (isLandlord) {
      refreshPromises.push(
        dispatch(
          fetchMyPgList({
            company_id: userData?.company_id,
            landlord_id: userData?.user_id,
            user_type: userData?.user_type,
            property_id: userData?.assigned_pg_ids,
          }),
        ),
      );
    }
    await Promise.all(refreshPromises);
    setRefreshing(false);
  };

  const handleFilterSelect = (propertyId: string | null) => {
    setSelectedPropertyId(propertyId);
    // Scroll to selected chip to make it fully visible
    setTimeout(() => {
      if (propertyId === null) {
        // Scroll to "All" chip (first chip)
        filterScrollRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        // Get stored position and width for this chip
        const chipX = chipPositions.current[propertyId];
        const chipWidth = chipWidths.current[propertyId] || 120; // Fallback width
        if (chipX !== undefined && filterScrollRef.current) {
          const screenWidth = Dimensions.get('window').width;
          const padding = 12;
          const chipRightEdge = chipX + chipWidth;
          // Check if this is the last chip
          const isLastChip =
            pgListSimple &&
            pgListSimple.length > 0 &&
            pgListSimple[pgListSimple.length - 1]?.property_id === propertyId;

          if (isLastChip) {
            const scrollX = Math.max(0, chipRightEdge - screenWidth + padding);
            filterScrollRef.current.scrollTo({
              x: scrollX,
              animated: true,
            });
          } else {
            let scrollX = chipX - padding;
            // If chip would be cut off on the right, adjust scroll position
            if (chipRightEdge > screenWidth - padding) {
              // Scroll to show chip fully with padding on both sides
              scrollX = chipX - (screenWidth - chipWidth - padding * 2);
            }
            // Ensure we don't scroll to negative position
            scrollX = Math.max(0, scrollX);
            filterScrollRef.current.scrollTo({
              x: scrollX,
              animated: true,
            });
          }
        }
      }
    }, 50);
  };

  const enquiriesList = filterEnquiries(pgEnquiries, {
    enquiryStatusFilter,
    activeStatusFilter,
    checkoutStatusFilter,
  });

  // Count all active filters (including defaults)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (enquiryStatusFilter) count += 1;
    if (activeStatusFilter) count += 1;
    if (checkoutStatusFilter) count += 1;
    return count;
  };

  const renderHeaderAction = () => {
    const activeCount = getActiveFiltersCount();
    return (
      <View style={styles.filterIconWrapper}>
        <TouchableOpacity
          style={[
            styles.filterIconButton,
            {
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: 'rgba(15,23,42,0.18)',
            },
          ]}
          onPress={() => setShowFiltersModal(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="tune" size={20} color={colors.white} />
          {activeCount > 0 && (
            <View style={styles.filterBadge}>
              <Typography
                variant="caption"
                weight="bold"
                style={styles.filterBadgeText}
              >
                {activeCount}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderStatusBadge = (status: string) => {
    const palette =
      status === 'Pending'
        ? { bg: '#FFF4E0', text: '#B26A00' }
        : status === 'Accepted'
        ? { bg: '#E3F4E8', text: '#1B5E20' }
        : { bg: '#FCE4EC', text: '#C62828' };

    return (
      <View style={[styles.badge, { backgroundColor: palette.bg }]}>
        <Typography variant="caption" weight="medium" color={palette.text}>
          {status}
        </Typography>
      </View>
    );
  };

  const renderPaymentStatusBadge = (status: string) => {
    const palette =
      status === 'Active'
        ? { bg: '#E3F4E8', text: '#1B5E20' }
        : status === 'Pending'
        ? { bg: '#FFF4E0', text: '#B26A00' }
        : { bg: '#FCE4EC', text: '#C62828' };

    return (
      <View style={[styles.badge, { backgroundColor: palette.bg }]}>
        <Typography variant="caption" weight="medium" color={palette.text}>
          {status}
        </Typography>
      </View>
    );
  };
  const handleAccessDenied = (message: string) => {
    setAccessMessage(message);
    setShowAccessDenied(true);
  };

  const handleInactivePress = (item: any) => {
    setSelectedEnquiry(item);
    setShowInactiveModal(true);
  };

  const handleConfirmInactive = async () => {
    if (!selectedEnquiry) return;
    setInactivating(true);
    try {
      const payload = {
        company_id: userData?.company_id,
        id: selectedEnquiry?.enquiry_id,
        status: 0, // 0 = inactive, 1 = active
        type: 'enquiry',
      };
      const res = await dispatch(activeInactiveStatus(payload)).unwrap();
      appLog('LandlordEnquiryScreen', 'activeInactiveStatus', res);
      setShowInactiveModal(false);
      setSelectedEnquiry(null);
      showSuccessMsg(res?.message || 'Enquiry inactivated successfully.');
      // Refresh the enquiries list
      fetchData();
    } catch (error: any) {
      showErrorMsg(error?.message || 'Failed to inactivate enquiry.');
    } finally {
      setInactivating(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const enquiryStatus = mapEnquiryStatusLabel(item?.status);

    const checkout = item?.checkout_data;
    const hasCheckout =
      checkout && Object.keys(checkout).length > 0 ? true : false;

    const checkoutStatus =
      checkout?.status === 'approved'
        ? 'approved'
        : checkout?.status === 'rejected'
        ? 'rejected'
        : 'pending';

    const canActOnCheckout =
      hasCheckout &&
      checkoutStatus === 'pending' &&
      !checkoutUpdating; /* disable while updating */

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Typography variant="body" weight="bold" style={styles.nameText}>
              {item?.name || 'N/A'}
            </Typography>
            <TouchableOpacity
              style={styles.metaRow}
              activeOpacity={0.8}
              onPress={() => {
                Linking.openURL(`tel:${item?.user_mobile}`);
              }}
            >
              <FontAwesome name="phone" size={14} color={colors.mainColor} />
              <Typography variant="label" style={styles.metaText}>
                {item?.mobile || '-'}
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.statusStack}>
            {[
              {
                label: 'Enquiry Status',
                badge: renderStatusBadge(enquiryStatus),
              },
              {
                label: 'Payment Status',
                badge: renderPaymentStatusBadge(item.payment_status_text),
              },
            ].map(itemStatus => (
              <View key={itemStatus.label} style={styles.statusRow}>
                <Typography variant="caption" style={styles.statusLabel}>
                  {itemStatus.label}
                </Typography>
                {itemStatus.badge}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.dateRow}>
          {[
            {
              icon: 'login',
              label: 'Check In',
              value: item?.check_in_date || '-',
            },
            {
              icon: 'logout',
              label: 'Due Date',
              value: item?.check_out_date || '-',
            },
          ].map((dateItem, idx, arr) => (
            <View
              key={idx}
              style={[
                styles.dateItem,
                idx === arr.length - 1 && { marginRight: 0 },
              ]}
            >
              <MaterialIcons
                name={dateItem.icon}
                size={18}
                color={colors.mainColor}
                style={{ marginRight: 8 }}
              />
              <View>
                <Typography variant="caption" style={styles.dateLabel}>
                  {dateItem.label}
                </Typography>
                <Typography
                  variant="label"
                  weight="medium"
                  style={styles.dateValue}
                >
                  {dateItem.value}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        {/* Checkout Request (if any) */}
        {hasCheckout && (
          <View style={styles.checkoutCard}>
            <View style={styles.checkoutHeader}>
              <View style={styles.checkoutHeaderLeft}>
                <MaterialIcons
                  name="logout"
                  size={18}
                  color={colors.mainColor}
                />
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.checkoutTitle}
                >
                  Checkout Request
                </Typography>
              </View>
              <View
                style={[
                  styles.badge,
                  checkoutStatus === 'approved'
                    ? { backgroundColor: '#E3F4E8' }
                    : checkoutStatus === 'rejected'
                    ? { backgroundColor: '#FCE4EC' }
                    : { backgroundColor: '#FFF4E0' },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="medium"
                  color={
                    checkoutStatus === 'approved'
                      ? '#1B5E20'
                      : checkoutStatus === 'rejected'
                      ? '#C62828'
                      : '#B26A00'
                  }
                  style={{ textTransform: 'capitalize' }}
                >
                  {checkoutStatus}
                </Typography>
              </View>
            </View>

            <View style={styles.checkoutContent}>
              <View style={styles.checkoutRow}>
                <Typography variant="caption" style={styles.checkoutLabel}>
                  Checkout Date
                </Typography>
                <Typography variant="label" style={styles.checkoutValue}>
                  {checkout?.checkout_date || '-'}
                </Typography>
              </View>

              <View style={styles.checkoutRow}>
                <Typography variant="caption" style={styles.checkoutLabel}>
                  Reason
                </Typography>
                <Typography variant="label" style={styles.checkoutReason}>
                  {checkout?.checkout_reason || '-'}
                </Typography>
              </View>
            </View>

            {canActOnCheckout && (
              <View style={styles.checkoutActions}>
                <AppButton
                  title="Accept"
                  titleSize="caption"
                  titleColor="#0E9F6E"
                  onPress={async () => {
                    if (!userData) return;
                    try {
                      setCheckoutUpdating(true);
                      const checkoutId =
                        checkout?.id ||
                        checkout?.property_enquiry_id ||
                        item?.enquiry_id;
                      const payload = {
                        company_id: String(userData.company_id),
                        checkout_id: String(checkoutId),
                        status: 'approved' as const,
                        reject_reason: '',
                      };
                      const res = await dispatch(
                        updateCheckoutStatusApi(payload),
                      ).unwrap();
                      showSuccessMsg(
                        res?.message || 'Checkout request approved.',
                      );
                      fetchData();
                    } catch (error: any) {
                      showErrorMsg(
                        error?.message || 'Failed to accept checkout request.',
                      );
                    } finally {
                      setCheckoutUpdating(false);
                    }
                  }}
                  style={styles.checkoutAcceptBtn}
                  disabled={checkoutUpdating}
                />
                <AppButton
                  title="Reject"
                  titleSize="caption"
                  titleColor="#DC2626"
                  onPress={() => {
                    setSelectedCheckoutEnquiry(item);
                    setSelectedCheckoutData(checkout);
                    setRejectReason('');
                    setRejectReasonError('');
                    setShowRejectCheckoutModal(true);
                  }}
                  style={styles.checkoutRejectBtn}
                  disabled={checkoutUpdating}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.actionFooter}>
          <View style={styles.actionHeader}>
            <Typography variant="caption" style={styles.actionLabel}>
              Actions
            </Typography>
          </View>

          <View style={styles.actionButtons}>
            <AppButton
              title="View"
              titleIcon={
                <MaterialIcons name="visibility" size={16} color={'#5B8DEF'} />
              }
              onPress={() =>
                navigation.navigate(NAV_KEYS.LandlordViewEnquiryDetails, {
                  EnquiryId: item?.enquiry_id,
                  companyId: userData?.company_id,
                })
              }
              style={styles.viewBtn}
              titleSize="caption"
              titleColor={'#5B8DEF'}
            />
            <AppButton
              title="Payment Detail"
              titleIcon={
                <MaterialIcons name="payment" size={16} color={'#4CAF50'} />
              }
              onPress={() => {
                if (
                  hasPermission(
                    userData,
                    apiUserData,
                    'payment_details',
                    userAllPermissions,
                  )
                ) {
                  navigation.navigate(NAV_KEYS.LandlordPaymentHistory, {
                    EnquiryId: item?.enquiry_id || '',
                    companyId: userData?.company_id,
                  });
                } else {
                  handleAccessDenied(
                    'You do not have permission to view payment details.',
                  );
                }
              }}
              style={styles.paymentBtn}
              titleSize="caption"
              titleColor={'#4CAF50'}
            />
            <AppButton
              title="Inactive"
              titleIcon={
                <MaterialIcons name="block" size={16} color={'#FF9800'} />
              }
              onPress={() => handleInactivePress(item)}
              style={styles.inactiveBtn}
              titleSize="caption"
              titleColor={'#FF9800'}
            />
          </View>
        </View>
      </View>
    );
  };

  // appLog('LandlordEnquiryScreen','pgEnquiries',pgEnquiries)

  return (
    <View style={styles.container}>
      <AppHeader title="Enquiries" showBack rightIcon={renderHeaderAction()} />
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        {userData?.user_type === 'landlord' &&
          pgListSimple &&
          pgListSimple.length > 0 && (
            <View style={styles.filterRow}>
              <ScrollView
                ref={filterScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  onLayout={event => {
                    chipPositions.current['all'] = event.nativeEvent.layout.x;
                    chipWidths.current['all'] = event.nativeEvent.layout.width;
                  }}
                  style={[
                    styles.filterChip,
                    selectedPropertyId === null && styles.filterChipActive,
                  ]}
                  onPress={() => handleFilterSelect(null)}
                  activeOpacity={0.7}
                >
                  <Typography
                    variant="caption"
                    weight={selectedPropertyId === null ? 'bold' : 'medium'}
                    style={[
                      styles.filterText,
                      selectedPropertyId === null && styles.filterTextActive,
                    ]}
                  >
                    All
                  </Typography>
                </TouchableOpacity>
                {pgListSimple.map((pg: any) => (
                  <TouchableOpacity
                    key={pg.property_id}
                    onLayout={event => {
                      chipPositions.current[pg.property_id] =
                        event.nativeEvent.layout.x;
                      chipWidths.current[pg.property_id] =
                        event.nativeEvent.layout.width;
                    }}
                    style={[
                      styles.filterChip,
                      selectedPropertyId === pg.property_id &&
                        styles.filterChipActive,
                    ]}
                    onPress={() => handleFilterSelect(pg.property_id)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="caption"
                      weight={
                        selectedPropertyId === pg.property_id
                          ? 'bold'
                          : 'medium'
                      }
                      style={[
                        styles.filterText,
                        selectedPropertyId === pg.property_id &&
                          styles.filterTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {pg.title}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
      </View>
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
            Loading enquiries...
          </Typography>
        </View>
      ) : apiUserData?.data?.user_permissions &&
        !hasPermission(userData, apiUserData, 'enquiry', userAllPermissions) ? (
        <AccessDeniedScreenView
          message="Your account doesn't have access to view enquiries."
          onBackPress={() => navigation.goBack()}
        />
      ) : (
        //Enquiries List
        <View style={{ flex: 1 }}>
          <FlatList
            data={enquiriesList}
            keyExtractor={(item: any, i) =>
              item.enquiry_id?.toString() || i.toString()
            }
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              {
                justifyContent:
                  enquiriesList.length === 0 ? 'center' : 'flex-start',
              },
            ]}
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
                <Typography
                  weight="medium"
                  style={styles.emptyText}
                  color="#999"
                >
                  No enquiries found
                </Typography>
              </View>
            }
          />
        </View>
      )}

      <AccessDeniedModal
        visible={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        message={accessMessage}
      />

      <InactiveModal
        visible={showInactiveModal}
        userName={selectedEnquiry?.name || 'this user'}
        onCancel={() => {
          setShowInactiveModal(false);
          setSelectedEnquiry(null);
        }}
        onConfirm={handleConfirmInactive}
        loading={inactivating}
      />
      {/* Filters Bottom Sheet Modal */}
      <FiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        enquiryStatus={enquiryStatusFilter}
        onChangeEnquiryStatus={setEnquiryStatusFilter}
        activeStatus={activeStatusFilter}
        onChangeActiveStatus={setActiveStatusFilter}
        checkoutStatus={checkoutStatusFilter}
        onChangeCheckoutStatus={setCheckoutStatusFilter}
        onReset={() => {
          setEnquiryStatusFilter('pending');
          setActiveStatusFilter('active');
          setCheckoutStatusFilter(null);
        }}
        onApply={() => {
          // Filters are already applied via state; nothing extra needed
        }}
      />
      {/* Reject Checkout Modal */}
      <Modal
        visible={showRejectCheckoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectCheckoutModal(false)}
      >
        <View style={styles.rejectModalOverlay}>
          <View style={styles.rejectModalCard}>
            <Typography
              variant="body"
              weight="bold"
              style={styles.rejectModalTitle}
            >
              Reject Checkout Request
            </Typography>

            <Typography variant="caption" style={styles.rejectModalSubtitle}>
              {selectedCheckoutEnquiry?.name
                ? `Tenant: ${selectedCheckoutEnquiry.name}`
                : ''}
            </Typography>

            <View style={styles.rejectModalInfoRow}>
              <Typography variant="caption" style={styles.rejectModalInfoLabel}>
                Checkout Date
              </Typography>
              <Typography variant="label" style={styles.rejectModalInfoValue}>
                {selectedCheckoutData?.checkout_date || '-'}
              </Typography>
            </View>

            <View style={styles.rejectModalInfoRow}>
              <Typography variant="caption" style={styles.rejectModalInfoLabel}>
                Reason
              </Typography>
              <Typography variant="label" style={styles.rejectModalInfoValue}>
                {selectedCheckoutData?.checkout_reason || '-'}
              </Typography>
            </View>

            <AppTextInput
              label="Reject Reason"
              multiline
              inputHeight={90}
              value={rejectReason}
              onChangeText={text => {
                setRejectReason(text);
                if (rejectReasonError) setRejectReasonError('');
              }}
              error={rejectReasonError}
              placeholder="Please provide a reason for rejecting this checkout request..."
              containerStyle={{ marginBottom: 30 }}
            />

            <View style={styles.rejectModalActions}>
              <AppButton
                title="Cancel"
                titleSize="caption"
                titleColor={colors.mainColor}
                style={styles.rejectCancelBtn}
                onPress={() => {
                  setShowRejectCheckoutModal(false);
                  setSelectedCheckoutEnquiry(null);
                  setSelectedCheckoutData(null);
                  setRejectReason('');
                  setRejectReasonError('');
                }}
                disabled={checkoutUpdating}
              />
              <AppButton
                title="Submit"
                titleSize="caption"
                loading={checkoutUpdating}
                style={styles.rejectSubmitBtn}
                onPress={async () => {
                  if (!userData || !selectedCheckoutData) return;
                  if (!rejectReason.trim()) {
                    setRejectReasonError('Reject reason is required');
                    return;
                  }
                  try {
                    setCheckoutUpdating(true);
                    const checkoutId =
                      selectedCheckoutData.id ||
                      selectedCheckoutData.property_enquiry_id ||
                      selectedCheckoutEnquiry?.enquiry_id;
                    const payload = {
                      company_id: String(userData.company_id),
                      checkout_id: String(checkoutId),
                      status: 'rejected' as const,
                      reject_reason: rejectReason.trim(),
                    };
                    const res = await dispatch(
                      updateCheckoutStatusApi(payload),
                    ).unwrap();
                    showSuccessMsg(
                      res?.message || 'Checkout request rejected.',
                    );
                    setShowRejectCheckoutModal(false);
                    setSelectedCheckoutEnquiry(null);
                    setSelectedCheckoutData(null);
                    setRejectReason('');
                    setRejectReasonError('');
                    fetchData();
                  } catch (error: any) {
                    showErrorMsg(
                      error?.message ||
                        'Failed to reject checkout request. Please try again.',
                    );
                  } finally {
                    setCheckoutUpdating(false);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LandlordEnquiryScreen;
