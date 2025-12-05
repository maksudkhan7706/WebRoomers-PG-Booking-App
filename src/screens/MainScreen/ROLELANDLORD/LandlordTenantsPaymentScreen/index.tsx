import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { payNow } from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/NavKeys';
import AppDatePicker from '../../../../ui/AppDatePicker';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import AppTextInput from '../../../../ui/AppTextInput';

type LandlordTenantsPaymentNavProp =
  NativeStackNavigationProp<RootStackParamList>;

const LandlordTenantsPaymentScreen = () => {
  const route = useRoute<any>();
  const { tenantData } = route.params || {};
  const navigation = useNavigation<LandlordTenantsPaymentNavProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);

  // Extract tenant data
  const propertyEnquiryId = tenantData?.property_enquiry_id;

  // Get amounts from tenantData
  const roomRent = tenantData?.room_rent || 0;
  const securityCharges = tenantData?.security_charge || 0;
  const maintainanceCharges = tenantData?.maintenance_charge || 0;
  const baseAmount =
    tenantData?.amount || roomRent + securityCharges + maintainanceCharges;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [discount, setDiscount] = useState<string>('');
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
    discount?: string;
  }>({});

  // Initialize dates from tenantData
  useEffect(() => {
    if (tenantData?.check_in_date) {
      const checkInDate = new Date(tenantData.check_in_date);
      setStartDate(checkInDate);
    }
    if (tenantData?.check_out_date) {
      const checkOutDate = new Date(tenantData.check_out_date);
      setEndDate(checkOutDate);
    }
  }, [tenantData]);

  const discountAmount = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, baseAmount - discountAmount);

  const handleDiscountChange = (value: string) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setDiscount(numericValue);
    // Real-time validation
    const discountValue = parseFloat(numericValue) || 0;
    if (numericValue && discountValue > baseAmount) {
      setErrors(prev => ({
        ...prev,
        discount: 'Discount cannot be greater than total amount',
      }));
    } else {
      setErrors(prev => ({ ...prev, discount: '' }));
    }
  };

  const validateDiscount = (): boolean => {
    const discountValue = parseFloat(discount) || 0;
    if (discountValue > baseAmount) {
      setErrors(prev => ({
        ...prev,
        discount: 'Discount cannot be greater than total amount',
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!startDate)
      return setErrors(prev => ({
        ...prev,
        startDate: 'Start Date is required',
      }));
    if (!endDate)
      return setErrors(prev => ({ ...prev, endDate: 'End Date is required' }));

    // Validate discount
    if (!validateDiscount()) {
      return;
    }

    if (!propertyEnquiryId) {
      return showErrorMsg('Enquiry ID is missing');
    }

    const formData = new FormData();
    formData.append('company_id', String(userData?.company_id));
    formData.append('enquiry_id', String(propertyEnquiryId));
    formData.append('start_date', startDate.toISOString().split('T')[0]);
    formData.append('end_date', endDate.toISOString().split('T')[0]);
    formData.append('amount', String(totalAmount));
    formData.append('payment_mode', 'cash'); // Default to cash
    formData.append('pay_by', String(userData?.user_id)); // Landlord's user_id
    formData.append('discount', String(discountAmount));
    formData.append('payment_screenshot', '');

    try {
      const res = await dispatch(payNow(formData)).unwrap();
      if (res?.success === false) {
        showErrorMsg(res?.message || 'Payment submission failed.');
        return;
      }
      showSuccessMsg(res?.message || 'Payment submitted successfully!');
      navigation.goBack();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        'Something went wrong.';
      showErrorMsg(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Deposit Payment" showBack />
      <ScrollView
        style={styles.listContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Payment Form */}
        <View style={styles.paymentFormCard}>
          <View style={styles.amountRow}>
            <Typography variant="label">Room Rent:</Typography>
            <Typography weight="medium">₹{roomRent || '0'}</Typography>
          </View>
          <View style={styles.amountRow}>
            <Typography variant="label">Security Charges:</Typography>
            <Typography weight="medium">₹{securityCharges || '0'}</Typography>
          </View>
          <View style={styles.amountRow}>
            <Typography variant="label">Maintainance Charges:</Typography>
            <Typography weight="medium">
              ₹{maintainanceCharges || '0'}
            </Typography>
          </View>

          <View style={styles.amountRow}>
            <Typography variant="label" weight="bold">
              Total Amount:
            </Typography>
            <Typography weight="bold" style={styles.totalAmountText}>
              ₹{totalAmount || '0'}
            </Typography>
          </View>

          {/* Discount Field */}
          <AppTextInput
            label="Discount (₹)"
            placeholder="Enter discount amount"
            value={discount}
            onChangeText={handleDiscountChange}
            keyboardType="numeric"
            error={errors.discount}
            containerStyle={styles.discountInput}
          />

          <View style={styles.dateRow}>
            <AppDatePicker
              placeholder="Start Date"
              date={startDate}
              onDateChange={d => {
                setStartDate(d);
                setErrors(prev => ({ ...prev, startDate: '' }));
                const nextMonthDate = new Date(d);
                nextMonthDate.setDate(nextMonthDate.getDate() + 30);
                setEndDate(nextMonthDate);
              }}
              error={errors.startDate}
              minimumDate={new Date()}
              containerStyle={{ flex: 1 }}
            />
            <View style={{ width: 10 }} />
            <AppDatePicker
              placeholder="End Date"
              date={endDate}
              onDateChange={() => {}}
              disabled={true}
              containerStyle={{ flex: 1 }}
            />
          </View>

          <AppButton
            title="Submit Payment Detail"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={!startDate || !endDate}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LandlordTenantsPaymentScreen;
