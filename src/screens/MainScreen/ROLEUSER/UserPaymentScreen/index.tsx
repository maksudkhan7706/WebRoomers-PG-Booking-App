import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  apiUserDataFetch,
  fetchBankDetails,
  payNow,
} from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import AppDatePicker from '../../../../ui/AppDatePicker';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import AppImage from '../../../../ui/AppImage';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';
import { downloadImage } from '../../../../utils/downloadImage';
import ClipboardModule from '@react-native-clipboard/clipboard';

type PaymentNavProp = NativeStackNavigationProp<RootStackParamList>;

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

const UserPaymentScreen = () => {
  const route = useRoute<any>();
  const {
    LandlordId,
    PgId,
    Amount,
    EnquiryId,
    PaymentStartDate,
    SecurityCharges,
    RoomRent,
    MaintainanceCharges,
    LandlordName,
    LandlordEmail,
    LandlordMobile,
  } = route.params || {};
  const navigation = useNavigation<PaymentNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { apiUserData, loading, bankDetails } = useSelector(
    (state: RootState) => state.main,
  );
  const [paymentMode, setPaymentMode] = useState<
    'upi' | 'bank' | 'cash' | null
  >(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [screenshot, setScreenshot] = useState<any>(null);
  const [errors, setErrors] = useState<{
    paymentMode?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [bankDataFetched, setBankDataFetched] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const userInfo = apiUserData?.data;
  const hasBankDetails =
    bankDetails &&
    !Array.isArray(bankDetails) &&
    Boolean((bankDetails as any)?.bank_name);

  const qrCodeUri = useMemo(() => {
    if (!hasBankDetails) {
      return '';
    }
    const qrCodeValue = (bankDetails as any)?.qr_code;
    if (!qrCodeValue) {
      return '';
    }
    if (typeof qrCodeValue === 'string') {
      return resolveImageUri(qrCodeValue);
    }
    if (typeof qrCodeValue === 'object' && qrCodeValue?.uri) {
      return resolveImageUri(qrCodeValue.uri);
    }
    return '';
  }, [bankDetails, hasBankDetails]);

  //Auto-fill dates from params if available
  useEffect(() => {
    if (PaymentStartDate) {
      const start = new Date(PaymentStartDate);
      setStartDate(start);
      // End date = start date + 30 days
      const nextMonthDate = new Date(start);
      nextMonthDate.setDate(nextMonthDate.getDate() + 30);
      setEndDate(nextMonthDate);
    }
  }, [PaymentStartDate]);

  useEffect(() => {
    if (isFocused) {
      setIsInitialLoad(true);
      setUserDataFetched(false);
      setBankDataFetched(false);
      // Fetch user data
      dispatch(
        apiUserDataFetch({
          user_id: userData?.user_id,
          company_id: userData?.company_id,
        }),
      )
        .unwrap()
        .then(() => {
          setUserDataFetched(true);
        })
        .catch(() => {
          setUserDataFetched(true); // Mark as fetched even on error
        });
      // Fetch bank details if we have required params
      if (PgId && LandlordId && userData?.company_id) {
        dispatch(
          fetchBankDetails({
            company_id: userData.company_id,
            pg_id: PgId,
            user_id: LandlordId,
          }),
        )
          .unwrap()
          .then(() => {
            setBankDataFetched(true);
          })
          .catch(() => {
            setBankDataFetched(true); // Mark as fetched even on error
          });
      } else {
        // If we don't have required params, mark bank data as fetched (won't fetch)
        setBankDataFetched(true);
      }
    }
  }, [isFocused, PgId, LandlordId, userData?.company_id, dispatch]);

  // Check if both API calls are complete
  useEffect(() => {
    if (userDataFetched && bankDataFetched && !loading) {
      setIsInitialLoad(false);
    }
  }, [userDataFetched, bankDataFetched, loading]);

  const isAadharPending =
    !userInfo?.aadhar_front ||
    !userInfo?.aadhar_back ||
    userInfo?.aadhar_front === '' ||
    userInfo?.aadhar_back === '';

  const isPolicePending =
    !userInfo?.police_verification || userInfo?.police_verification === '';

  const isReferencePending =
    !userInfo?.ref1_name ||
    !userInfo?.ref1_mobile ||
    !userInfo?.ref2_name ||
    !userInfo?.ref2_mobile ||
    userInfo?.ref1_name === '' ||
    userInfo?.ref1_mobile === '' ||
    userInfo?.ref2_name === '' ||
    userInfo?.ref2_mobile === '';

  const isVerificationPending =
    isAadharPending || isPolicePending || isReferencePending;

  const handleSubmit = async () => {
    // Validate payment mode
    if (!paymentMode) {
      return setErrors(prev => ({
        ...prev,
        paymentMode: 'Please select a payment mode',
      }));
    }
    if (!startDate)
      return setErrors(prev => ({
        ...prev,
        startDate: 'Start Date is required',
      }));
    if (!endDate)
      return setErrors(prev => ({ ...prev, endDate: 'End Date is required' }));

    // Screenshot is required for UPI and Bank, optional for Cash
    if (
      (paymentMode === 'upi' || paymentMode === 'bank') &&
      (!screenshot || screenshot.length === 0)
    ) {
      return Alert.alert('Please upload payment screenshot.');
    }

    const formData = new FormData();
    formData.append('company_id', String(userData?.company_id));
    formData.append('enquiry_id', String(EnquiryId));
    formData.append('start_date', startDate.toISOString().split('T')[0]);
    formData.append('end_date', endDate.toISOString().split('T')[0]);
    formData.append('amount', Amount);
    formData.append('payment_mode', paymentMode);
    formData.append('pay_by', String(userData?.user_id));
    // Handle screenshot based on payment mode
    if (paymentMode === 'cash') {
      // For cash mode, screenshot is optional - send empty string to indicate it's not required
      formData.append('payment_screenshot', '');
    } else {
      // For UPI and Bank modes, screenshot is required
      const image = Array.isArray(screenshot) ? screenshot[0] : screenshot;
      if (image?.uri) {
        formData.append('payment_screenshot', {
          uri: image.uri,
          name: image.fileName || image.name || 'payment.jpg',
          type: image.type || 'image/jpeg',
        });
      }
    }
    try {
      const res = await dispatch(payNow(formData)).unwrap();
      if (res?.success === false) {
        showErrorMsg(res?.message || 'Payment submission failed.');
        return;
      }
      showSuccessMsg(res?.message || 'Payment submitted successfully!');
      navigation.navigate('MainTabs', { screen: 'HomeScreen' });
    } catch (error: any) {
      // Handle API error response
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        'Something went wrong.';
      showErrorMsg(errorMessage);
    }
  };
  const handleCallOwner = () => {
    if (LandlordMobile) {
      Linking.openURL(`tel:${LandlordMobile}`).catch(() => null);
    }
  };

  const handleEmailOwner = () => {
    if (LandlordEmail) {
      Linking.openURL(`mailto:${LandlordEmail}`).catch(() => null);
    }
  };

  const handleCopyUPI = async () => {
    const upiId = (bankDetails as any)?.upi_id;
    if (upiId) {
      try {
        ClipboardModule.setString(upiId);
        showSuccessMsg('UPI ID copied to clipboard');
      } catch (error: any) {
        appLog('UserPaymentScreen', 'Copy UPI error:', error);
        // Fallback: Show Alert with UPI ID for manual copy
        Alert.alert('UPI ID', `UPI ID: ${upiId}\n\nTap and hold to copy`, [
          { text: 'OK', onPress: () => { } },
        ]);
      }
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCodeUri) {
      showErrorMsg('QR code not available');
      return;
    }

    try {
      await downloadImage({
        url: qrCodeUri,
        fileName: `QRCode_${Date.now()}.png`,
        successMessage: 'QR code downloaded successfully',
        errorMessage: 'Failed to download QR code',
      });
    } catch (error: any) {
      appLog('UserPaymentScreen', 'Download QR error:', error);
      // Error is already handled in downloadImage utility
    }
  };

  // Show loader until both API calls are complete
  const isLoading =
    isInitialLoad || loading || !userDataFetched || !bankDataFetched;

  return (
    <View style={styles.container}>
      <AppHeader title="Payment" showBack />
      {isLoading ? (
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView
          style={styles.listContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {isVerificationPending ? (
            // ⚠️ Verification Pending Card
            <View style={styles.warningBox}>
              <Typography
                weight="medium"
                variant="body"
                style={styles.warningTitle}
              >
                ⚠️ Verification Pending
              </Typography>
              <Typography variant="label" style={styles.warningDesc}>
                Before booking a PG, please complete the following details to
                verify your identity:
              </Typography>
              <View style={styles.rowItem}>
                <FontAwesome
                  name={isAadharPending ? 'times-circle' : 'check-circle'}
                  size={18}
                  color={isAadharPending ? '#dc3545' : '#28a745'}
                  style={styles.icon}
                />
                <Typography variant="label">Aadhar Card Details</Typography>
              </View>
              <View style={styles.rowItem}>
                <FontAwesome
                  name={isPolicePending ? 'times-circle' : 'check-circle'}
                  size={18}
                  color={isPolicePending ? '#dc3545' : '#28a745'}
                  style={styles.icon}
                />
                <Typography variant="label">Police Verification</Typography>
              </View>
              <View style={styles.rowItem}>
                <FontAwesome
                  name={isReferencePending ? 'times-circle' : 'check-circle'}
                  size={18}
                  color={isReferencePending ? '#dc3545' : '#28a745'}
                  style={styles.icon}
                />
                <Typography variant="label">Reference Details</Typography>
              </View>
              <AppButton
                title="Update Profile Now"
                onPress={() => navigation.navigate(NAV_KEYS.ProfileScreen)}
                style={styles.updateButton}
              />
            </View>
          ) : (
            <>
              {/*Profile Verified Card */}
              <View style={styles.verifiedCard}>
                <View style={styles.rowItem}>
                  <FontAwesome
                    name={'check-circle'}
                    size={18}
                    color={'#28a745'}
                    style={styles.icon}
                  />
                  <Typography
                    weight="medium"
                    variant="body"
                    style={styles.verifiedTitle}
                  >
                    Profile Verified Successfully
                  </Typography>
                </View>

                <Typography variant="label" style={styles.verifiedDesc}>
                  All your verification details are complete. Please review the
                  payment details below to proceed with your PG booking.
                </Typography>
              </View>

              {/* Payment Mode Selection */}
              <View style={styles.paymentModeCard}>
                <Typography
                  weight="medium"
                  variant="body"
                  style={styles.paymentModeTitle}
                >
                  Select Payment Mode
                </Typography>
                {errors.paymentMode && (
                  <Typography variant="caption" style={styles.errorText}>
                    {errors.paymentMode}
                  </Typography>
                )}
                <View style={styles.paymentModeOptions}>
                  {[
                    { value: 'upi', label: 'UPI', icon: 'qr-code' },
                    {
                      value: 'bank',
                      label: 'Bank Transfer',
                      icon: 'account-balance',
                    },
                    { value: 'cash', label: 'Cash', icon: 'money' },
                  ].map(mode => (
                    <TouchableOpacity
                      key={mode.value}
                      style={[
                        styles.paymentModeOption,
                        paymentMode === mode.value &&
                        styles.paymentModeOptionActive,
                      ]}
                      onPress={() => {
                        setPaymentMode(mode.value as 'upi' | 'bank' | 'cash');
                        setErrors(prev => ({ ...prev, paymentMode: '' }));
                      }}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name={
                          paymentMode === mode.value
                            ? 'radio-button-checked'
                            : 'radio-button-unchecked'
                        }
                        size={22}
                        color={
                          paymentMode === mode.value
                            ? colors.mainColor
                            : colors.gray
                        }
                      />
                      <MaterialIcons
                        name={mode.icon as any}
                        size={20}
                        color={
                          paymentMode === mode.value
                            ? colors.mainColor
                            : colors.gray
                        }
                        style={styles.paymentModeIcon}
                      />
                      <Typography
                        variant="label"
                        weight={paymentMode === mode.value ? 'bold' : 'medium'}
                        style={[
                          styles.paymentModeLabel,
                          paymentMode === mode.value &&
                          styles.paymentModeLabelActive,
                        ]}
                      >
                        {mode.label}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bank details dynamically from API - Show only when Bank mode is selected */}
              {paymentMode === 'bank' && hasBankDetails ? (
                <View style={styles.bankDetailsCard}>
                  <Typography
                    weight="medium"
                    variant="body"
                    style={styles.bankCardTitle}
                  >
                    Bank Details
                  </Typography>
                  {[
                    {
                      label: 'Bank Name',
                      value: (bankDetails as any).bank_name,
                      icon: 'bank',
                    },
                    {
                      label: 'Account Holder Name',
                      value: (bankDetails as any).account_holder_name,
                      icon: 'user',
                    },
                    {
                      label: 'Account Number',
                      value: (bankDetails as any).account_number,
                      icon: 'credit-card',
                    },
                    {
                      label: 'IFSC Code',
                      value: (bankDetails as any).ifsc_code,
                      icon: 'barcode',
                    },
                    {
                      label: 'Branch Name',
                      value: (bankDetails as any).branch_name,
                      icon: 'map-marker',
                    },
                  ].map(item => (
                    <View key={item.label} style={styles.bankRowModern}>
                      <View style={styles.bankRowLeft}>
                        <View style={styles.bankRowIconWrap}>
                          <FontAwesome
                            name={item.icon as any}
                            size={14}
                            color="#fff"
                          />
                        </View>
                        <Typography variant="label" style={styles.bankRowLabel}>
                          {item.label}
                        </Typography>
                      </View>
                      <View style={styles.bankRowRight}>
                        <Typography
                          variant="label"
                          weight="medium"
                          style={styles.bankRowValue}
                        >
                          {item.value || '-'}
                        </Typography>
                      </View>
                    </View>
                  ))}
                </View>
              ) : paymentMode === 'bank' && !hasBankDetails ? (
                <View style={styles.noBankDetailsCard}>
                  <View style={styles.warningHeader}>
                    <View style={styles.warningIconWrap}>
                      <FontAwesome
                        name="exclamation-circle"
                        size={18}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.warningTextWrap}>
                      <Typography
                        weight="bold"
                        variant="body"
                        style={styles.warningText}
                      >
                        Bank details not found.
                      </Typography>
                      <Typography variant="label" style={styles.warningSubText}>
                        Please contact the PG Owner for payment assistance or
                        support.
                      </Typography>
                    </View>
                  </View>

                  {/* PG Owner Details */}
                  {(LandlordName || LandlordMobile || LandlordEmail) && (
                    <View style={styles.ownerDetailsCard}>
                      <Typography
                        weight="medium"
                        variant="body"
                        style={styles.ownerDetailsTitle}
                      >
                        PG Owner Details
                      </Typography>
                      {LandlordName && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="user"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Name
                            </Typography>
                          </View>
                          <Typography
                            variant="label"
                            style={styles.ownerDetailValue}
                          >
                            {LandlordName}
                          </Typography>
                        </View>
                      )}
                      {LandlordMobile && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="phone"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Mobile
                            </Typography>
                          </View>
                          <TouchableOpacity onPress={handleCallOwner}>
                            <Typography
                              variant="label"
                              style={[styles.ownerDetailValue, styles.linkText]}
                            >
                              {LandlordMobile}
                            </Typography>
                          </TouchableOpacity>
                        </View>
                      )}
                      {LandlordEmail && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="envelope"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Email
                            </Typography>
                          </View>
                          <TouchableOpacity onPress={handleEmailOwner}>
                            <Typography
                              variant="label"
                              style={[styles.ownerDetailValue, styles.linkText]}
                            >
                              {LandlordEmail}
                            </Typography>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : null}

              {/* UPI Payment Section - Show only when UPI mode is selected */}
              {paymentMode === 'upi' && hasBankDetails ? (
                <View style={styles.bankDetailsCard}>
                  <Typography
                    weight="medium"
                    variant="body"
                    style={styles.bankCardTitle}
                  >
                    UPI Payment
                  </Typography>
                  {/* UPI ID */}
                  <View style={styles.bankRowModern}>
                    <View style={styles.bankRowLeft}>
                      <View style={styles.bankRowIconWrap}>
                        <FontAwesome name="qrcode" size={14} color="#fff" />
                      </View>
                      <Typography variant="label" style={styles.bankRowLabel}>
                        UPI ID
                      </Typography>
                    </View>
                    <View style={styles.bankRowRight}>
                      <Typography
                        variant="label"
                        weight="medium"
                        style={styles.bankRowValue}
                      >
                        {(bankDetails as any).upi_id || '-'}
                      </Typography>
                      {(bankDetails as any).upi_id && (
                        <TouchableOpacity
                          onPress={handleCopyUPI}
                          style={styles.copyIconButton}
                          hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                          }}
                        >
                          <FontAwesome
                            name="copy"
                            size={16}
                            color={colors.mainColor || '#0b8a34'}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {/* QR Code */}
                  {qrCodeUri ? (
                    <View style={styles.qrSection}>
                      <View style={styles.qrSectionHeader}>
                        <Typography
                          weight="medium"
                          variant="label"
                          style={styles.qrSectionTitle}
                        >
                          QR Code Payment
                        </Typography>
                        <TouchableOpacity
                          onPress={handleDownloadQR}
                          style={styles.downloadIconButton}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <FontAwesome
                            name="download"
                            size={18}
                            color={colors.mainColor || '#0b8a34'}
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                          setPreviewImage(qrCodeUri);
                          setPreviewVisible(true);
                        }}
                      >
                        <AppImage
                          source={{ uri: qrCodeUri }}
                          style={styles.qrImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Typography variant="caption" style={styles.qrCaption}>
                        Scan this code using any UPI app to pay instantly.
                      </Typography>
                    </View>
                  ) : null}
                </View>
              ) : paymentMode === 'upi' && !hasBankDetails ? (
                <View style={styles.noBankDetailsCard}>
                  <View style={styles.warningHeader}>
                    <View style={styles.warningIconWrap}>
                      <FontAwesome
                        name="exclamation-circle"
                        size={18}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.warningTextWrap}>
                      <Typography
                        weight="bold"
                        variant="body"
                        style={styles.warningText}
                      >
                        UPI details not found.
                      </Typography>
                      <Typography variant="label" style={styles.warningSubText}>
                        Please contact the PG Owner for payment assistance or
                        support.
                      </Typography>
                    </View>
                  </View>

                  {/* PG Owner Details */}
                  {(LandlordName || LandlordMobile || LandlordEmail) && (
                    <View style={styles.ownerDetailsCard}>
                      <Typography
                        weight="medium"
                        variant="body"
                        style={styles.ownerDetailsTitle}
                      >
                        PG Owner Details
                      </Typography>
                      {LandlordName && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="user"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Name
                            </Typography>
                          </View>
                          <Typography
                            variant="label"
                            style={styles.ownerDetailValue}
                          >
                            {LandlordName}
                          </Typography>
                        </View>
                      )}
                      {LandlordMobile && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="phone"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Mobile
                            </Typography>
                          </View>
                          <TouchableOpacity onPress={handleCallOwner}>
                            <Typography
                              variant="label"
                              style={[styles.ownerDetailValue, styles.linkText]}
                            >
                              {LandlordMobile}
                            </Typography>
                          </TouchableOpacity>
                        </View>
                      )}
                      {LandlordEmail && (
                        <View style={styles.ownerDetailRow}>
                          <View style={styles.ownerDetailLabel}>
                            <FontAwesome
                              name="envelope"
                              size={16}
                              color="#8a6d1d"
                              style={styles.ownerDetailIcon}
                            />
                            <Typography variant="label" weight="medium">
                              Email
                            </Typography>
                          </View>
                          <TouchableOpacity onPress={handleEmailOwner}>
                            <Typography
                              variant="label"
                              style={[styles.ownerDetailValue, styles.linkText]}
                            >
                              {LandlordEmail}
                            </Typography>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : null}

              {/* Cash Payment Info */}
              {paymentMode === 'cash' && (
                <View style={styles.cashPaymentCard}>
                  <View style={styles.cashPaymentHeader}>
                    <MaterialIcons
                      name="money"
                      size={24}
                      color={colors.mainColor || '#0b8a34'}
                    />
                    <Typography
                      weight="medium"
                      variant="body"
                      style={styles.cashPaymentTitle}
                    >
                      Cash Payment
                    </Typography>
                  </View>
                  <Typography variant="label" style={styles.cashPaymentDesc}>
                    You can proceed with cash payment. Payment screenshot is
                    optional for cash transactions.
                  </Typography>
                </View>
              )}

              {/*Payment Form - Show when payment mode is selected */}
              {paymentMode && (
                <View style={styles.paymentFormCard}>
                  <View style={styles.amountRow}>
                    <Typography variant="label">Room Rent:</Typography>
                    <Typography weight="medium">₹{RoomRent || '0'}</Typography>
                  </View>
                  <View style={styles.amountRow}>
                    <Typography variant="label">Security Charges:</Typography>
                    <Typography weight="medium">
                      ₹{SecurityCharges || '0'}
                    </Typography>
                  </View>
                  <View style={styles.amountRow}>
                    <Typography variant="label">
                      Maintainance Charges:
                    </Typography>
                    <Typography weight="medium">
                      ₹{MaintainanceCharges || '0'}
                    </Typography>
                  </View>
                  <View style={styles.amountRow}>
                    <Typography variant="label">Total Amount:</Typography>
                    <Typography weight="medium">₹{Amount || '0'}</Typography>
                  </View>

                  <View style={styles.dateRow}>
                    <AppDatePicker
                      placeholder="Start Date"
                      date={startDate}
                      onDateChange={d => {
                        setStartDate(d);
                        setErrors(prev => ({ ...prev, startDate: '' }));
                        // Automatically set End Date = Start Date + 30 days
                        const nextMonthDate = new Date(d);
                        nextMonthDate.setDate(nextMonthDate.getDate() + 30);
                        setEndDate(nextMonthDate);
                      }}
                      error={errors.startDate}
                      minimumDate={new Date()}
                      containerStyle={{ flex: 1 }}
                    />
                    <View style={{ width: 10 }} />
                    {/* End Date readonly bana diya */}
                    <AppDatePicker
                      placeholder="End Date"
                      date={endDate}
                      onDateChange={() => { }}
                      disabled={true}
                      containerStyle={{ flex: 1 }}
                    />
                  </View>

                  <ImagePickerInput
                    label={
                      paymentMode === 'cash'
                        ? 'Upload Payment Screenshot (Optional)'
                        : 'Upload Payment Screenshot'
                    }
                    value={screenshot}
                    onSelect={file => setScreenshot(file)}
                  />
                  <Typography variant="caption" style={{ marginTop: -10 }}>
                    {paymentMode === 'cash'
                      ? 'Upload a clear screenshot of your payment confirmation (optional for cash payments).'
                      : 'Upload a clear screenshot of your payment confirmation.'}
                  </Typography>

                  <AppButton
                    title="Submit Payment Detail"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={
                      !startDate ||
                      !endDate ||
                      ((paymentMode === 'upi' || paymentMode === 'bank') &&
                        !screenshot)
                    }
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
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

          {previewImage ? (
            <AppImage
              source={{ uri: previewImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

export default UserPaymentScreen;
