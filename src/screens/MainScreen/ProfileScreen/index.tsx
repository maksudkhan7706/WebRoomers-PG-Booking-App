import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import AppTextInput from '../../../ui/AppTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePickerInput from '../../../ui/ImagePickerInput';
import AppButton from '../../../ui/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { apiUserDataFetch, updateProfileApi } from '../../../store/mainSlice';
import { useIsFocused } from '@react-navigation/native';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';
import colors from '../../../constants/colors';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { apiUserData, loading } = useSelector(
    (state: RootState) => state.main,
  );

  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    aadhaarFront: null,
    aadhaarBack: null,
    policeVerification: null,
    ref1Name: '',
    ref1Mobile: '',
    ref2Name: '',
    ref2Mobile: '',
    city: '',
    landlordAccountHolder: '',
    landlordBankName: '',
    landlordAccountNumber: '',
    landlordIFSCCode: '',
    landlordUPIID: '',
    landlordQrCodeImg: null,
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    landlordAccountHolder: '',
    landlordBankName: '',
    landlordAccountNumber: '',
    landlordIFSCCode: '',
  });

  //Fetch latest user info from API
  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      dispatch(
        apiUserDataFetch({
          user_id: userData.user_id,
          company_id: userData.company_id,
        }),
      );
    }
  }, [isFocused]);


  // Update form when latest API data arrives
  useEffect(() => {
    if (apiUserData?.success && apiUserData?.data && userData) {
      const d = apiUserData.data;
      const landlordBankDetail =
        typeof apiUserData?.data?.bank_detail === 'string'
          ? JSON.parse(apiUserData.data.bank_detail)
          : apiUserData?.data?.bank_detail;

      setForm(prev => ({
        ...prev,
        fullName: d.user_fullname || prev.fullName,
        mobileNumber: d.user_mobile || prev.mobileNumber,
        aadhaarNumber: d.aadhar_number || prev.aadhaarNumber,
        //Preserve old images if API sends null or empty
        aadhaarFront:
          d.aadhar_front && d.aadhar_front !== 'null'
            ? d.aadhar_front
            : prev.aadhaarFront,
        aadhaarBack:
          d.aadhar_back && d.aadhar_back !== 'null'
            ? d.aadhar_back
            : prev.aadhaarBack,
        policeVerification:
          d.police_verification && d.police_verification !== 'null'
            ? d.police_verification
            : prev.policeVerification,

        ref1Name: d.ref1_name || prev.ref1Name,
        ref1Mobile: d.ref1_mobile || prev.ref1Mobile,
        ref2Name: d.ref2_name || prev.ref2Name,
        ref2Mobile: d.ref2_mobile || prev.ref2Mobile,
        city: d.user_city_ids || prev.city,

        landlordAccountHolder:
          landlordBankDetail?.account_holder || prev.landlordAccountHolder,
        landlordBankName:
          landlordBankDetail?.bank_name || prev.landlordBankName,
        landlordAccountNumber:
          landlordBankDetail?.account_number || prev.landlordAccountNumber,
        landlordIFSCCode:
          landlordBankDetail?.ifsc_code || prev.landlordIFSCCode,
        landlordUPIID: landlordBankDetail?.upi_id || prev.landlordUPIID,
        landlordQrCodeImg:
          landlordBankDetail?.qr_code || prev.landlordQrCodeImg,
      }));
    }
  }, [apiUserData, userData]);

  const handleImageSelect = (key: string, file: any) => {
    console.log('handleImageSelect file ===========>>>>>>>>', file);
    setForm(prev => ({ ...prev, [key]: file }));
  };

  const validateForm = () => {
    let newErrors = {
      fullName: '',
      mobileNumber: '',
      aadhaarNumber: '',
      landlordAccountHolder: '',
      landlordBankName: '',
      landlordAccountNumber: '',
      landlordIFSCCode: '',
    };
    let valid = true;
    const isLandlord = userData?.user_type?.toLowerCase() === 'landlord';
    //Common fields (har type ke liye)
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      valid = false;
    }
    if (!form.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(form.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit number';
      valid = false;
    }
    //Tenant ke liye Aadhaar validation
    if (!isLandlord) {
      if (!form.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = 'Aadhaar Number is required';
        valid = false;
      } else if (!/^\d{12}$/.test(form.aadhaarNumber)) {
        newErrors.aadhaarNumber = 'Enter valid 12-digit Aadhaar Number';
        valid = false;
      }
    }
    //Landlord ke liye Bank Detail validation
    if (isLandlord) {
      if (!form.landlordAccountHolder.trim()) {
        newErrors.landlordAccountHolder = 'Account Holder Name is required';
        valid = false;
      }
      if (!form.landlordBankName.trim()) {
        newErrors.landlordBankName = 'Bank Name is required';
        valid = false;
      }
      if (!form.landlordAccountNumber.trim()) {
        newErrors.landlordAccountNumber = 'Account Number is required';
        valid = false;
      } else if (!/^\d{9,18}$/.test(form.landlordAccountNumber)) {
        newErrors.landlordAccountNumber = 'Enter valid account number';
        valid = false;
      }
      if (!form.landlordIFSCCode.trim()) {
        newErrors.landlordIFSCCode = 'IFSC Code is required';
        valid = false;
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.landlordIFSCCode)) {
        newErrors.landlordIFSCCode = 'Enter valid IFSC Code (e.g. SBIN0001234)';
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  //Profile Submit Handler
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          user_id: userData?.user_id,
          user_type: userData?.user_type === 'user' ? 'tenant' : 'landlord',
          // 🧾 Basic Details
          full_name: form.fullName.trim(),
          mobile: form.mobileNumber.trim(),
          aadhar_number: form.aadhaarNumber.trim(),
          ref1_name: form.ref1Name.trim(),
          ref1_mobile: form.ref1Mobile.trim(),
          ref2_name: form.ref2Name.trim(),
          ref2_mobile: form.ref2Mobile.trim(),
          city: form.city,
          aadhar_front: form.aadhaarFront,
          aadhar_back: form.aadhaarBack,
          police_verification: form.policeVerification,
          // 🏦 Landlord Bank Details (directly from form)
          account_holder: form.landlordAccountHolder.trim(),
          bank_name: form.landlordBankName.trim(),
          account_number: form.landlordAccountNumber.trim(),
          ifsc_code: form.landlordIFSCCode.trim(),
          upi_id: form.landlordUPIID?.trim() || '',
          qr_code: form.landlordQrCodeImg || null,
        };

        console.log('🚀 Payload sent:', payload);
        const res = await dispatch(updateProfileApi(payload)).unwrap();
        console.log('✅ Profile Update API Response:', res);
        if (res?.success) {
          showSuccessMsg(res.message || 'Profile updated successfully');
          dispatch(
            apiUserDataFetch({
              user_id: userData.user_id,
              company_id: userData.company_id,
            }),
          );
        } else {
          showErrorMsg(res?.message || 'Something went wrong');
        }
      } catch (err) {
        console.log('❌ Profile update error:', err);
        showErrorMsg('Failed to update profile.');
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields properly.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" showBack />
      {loading ? (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography
            style={{ textAlign: 'center', marginTop: 10 }}
            weight="medium"
          >
            Loading profile...
          </Typography>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid
            extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Basic Info */}
            <AppTextInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={form.fullName}
              onChangeText={text => setForm({ ...form, fullName: text })}
              error={errors.fullName}
            />

            <AppTextInput
              label="Mobile Number *"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={form.mobileNumber}
              onChangeText={text => setForm({ ...form, mobileNumber: text })}
              error={errors.mobileNumber}
            />
            {userData?.user_type == 'landlord' ? (
              <>
                {/* Bank / Payment Details */}
                <Typography
                  variant="subheading"
                  weight="medium"
                  style={{ marginVertical: 10 }}
                >
                  Bank / Payment Details
                </Typography>
                <AppTextInput
                  label="Account Holder *"
                  placeholder=""
                  value={form.landlordAccountHolder}
                  onChangeText={text =>
                    setForm({ ...form, landlordAccountHolder: text })
                  }
                  error={errors.landlordAccountHolder}
                />
                <AppTextInput
                  label="Bank Name *"
                  placeholder=""
                  value={form.landlordBankName}
                  onChangeText={text =>
                    setForm({ ...form, landlordBankName: text })
                  }
                  error={errors.landlordBankName}
                />
                <AppTextInput
                  label="Account Number *"
                  placeholder=""
                  value={form.landlordAccountNumber}
                  onChangeText={text =>
                    setForm({ ...form, landlordAccountNumber: text })
                  }
                  error={errors.landlordAccountNumber}
                  keyboardType="number-pad"
                />
                <AppTextInput
                  label="IFSC Code *"
                  placeholder=""
                  value={form.landlordIFSCCode}
                  onChangeText={text =>
                    setForm({ ...form, landlordIFSCCode: text })
                  }
                  error={errors.landlordIFSCCode}
                />
                <AppTextInput
                  label="UPI ID"
                  placeholder=""
                  value={form.landlordUPIID}
                  onChangeText={text =>
                    setForm({ ...form, landlordUPIID: text })
                  }
                />
                <ImagePickerInput
                  label="QR Code Image"
                  value={form?.landlordQrCodeImg}
                  onSelect={file =>
                    handleImageSelect('landlordQrCodeImg', file)
                  }
                />
              </>
            ) : (
              <>
                {/* Identity Verification */}
                <Typography
                  variant="subheading"
                  weight="medium"
                  style={{ marginVertical: 10 }}
                >
                  Identity Verification
                </Typography>

                <AppTextInput
                  label="Aadhaar Number *"
                  placeholder="Enter 12-digit Aadhaar Number"
                  keyboardType="numeric"
                  value={form.aadhaarNumber}
                  onChangeText={text =>
                    setForm({ ...form, aadhaarNumber: text })
                  }
                  error={errors.aadhaarNumber}
                />

                <ImagePickerInput
                  label="Aadhaar Front Photo"
                  value={form.aadhaarFront}
                  onSelect={file => handleImageSelect('aadhaarFront', file)}
                />

                <ImagePickerInput
                  label="Aadhaar Back Photo"
                  value={form.aadhaarBack}
                  onSelect={file => handleImageSelect('aadhaarBack', file)}
                />

                <ImagePickerInput
                  label="Police Verification Photo"
                  value={form.policeVerification}
                  onSelect={file =>
                    handleImageSelect('policeVerification', file)
                  }
                />

                {/* References */}
                <Typography
                  variant="subheading"
                  weight="medium"
                  style={{ marginVertical: 10 }}
                >
                  References
                </Typography>
                <AppTextInput
                  label="Reference 1 Name"
                  value={form.ref1Name}
                  onChangeText={text => setForm({ ...form, ref1Name: text })}
                />
                <AppTextInput
                  label="Reference 1 Mobile"
                  keyboardType="phone-pad"
                  value={form.ref1Mobile}
                  onChangeText={text => setForm({ ...form, ref1Mobile: text })}
                />
                <AppTextInput
                  label="Reference 2 Name"
                  value={form.ref2Name}
                  onChangeText={text => setForm({ ...form, ref2Name: text })}
                />
                <AppTextInput
                  label="Reference 2 Mobile"
                  keyboardType="phone-pad"
                  value={form.ref2Mobile}
                  onChangeText={text => setForm({ ...form, ref2Mobile: text })}
                />
                <AppTextInput
                  label="City"
                  value={form.city}
                  onChangeText={text => setForm({ ...form, city: text })}
                />
              </>
            )}

            {/* Submit Button */}
            <View style={{ marginTop: 20, marginBottom: 66 }}>
              <AppButton
                title={loading ? 'Loading...' : 'Submit Profile'}
                loading={loading}
                disabled={loading}
                onPress={handleSubmit}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default ProfileScreen;
