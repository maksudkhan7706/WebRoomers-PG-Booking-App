import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import styles from './styles';
import colors from '../../../../constants/colors';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchTenants,
  fetchMyPgList,
  apiUserDataFetch,
} from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { RootStackParamList } from '../../../../navigation/NavKeys';
import { NAV_KEYS } from '../../../../navigation/NavKeys';

type TenantsNavProp = NativeStackNavigationProp<RootStackParamList>;

interface TenantItem {
  user_fullname?: string;
  father_name?: string;
  user_email?: string;
  user_mobile?: string;
  gender?: string;
  property_code?: string;
  pg_id?: string;
  check_in_date?: string;
  check_out_date?: string;
  user_status?: string;
  property_enquiry_id?: string;
  user_id?: string;
}

const TenantsScreen = () => {
  const navigation = useNavigation<TenantsNavProp>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { tenantList, loading, pgListSimple } = useSelector(
    (state: RootState) => state.main,
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const filterScrollRef = useRef<ScrollView>(null);
  const chipPositions = useRef<{ [key: string]: number }>({});
  const chipWidths = useRef<{ [key: string]: number }>({});

  const fetchData = useCallback(() => {
    if (userData?.company_id && userData?.user_id) {
      const isLandlord = userData?.user_type === 'landlord';
      // For non-landlord users, use assigned_pg_ids; for landlords, use selectedPropertyId or assigned_pg_ids
      const propertyId = isLandlord
        ? selectedPropertyId || userData?.assigned_pg_ids
        : userData?.assigned_pg_ids;
      const payload = {
        user_id: userData?.user_id,
        user_type: userData?.user_type || 'landlord',
        company_id: userData?.company_id,
        property_id: propertyId,
      };
      dispatch(fetchTenants(payload));
    }
  }, [dispatch, userData, selectedPropertyId]);

  useEffect(() => {
    if (userData?.company_id && userData?.user_id && isFocused) {
      const isLandlord = userData?.user_type === 'landlord';
      dispatch(
        apiUserDataFetch({
          user_id: userData.user_id,
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
      fetchData();
    }
  }, [dispatch, userData, isFocused, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedPropertyId]);

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

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
          // Get screen width to calculate optimal scroll position
          const screenWidth = Dimensions.get('window').width;
          const padding = 12; // Padding to ensure chip is fully visible

          // Calculate chip's right edge
          const chipRightEdge = chipX + chipWidth;

          // Check if this is the last chip
          const isLastChip =
            pgListSimple &&
            pgListSimple.length > 0 &&
            pgListSimple[pgListSimple.length - 1]?.property_id === propertyId;

          if (isLastChip) {
            // For the last chip, ensure it's fully visible by scrolling to show its right edge
            const scrollX = Math.max(0, chipRightEdge - screenWidth + padding);
            filterScrollRef.current.scrollTo({
              x: scrollX,
              animated: true,
            });
          } else {
            // For other chips, center them or show with padding
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

  const handleOpenModal = (tenant: TenantItem) => {
    setSelectedTenant(tenant);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedTenant(null);
    });
  };

  const renderHeaderAction = () => (
    <View style={styles.headerActionWrapper}>
      <AppButton
        title="+ Add New"
        titleSize="label"
        onPress={() => {
          navigation.navigate(NAV_KEYS.AddNewTenantScreen);
        }}
        style={styles.headerActionBtn}
      />
    </View>
  );

  const renderRow = (
    label: string,
    value: string,
    color?: string,
    isLast?: boolean,
  ) => (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <Typography variant="label" style={styles.detailLabel}>
        {label}
      </Typography>
      <Typography
        variant="body"
        weight="medium"
        style={[styles.detailValue, color ? { color } : null]}
        numberOfLines={1}
      >
        {value}
      </Typography>
    </View>
  );

  const renderItem = ({ item }: { item: TenantItem }) => {
    const status = item.user_status === '1' ? 'Active' : 'Inactive';
    const statusColor = status === 'Active' ? colors.succes : colors.red;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Typography
              variant="heading"
              weight="bold"
              style={styles.avatarText}
            >
              {item.user_fullname?.charAt(0)?.toUpperCase() || 'T'}
            </Typography>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Typography
              variant="subheading"
              weight="bold"
              style={styles.cardName}
            >
              {item.user_fullname || '-'}
            </Typography>
            <Typography variant="caption" style={styles.cardEmail}>
              {item.user_email || '-'}
            </Typography>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + '20' },
            ]}
          >
            <Typography
              variant="caption"
              weight="medium"
              style={[styles.statusText, { color: statusColor }]}
            >
              {status}
            </Typography>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardDetails}>
          <View style={styles.cardDetailItem}>
            <Feather name="phone" size={16} color={colors.gray} />
            <Typography variant="caption" style={styles.cardDetailText}>
              {item.user_mobile || '-'}
            </Typography>
          </View>
          <View style={styles.cardDetailItem}>
            <Feather name="home" size={16} color={colors.gray} />
            <Typography variant="caption" style={styles.cardDetailText}>
              {item.property_code || '-'}
            </Typography>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.seeDetailsButton}
            onPress={() => handleOpenModal(item)}
            activeOpacity={0.7}
          >
            <Typography
              variant="label"
              weight="medium"
              style={styles.seeDetailsText}
            >
              See Details
            </Typography>
            <Feather name="chevron-right" size={18} color={colors.mainColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.depositPaymentButton}
            onPress={() => {
              navigation.navigate(NAV_KEYS.LandlordTenantsPaymentScreen, {
                tenantData: item,
              });
            }}
            activeOpacity={0.7}
          >
            <Typography
              variant="label"
              weight="medium"
              style={styles.depositPaymentText}
            >
              Deposit Payment
            </Typography>
            <Typography variant="label" weight="bold" style={styles.rupeeSign}>
              ₹
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      <AppHeader showBack title="My Tenants" rightIcon={renderHeaderAction()} />

      {/* Filter Section - Only show for landlords */}
      {userData?.user_type === 'landlord' &&
        pgListSimple &&
        pgListSimple.length > 0 && (
          <View style={styles.filterContainer}>
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
                  variant="label"
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
                    variant="label"
                    weight={
                      selectedPropertyId === pg.property_id ? 'bold' : 'medium'
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <FlatList
          data={tenantList || []}
          keyExtractor={(item: TenantItem) =>
            item.property_enquiry_id?.toString() ||
            item.user_id?.toString() ||
            Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="users" size={64} color={colors.gray} />
              <Typography variant="body" style={styles.emptyText}>
                No tenants found.
              </Typography>
            </View>
          }
        />
      )}

      {/* Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: modalTranslateY }],
                  },
                ]}
              >
                <View style={styles.modalHeader}>
                  <Typography
                    variant="heading"
                    weight="bold"
                    style={styles.modalTitle}
                  >
                    Tenant Details
                  </Typography>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    hitSlop={15}
                    style={styles.closeButton}
                  >
                    <Feather name="x" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  {selectedTenant && (
                    <>
                      <View style={styles.modalAvatarContainer}>
                        <View style={styles.modalAvatar}>
                          <Typography
                            variant="heading"
                            weight="bold"
                            style={styles.modalAvatarText}
                          >
                            {selectedTenant.user_fullname
                              ?.charAt(0)
                              ?.toUpperCase() || 'T'}
                          </Typography>
                        </View>
                        <Typography
                          variant="subheading"
                          weight="bold"
                          style={styles.modalName}
                        >
                          {selectedTenant.user_fullname || '-'}
                        </Typography>
                        <View
                          style={[
                            styles.modalStatusBadge,
                            {
                              backgroundColor:
                                (selectedTenant.user_status === '1'
                                  ? 'Active'
                                  : 'Inactive') === 'Active'
                                  ? colors.succes + '20'
                                  : colors.red + '20',
                            },
                          ]}
                        >
                          <Typography
                            variant="caption"
                            weight="medium"
                            style={[
                              styles.modalStatusText,
                              {
                                color:
                                  (selectedTenant.user_status === '1'
                                    ? 'Active'
                                    : 'Inactive') === 'Active'
                                    ? colors.succes
                                    : colors.red,
                              },
                            ]}
                          >
                            {selectedTenant.user_status === '1'
                              ? 'Active'
                              : 'Inactive'}
                          </Typography>
                        </View>
                      </View>

                      <View style={styles.modalDetailsContainer}>
                        {renderRow(
                          'Full Name',
                          selectedTenant.user_fullname || '-',
                        )}
                        {renderRow(
                          'Father Name',
                          selectedTenant.father_name || '-',
                        )}
                        {renderRow('Email', selectedTenant.user_email || '-')}
                        {renderRow('Mobile', selectedTenant.user_mobile || '-')}
                        {renderRow('Gender', selectedTenant.gender || '-')}
                        {renderRow(
                          'PG Code',
                          selectedTenant.property_code || '-',
                        )}
                        {renderRow(
                          'Check-In Date',
                          selectedTenant.check_in_date || '-',
                        )}
                        {renderRow(
                          'Check-Out Date',
                          selectedTenant.check_out_date || '-',
                        )}
                      </View>
                    </>
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TenantsScreen;
