import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import AppButton from '../../../../ui/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  apiUserDataFetch,
  updateProfileApi,
} from '../../../../store/mainSlice';
import { useIsFocused } from '@react-navigation/native';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import colors from '../../../../constants/colors';
import { appLog } from '../../../../utils/appLog';
import ProfilePhotoPicker from '../../../../ui/ProfilePhotoPicker';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { apiUserData, loading } = useSelector(
    (state: RootState) => state.main,
  );
  const [form, setForm] = useState({
    profilePhoto: null,
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    emailAddress: '',
    aadhaarNumber: '',
    aadhaarFront: null,
    aadhaarBack: null,
    policeVerification: null,
    ref1Name: '',
    ref1Mobile: '',
    ref2Name: '',
    ref2Mobile: '',
    address: '',
    policeStation: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    emailAddress: '',
    address: '',
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

  //Update form when latest API data arrives
  useEffect(() => {
    if (apiUserData?.success && apiUserData?.data && userData) {
      const d = apiUserData.data;
      console.log('apiUserData', apiUserData?.data);

      setForm(prev => ({
        ...prev,
        fullName: d.user_fullname || prev.fullName,
        fatherName: d.user_father_name || prev.fatherName,
        mobileNumber: d.user_mobile || prev.mobileNumber,
        emailAddress: d.user_email || prev.emailAddress,
        aadhaarNumber: d.aadhar_number || prev.aadhaarNumber,
        profilePhoto:
          d.profile_photo &&
          d.profile_photo !== 'null' &&
          d.profile_photo !== ''
            ? d.profile_photo
            : prev.profilePhoto || null,
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
        address: d.address || prev.address,
        policeStation: d.police_station || prev.policeStation,
      }));
    }
  }, [apiUserData, userData]);

  const handleImageSelect = (key: string, file: any) => {
    setForm(prev => ({ ...prev, [key]: file }));
  };

  const handleProfilePhotoSelect = (file: any) => {
    setForm(prev => ({ ...prev, profilePhoto: file }));
  };

  const validateForm = () => {
    let newErrors = {
      fullName: '',
      fatherName: '',
      mobileNumber: '',
      emailAddress: '',
      aadhaarNumber: '',
      address: '',
    };
    let valid = true;
    const isLandlord = userData?.user_type?.toLowerCase() === 'landlord';
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
    if (!form.fatherName.trim()) {
      newErrors.fatherName = 'Father Name is required';
      valid = false;
    }
    if (!form.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
      valid = false;
    }
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }
    if (!isLandlord) {
      if (!form.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = 'Aadhaar Number is required';
        valid = false;
      } else if (!/^\d{12}$/.test(form.aadhaarNumber)) {
        newErrors.aadhaarNumber = 'Enter valid 12-digit Aadhaar Number';
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
          user_type: userData?.user_type,
          full_name: form.fullName.trim(),
          father_name: form.fatherName.trim(),
          mobile: form.mobileNumber.trim(),
          user_email: form.emailAddress.trim(),
          aadhar_number: form.aadhaarNumber.trim(),
          ref1_name: form.ref1Name.trim(),
          ref1_mobile: form.ref1Mobile.trim(),
          ref2_name: form.ref2Name.trim(),
          ref2_mobile: form.ref2Mobile.trim(),
          address: form.address.trim(),
          police_station: form.policeStation.trim(),
          // Include profile_image if it's a new file (object with uri) OR existing photo (string URL)
          // This ensures existing photos are preserved when updating other fields
          ...(form.profilePhoto
            ? typeof form.profilePhoto === 'object' &&
              !Array.isArray(form.profilePhoto) &&
              form.profilePhoto !== null &&
              'uri' in form.profilePhoto &&
              (form.profilePhoto as any).uri
              ? { profile_image: form.profilePhoto } // New file object
              : typeof form.profilePhoto === 'string' &&
                (form.profilePhoto as string).trim() !== ''
              ? { profile_image: form.profilePhoto } // Existing photo URL
              : {}
            : {}),
          aadhar_front: form.aadhaarFront,
          aadhar_back: form.aadhaarBack,
          police_verification: form.policeVerification,
        };
        const res = await dispatch(updateProfileApi(payload)).unwrap();
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
        appLog('ProfileScreen', 'Profile update error:', err);
        showErrorMsg('Failed to update profile.');
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields properly.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" showBack rightIcon={false} />
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
            {/* Profile Photo */}
            <ProfilePhotoPicker
              value={form.profilePhoto}
              userName={form.fullName || userData?.user_fullname || ''}
              onSelect={handleProfilePhotoSelect}
            />

            {/* Basic Info */}
            <AppTextInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={form.fullName}
              onChangeText={text => setForm({ ...form, fullName: text })}
              error={errors.fullName}
            />
            <AppTextInput
              label="Father Name *"
              placeholder="Enter your father name"
              value={form.fatherName}
              onChangeText={text => setForm({ ...form, fatherName: text })}
              error={errors.fatherName}
            />
            <AppTextInput
              label="Mobile Number *"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={form.mobileNumber}
              onChangeText={text => setForm({ ...form, mobileNumber: text })}
              error={errors.mobileNumber}
              maxLength={10}
            />

            <AppTextInput
              label="Email *"
              placeholder="Enter your email"
              value={form.emailAddress}
              onChangeText={text => setForm({ ...form, emailAddress: text })}
              error={errors.emailAddress}
            />
            {/* Police Station - Show only for normal users */}
            {userData?.user_type == 'user' && (
              <AppTextInput
                label="Police Station"
                placeholder="Enter your police station"
                value={form.policeStation}
                onChangeText={text => setForm({ ...form, policeStation: text })}
              />
            )}
            {/* Address field - Show for all user types (user, landlord, subuser) */}
            <AppTextInput
              label="Address *"
              placeholder="Enter your address"
              value={form.address}
              onChangeText={text => setForm({ ...form, address: text })}
              error={errors.address}
            />

            {userData?.user_type == 'landlord' ? null : userData?.user_type ==
              'user' ? (
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
                  maxLength={12}
                />

                <View style={styles.imagePickerRow}>
                  <View style={styles.imagePickerItem}>
                    <ImagePickerInput
                      label="Aadhaar Front Photo"
                      value={form.aadhaarFront}
                      onSelect={file => handleImageSelect('aadhaarFront', file)}
                    />
                  </View>
                  <View style={styles.imagePickerItem}>
                    <ImagePickerInput
                      label="Aadhaar Back Photo"
                      value={form.aadhaarBack}
                      onSelect={file => handleImageSelect('aadhaarBack', file)}
                    />
                  </View>
                  <View style={styles.imagePickerItemLast}>
                    <ImagePickerInput
                      label="Police Verification Photo"
                      value={form.policeVerification}
                      onSelect={file =>
                        handleImageSelect('policeVerification', file)
                      }
                    />
                  </View>
                </View>
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
                  maxLength={10}
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
                  maxLength={10}
                />
              </>
            ) : (
              <>
                <AppTextInput
                  label="Aadhaar Number *"
                  placeholder="Enter 12-digit Aadhaar Number"
                  keyboardType="numeric"
                  value={form.aadhaarNumber}
                  onChangeText={text =>
                    setForm({ ...form, aadhaarNumber: text })
                  }
                  error={errors.aadhaarNumber}
                  maxLength={12}
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
