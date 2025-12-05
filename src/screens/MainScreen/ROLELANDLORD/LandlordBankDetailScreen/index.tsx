import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '../../../../ui/AppHeader';
import { AppDispatch, RootState } from '../../../../store';
import AppButton from '../../../../ui/AppButton';
import Typography from '../../../../ui/Typography';
import DeleteModal from '../../../../ui/DeleteModal';
import styles from './styles';
import colors from '../../../../constants/colors';
import {
  addEditBankDetails,
  deleteBankDetail,
  fetchBankDetails,
  fetchMyPgList,
} from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import AppImage from '../../../../ui/AppImage';
import Feather from 'react-native-vector-icons/Feather';

const initialFormState = {
  bank_id: '',
  pg_id: [] as string[] | string, // Can be array or comma-separated string
  bank_name: '',
  account_holder_name: '',
  account_number: '',
  ifsc_code: '',
  branch_name: '',
  status: '1',
  upi_id: '',
  qr_code: null as any,
};

const statusOptions = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '0' },
];

const LandlordBankDetailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { bankDetails, loading, myPgList } = useSelector(
    (state: RootState) => state.main,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>(
    {},
  );

  const pgOptions = useMemo(() => {
    const list = (myPgList as any)?.data || [];
    if (!Array.isArray(list)) {
      return [];
    }
    return list.map((item: any) => ({
      label: `${item?.property_code || ''} - ${item?.title || ''}`.trim(),
      value: item?.property_id?.toString() || '',
    }));
  }, [myPgList]);

  const getBankId = (bank: any) =>
    bank?.bank_id?.toString() || bank?.id?.toString() || '';

  const resolveImageUri = (uri?: string) => {
    if (!uri) {
      return '';
    }
    if (
      uri.startsWith('http://') ||
      uri.startsWith('https://') ||
      uri.startsWith('file://')
    ) {
      return uri;
    }
    const cleanPath = uri.startsWith('/') ? uri.slice(1) : uri;
    return `https://domain.webroomer.com/${cleanPath}`;
  };

  const fetchData = () => {
    if (userData?.company_id && userData?.user_id) {
      dispatch(
        fetchBankDetails({
          company_id: userData.company_id,
          user_id: userData.user_id,
        }),
      );
      dispatch(
        fetchMyPgList({
          company_id: userData.company_id,
          landlord_id: userData.user_id,
          user_type: userData?.user_type || 'landlord',
          property_id: userData?.assigned_pg_ids,
        }),
      );
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const closeForm = () => {
    setForm(initialFormState);
    setErrors({});
    setFormVisible(false);
    setSubmitting(false);
    setIsEditMode(false);
    setPreviewImage('');
    setPreviewVisible(false);
  };

  const openAddForm = () => {
    setForm(initialFormState);
    setErrors({});
    setFormVisible(true);
    setIsEditMode(false);
    setPreviewImage('');
    setPreviewVisible(false);
  };

  const openEditForm = (item: any) => {
    // Handle pg_id - could be comma-separated string or single value
    let pgIdValue = item?.pg_id?.toString() || '';
    // Convert to array for the dropdown (it expects array format)
    const pgIdArray = pgIdValue
      ? pgIdValue
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id)
      : [];

    setForm({
      bank_id: getBankId(item),
      pg_id: pgIdArray, // Store as array for the dropdown
      bank_name: item?.bank_name || '',
      account_holder_name: item?.account_holder_name || '',
      account_number: item?.account_number || '',
      ifsc_code: item?.ifsc_code || '',
      branch_name: item?.branch_name || '',
      status: item?.status?.toString() || '1',
      upi_id: item?.upi_id || '',
      qr_code: item?.qr_code || null,
    });
    setErrors({});
    setFormVisible(true);
    setIsEditMode(true);
    setPreviewImage('');
    setPreviewVisible(false);
  };

  const openDeleteModal = (item: any) => {
    setSelectedBank(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedBank || !userData?.company_id || !userData?.user_id) {
      setDeleteModalVisible(false);
      return;
    }
    try {
      setDeleting(true);
      const payload = {
        bank_id: getBankId(selectedBank),
        user_id: userData.user_id,
        company_id: userData.company_id,
      };
      const response: any = await dispatch(deleteBankDetail(payload)).unwrap();
      if (response?.success) {
        showSuccessMsg(
          response?.message || 'Bank detail deleted successfully.',
        );
        fetchData();
        setDeleteModalVisible(false);
      } else {
        showErrorMsg(response?.message || 'Failed to delete bank detail');
      }
    } catch (error: any) {
      showErrorMsg(error?.message || 'Something went wrong.');
    } finally {
      setDeleting(false);
    }
  };

  const validateForm = () => {
    const temp: Record<string, string> = {};
    // Check if pg_id has at least one value (array or comma-separated string)
    const pgIdArray = Array.isArray(form.pg_id)
      ? form.pg_id
      : form.pg_id
      ? form.pg_id
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id)
      : [];
    if (pgIdArray.length === 0) temp.pg_id = 'Please select at least one PG';
    if (!form.bank_name) temp.bank_name = 'Bank name is required';
    if (!form.account_holder_name)
      temp.account_holder_name = 'Account holder name is required';
    if (!form.account_number)
      temp.account_number = 'Account number is required';
    if (!form.ifsc_code) temp.ifsc_code = 'IFSC code is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userData?.company_id || !userData?.user_id) {
      return;
    }
    try {
      setSubmitting(true);
      // Convert selected PG IDs array to comma-separated string
      const pgIdString = Array.isArray(form.pg_id)
        ? form.pg_id.join(',')
        : form.pg_id;

      const payload: any = {
        user_id: userData.user_id,
        company_id: userData.company_id,
        pg_id: pgIdString, // Send as comma-separated string
        bank_name: form.bank_name,
        account_holder_name: form.account_holder_name,
        account_number: form.account_number,
        ifsc_code: form.ifsc_code,
        branch_name: form.branch_name,
        status: form.status,
        upi_id: form.upi_id,
        ...(isEditMode && { bank_id: form.bank_id }),
      };

      if (form.qr_code) {
        if (typeof form.qr_code === 'object' && form.qr_code.uri) {
          payload.qr_code = {
            uri: form.qr_code.uri,
            type: form.qr_code.type || 'image/jpeg',
            name: form.qr_code.name || 'qr-code.jpg',
          };
        } else if (typeof form.qr_code === 'string') {
          payload.qr_code = form.qr_code;
        }
      }
      const response: any = await dispatch(
        addEditBankDetails(payload),
      ).unwrap();
      if (response?.success) {
        showSuccessMsg(response?.message || 'Bank detail saved successfully.');
        closeForm();
        fetchData();
      } else {
        showErrorMsg(response?.message || 'Failed to save bank detail.');
        closeForm();
        setSubmitting(false);
      }
    } catch (error: any) {
      showErrorMsg(error?.message || 'Something went wrong.');
      setSubmitting(false);
    }
  };

  const renderBankCard = ({ item, index }: { item: any; index: number }) => {
    const statusLabel = item?.status === '1' ? 'Active' : 'Inactive';
    const statusColor =
      item?.status === '1' ? colors.succes : colors.pending || '#FDBA74';

    // Get PG details - could be array or single object
    const pgDetails = item?.pg_details || [];
    const hasMultiplePGs = Array.isArray(pgDetails) && pgDetails.length > 0;

    return (
      <View style={styles.card}>
        <View style={styles.infoGrid}>
          {(() => {
            const infoItems = [
              {
                icon: 'credit-card',
                label: 'Bank',
                value: item?.bank_name || '--',
              },
              {
                icon: 'user',
                label: 'Account Holder',
                value: item?.account_holder_name || '--',
              },
              {
                icon: 'hash',
                label: 'Account Number',
                value: item?.account_number || '--',
              },
              {
                icon: 'map-pin',
                label: 'Branch',
                value: item?.branch_name || '--',
              },
              {
                icon: 'tag',
                label: 'IFSC',
                value: item?.ifsc_code || '--',
              },
              {
                icon: 'smartphone',
                label: 'UPI ID',
                value: item?.upi_id || '--',
              },
            ];
            const rows = [];
            for (let i = 0; i < infoItems.length; i += 2) {
              rows.push(infoItems.slice(i, i + 2));
            }
            return rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.infoRowGroup}>
                {row.map(info => (
                  <View key={info.label} style={styles.infoCell}>
                    <View style={styles.infoIcon}>
                      <Feather
                        name={info.icon}
                        size={12}
                        color={colors.mainColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Typography variant="caption" style={styles.infoLabel}>
                        {info.label}
                      </Typography>
                      <Typography
                        weight="medium"
                        variant="caption"
                        style={styles.infoValue}
                      >
                        {info.value}
                      </Typography>
                    </View>
                  </View>
                ))}
                {row.length === 1 && <View style={styles.infoCellSpacer} />}
              </View>
            ));
          })()}
        </View>

        {item?.qr_code ? (
          <>
            <Typography variant="caption" style={styles.infoLabel}>
              QR Code Image
            </Typography>
            <TouchableOpacity
              style={styles.qrPreviewBox}
              activeOpacity={0.8}
              onPress={() => {
                const uri =
                  typeof item.qr_code === 'string'
                    ? resolveImageUri(item.qr_code)
                    : resolveImageUri(item.qr_code?.uri);
                if (uri) {
                  setPreviewImage(uri);
                  setPreviewVisible(true);
                }
              }}
            >
              <AppImage
                source={{
                  uri:
                    typeof item.qr_code === 'string'
                      ? resolveImageUri(item.qr_code)
                      : resolveImageUri(item.qr_code?.uri),
                }}
                style={styles.qrImage}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </>
        ) : null}

        {/* //Assigned PGs Here */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginTop: 5 }}>
            {hasMultiplePGs ? (
              <>
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.cardTitle}
                >
                  {pgDetails.length} PG{pgDetails.length > 1 ? 's' : ''}{' '}
                  Assigned
                </Typography>
                <View style={{ marginTop: 2 }}>
                  {(() => {
                    const bankId = getBankId(item);
                    const isExpanded = expandedBanks[bankId] || false;
                    const shouldShowSeeMore = pgDetails.length > 2;
                    const pgsToShow =
                      shouldShowSeeMore && !isExpanded
                        ? pgDetails.slice(0, 2)
                        : pgDetails;

                    return (
                      <>
                        {pgsToShow.map((pg: any, idx: number) => {
                          const isLastItem = idx === pgsToShow.length - 1;
                          const showToggle = shouldShowSeeMore && isLastItem;

                          return (
                            <View
                              key={pg?.pg_id || idx}
                              style={[
                                {
                                  marginBottom:
                                    idx < pgsToShow.length - 1 ? 4 : 0,
                                },
                                showToggle && {
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                },
                              ]}
                            >
                              <Typography
                                variant="caption"
                                style={styles.cardSubtitle}
                              >
                                {pg?.pg_name || 'PG Name'} (
                                {pg?.pg_code || '--'})
                              </Typography>
                              {showToggle && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setExpandedBanks(prev => ({
                                      ...prev,
                                      [bankId]: !isExpanded,
                                    }));
                                  }}
                                  style={{ marginLeft: 0 }}
                                >
                                  <Typography
                                    variant="caption"
                                    weight="bold"
                                    style={styles.seeMoreText}
                                  >
                                    ...{isExpanded ? 'Hide' : 'See More'}
                                  </Typography>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </>
                    );
                  })()}
                </View>
              </>
            ) : (
              <>
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.cardTitle}
                >
                  {item?.pg_name || 'PG Name'}
                </Typography>
                <Typography variant="caption" style={styles.cardSubtitle}>
                  Code: {item?.pg_code || '--'}
                </Typography>
              </>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}20` },
            ]}
          >
            <Typography
              variant="caption"
              weight="medium"
              style={[styles.statusText, { color: statusColor }]}
            >
              {statusLabel}
            </Typography>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.softButton, styles.editButton]}
            onPress={() => openEditForm(item)}
          >
            <Typography style={[styles.softButtonText, styles.editButtonText]}>
              Edit
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.softButton, styles.deleteButton]}
            onPress={() => openDeleteModal(item)}
          >
            <Typography
              style={[styles.softButtonText, styles.deleteButtonText]}
            >
              Delete
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeaderAction = () => (
    <View style={styles.headerActionWrapper}>
      <AppButton
        title="+ Add Bank"
        titleSize="label"
        onPress={openAddForm}
        style={styles.headerActionBtn}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Bank Details"
        showBack
        rightIcon={renderHeaderAction()}
      />

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <FlatList
          data={bankDetails || []}
          renderItem={renderBankCard}
          keyExtractor={(item, idx) => getBankId(item) || idx.toString()}
          contentContainerStyle={[
            styles.listContent,
            (bankDetails || []).length === 0 && styles.emptyListContainer,
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
            <View style={styles.emptyState}>
              <Typography weight="medium" color={colors.gray}>
                No bank details found.
              </Typography>
            </View>
          }
        />
      )}

      <Modal
        visible={formVisible}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Typography variant="subheading" weight="bold">
                {isEditMode ? 'Edit Bank Detail' : 'Add Bank Detail'}
              </Typography>
              <TouchableOpacity onPress={closeForm} hitSlop={20}>
                <Typography variant="body" weight="bold">
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={24}
            >
              <AppCustomDropdown
                label="Assign PG *"
                data={pgOptions}
                selectedValues={
                  Array.isArray(form.pg_id)
                    ? form.pg_id
                    : form.pg_id
                    ? form.pg_id
                        .split(',')
                        .map((id: string) => id.trim())
                        .filter((id: string) => id)
                    : []
                }
                onSelect={value => {
                  // value is an array of selected IDs
                  const selectedIds = Array.isArray(value) ? value : [];
                  setForm(prev => ({ ...prev, pg_id: selectedIds }));
                }}
                placeholder="Select PG"
                error={errors.pg_id}
                multiSelect={true}
              />
              <AppTextInput
                label="Bank Name *"
                value={form.bank_name}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, bank_name: text }))
                }
                error={errors.bank_name}
                placeholder="Enter bank name"
              />
              <AppTextInput
                label="Account Holder *"
                value={form.account_holder_name}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, account_holder_name: text }))
                }
                error={errors.account_holder_name}
                placeholder="Enter holder name"
              />
              <AppTextInput
                label="Account Number *"
                value={form.account_number}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, account_number: text }))
                }
                error={errors.account_number}
                keyboardType="number-pad"
                placeholder="Enter account number"
              />
              <AppTextInput
                label="IFSC Code *"
                value={form.ifsc_code}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, ifsc_code: text.toUpperCase() }))
                }
                error={errors.ifsc_code}
                placeholder="Enter IFSC code"
                autoCapitalize="characters"
              />
              <AppTextInput
                label="Branch"
                value={form.branch_name}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, branch_name: text }))
                }
                placeholder="Enter branch name"
              />
              <AppTextInput
                label="UPI ID"
                value={form.upi_id}
                onChangeText={text =>
                  setForm(prev => ({ ...prev, upi_id: text }))
                }
                placeholder="Enter UPI ID"
              />
              <ImagePickerInput
                label="QR Image"
                value={form.qr_code}
                onSelect={files =>
                  setForm(prev => ({ ...prev, qr_code: files?.[0] || null }))
                }
                onPreview={uri => {
                  const resolved = resolveImageUri(uri);
                  if (resolved) {
                    setPreviewImage(resolved);
                    setPreviewVisible(true);
                  }
                }}
              />
              <AppCustomDropdown
                label="Status"
                data={statusOptions}
                selectedValues={[form.status]}
                onSelect={value =>
                  setForm(prev => ({ ...prev, status: value?.[0] || '1' }))
                }
              />
              <AppButton
                title={isEditMode ? 'Update' : 'Add'}
                onPress={handleSubmit}
                loading={submitting}
                style={styles.submitButton}
              />
            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewCard}>
            <AppImage
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
            <AppButton
              title="Close"
              onPress={() => setPreviewVisible(false)}
              style={styles.previewCloseButton}
            />
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Bank Detail?"
        subtitle="Are you sure you want to delete this bank detail?"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </View>
  );
};

export default LandlordBankDetailScreen;
