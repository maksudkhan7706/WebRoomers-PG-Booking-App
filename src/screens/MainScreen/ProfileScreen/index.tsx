import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
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
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobileNumber: '',
    aadhaarNumber: '',
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
    if (apiUserData?.success && apiUserData?.data) {
      const d = apiUserData.data;
      setForm({
        fullName: d.user_fullname || '',
        mobileNumber: d.user_mobile || '',
        aadhaarNumber: d.aadhar_number || '',
        aadhaarFront: d.aadhar_front || null,
        aadhaarBack: d.aadhar_back || null,
        policeVerification: d.police_verification || null,
        ref1Name: d.ref1_name || '',
        ref1Mobile: d.ref1_mobile || '',
        ref2Name: d.ref2_name || '',
        ref2Mobile: d.ref2_mobile || '',
        city: d.user_city_ids || '',
      });
    }
  }, [apiUserData]);

  const handleImageSelect = (key: string, file: any) => {
    console.log('file ===========>>>>>>>>', file);
    setForm(prev => ({ ...prev, [key]: file }));
  };

  const validateForm = () => {
    let newErrors = { fullName: '', mobileNumber: '', aadhaarNumber: '' };
    let valid = true;

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

    if (!form.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = 'Aadhaar Number is required';
      valid = false;
    } else if (!/^\d{12}$/.test(form.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Enter valid 12-digit Aadhaar Number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          user_id: userData.user_id,
          full_name: form.fullName,
          mobile: form.mobileNumber,
          user_type: userData.user_type == 'user' ? 'tenant' : 'landlord',
          aadhar_number: form.aadhaarNumber,
          ref1_name: form.ref1Name,
          ref1_mobile: form.ref1Mobile,
          ref2_name: form.ref2Name,
          ref2_mobile: form.ref2Mobile,
          city: form.city,
          aadhar_front: form.aadhaarFront,
          aadhar_back: form.aadhaarBack,
          police_verification: form.policeVerification,
          // ✅ bank details userData se lenge (kyunki API ke example me bank_detail alag se nahi bhejna)
          account_holder: JSON.parse(userData.bank_detail)?.account_holder,
          bank_name: JSON.parse(userData.bank_detail)?.bank_name,
          account_number: JSON.parse(userData.bank_detail)?.account_number,
          ifsc_code: JSON.parse(userData.bank_detail)?.ifsc_code,
          upi_id: JSON.parse(userData.bank_detail)?.upi_id,
          qr_code: JSON.parse(userData.bank_detail)?.qr_code,
        };

        console.log('🚀 Payload sent:', payload);

        const res = await dispatch(updateProfileApi(payload)).unwrap();
        console.log('✅ Profile Update API Response:', res);

        if (res?.success) {
          showSuccessMsg(res.message || 'Profile updated successfully');
        } else {
          showErrorMsg(res?.message || 'Something went wrong');
        }
      } catch (err: any) {
        console.log('❌ Profile update error:', err);
        showErrorMsg('Failed to update profile.');
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields properly.');
    }
  };

  console.log('apiUserData ===',apiUserData);
  

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" showBack />
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
            onChangeText={text => setForm({ ...form, aadhaarNumber: text })}
            error={errors.aadhaarNumber}
          />

          <ImagePickerInput
            label="Aadhaar Front Photo"
            value={apiUserData?.aadhaarFront || ''}
            onSelect={file => handleImageSelect('aadhaarFront', file)}
          />

          <ImagePickerInput
            label="Aadhaar Back Photo"
            value={apiUserData?.aadhar_back || ''}
            onSelect={file => handleImageSelect('aadhar_back', file)}
          />

          <ImagePickerInput
            label="Police Verification Photo"
            value={apiUserData?.policeVerification || ''}
            onSelect={file => handleImageSelect('policeVerification', file)}
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
    </View>
  );
};

export default ProfileScreen;