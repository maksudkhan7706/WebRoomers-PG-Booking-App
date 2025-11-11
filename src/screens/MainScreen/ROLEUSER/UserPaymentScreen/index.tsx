import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
  fetchLandlordBankDetail,
  payNow,
} from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import AppDatePicker from '../../../../ui/AppDatePicker';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import AppTextInput from '../../../../ui/AppTextInput';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

type PaymentNavProp = NativeStackNavigationProp<RootStackParamList>;

const UserPaymentScreen = () => {
  const route = useRoute<any>();
  const { LandlordId, Amount, EnquiryId, PaymentStartDate, PaymentStartEnd } =
    route.params || {};
  const navigation = useNavigation<PaymentNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { apiUserData, loading, landlordBankDetail } = useSelector(
    (state: RootState) => state.main,
  );
  //Local states for payment form
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [screenshot, setScreenshot] = useState<any>(null);
  const [amountData, setAmountData] = useState<string>('');
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const userInfo = apiUserData?.data;

  useEffect(() => {
    if (Amount) {
      setAmountData(String(Amount));
    }
  }, [Amount]);

  // 🔹 Auto-fill dates from params if available
  useEffect(() => {
    if (PaymentStartDate) {
      setStartDate(new Date(PaymentStartDate));
    }
    if (PaymentStartEnd) {
      setEndDate(new Date(PaymentStartEnd));
    }
  }, [PaymentStartDate, PaymentStartEnd]);

  useEffect(() => {
    if (isFocused) {
      dispatch(
        apiUserDataFetch({
          user_id: userData?.user_id,
          company_id: userData?.company_id,
        }),
      );
      dispatch(
        fetchLandlordBankDetail({
          landlord_id: LandlordId || '',
          company_id: userData.company_id,
        }),
      );
    }
  }, [isFocused]);

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
    if (!startDate)
      return setErrors(prev => ({
        ...prev,
        startDate: 'Start Date is required',
      }));
    if (!endDate)
      return setErrors(prev => ({ ...prev, endDate: 'End Date is required' }));
    if (!screenshot || screenshot.length === 0)
      return Alert.alert('Please upload payment screenshot.');

    const formData = new FormData();
    formData.append('company_id', String(userData?.company_id));
    formData.append('enquiry_id', String(EnquiryId));
    formData.append('start_date', startDate.toISOString().split('T')[0]);
    formData.append('end_date', endDate.toISOString().split('T')[0]);
    formData.append('amount', String(amountData));

    const image = Array.isArray(screenshot) ? screenshot[0] : screenshot;
    if (image?.uri) {
      formData.append('payment_screenshot', {
        uri: image.uri,
        name: image.fileName || image.name || 'payment.jpg',
        type: image.type || 'image/jpeg',
      });
    }
    try {
      const res = await dispatch(payNow(formData)).unwrap();
      appLog('UserPaymentScreen', 'Payment API Success:', res);
      showSuccessMsg(res?.message || 'Payment submitted successfully!');
      navigation.navigate('MainTabs', { screen: 'HomeScreen' });
    } catch (error: any) {
      appLog('UserPaymentScreen', 'Payment API Error:', error);
      showErrorMsg(error?.message || 'Something went wrong.');
    }
  };

  console.log(
    'PaymentStartDate,PaymentStartEnd ====>>>',
    PaymentStartDate,
    PaymentStartEnd,
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Payment"
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
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView
          style={styles.listContent}
          showsVerticalScrollIndicator={false}
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

                {/* Bank details dynamically from API */}
                {landlordBankDetail ? (
                  <>
                    <View style={styles.bankRow}>
                      <Typography variant="label">Bank Name:</Typography>
                      <Typography weight="medium">
                        {landlordBankDetail.bank_name || '-'}
                      </Typography>
                    </View>
                    <View style={styles.bankRow}>
                      <Typography variant="label">
                        Account Holder Name:
                      </Typography>
                      <Typography weight="medium">
                        {landlordBankDetail.account_holder || '-'}
                      </Typography>
                    </View>

                    <View style={styles.bankRow}>
                      <Typography variant="label">Account Number:</Typography>
                      <Typography weight="medium">
                        {landlordBankDetail.account_number || '-'}
                      </Typography>
                    </View>
                    <View style={styles.bankRow}>
                      <Typography variant="label">IFSC Code:</Typography>
                      <Typography weight="medium">
                        {landlordBankDetail.ifsc_code || '-'}
                      </Typography>
                    </View>
                    <View style={styles.bankRow}>
                      <Typography variant="label">UPI ID:</Typography>
                      <Typography weight="medium">
                        {landlordBankDetail.upi_id || '-'}
                      </Typography>
                    </View>
                  </>
                ) : (
                  <Typography variant="label" style={{ marginTop: 10 }}>
                    Bank details not available.
                  </Typography>
                )}
              </View>
              {/*Payment Form */}
              <View style={styles.paymentFormCard}>
                <AppTextInput
                  placeholder="Amount"
                  value={amountData || ''}
                  editable={false}
                />

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
                    onDateChange={() => {}}
                    disabled={true} // ✅ now readonly
                    containerStyle={{ flex: 1 }}
                  />
                </View>

                <ImagePickerInput
                  label="Upload Payment Screenshot"
                  value={screenshot}
                  onSelect={file => setScreenshot(file)}
                />
                <Typography variant="caption" style={{ marginTop: -10 }}>
                  Upload a clear screenshot of your payment confirmation.
                </Typography>

                <AppButton
                  title="Submit Payment Detail"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  disabled={
                    !startDate || !endDate || !screenshot || !amountData
                  }
                />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default UserPaymentScreen;
