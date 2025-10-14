import React, { useState } from 'react';
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

const ProfileScreen = () => {
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

  const handleImageSelect = (key: string, file: any) => {
    setForm({ ...form, [key]: file });
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

  const handleSubmit = () => {
    if (validateForm()) {
      // Form valid, ab API call ya save process yahan hoga
      Alert.alert('Success', 'Profile submitted successfully!');
      console.log('Form Data:', form);
    } else {
      Alert.alert('Error', 'Please fill all required fields properly.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info */}
          <Typography
            variant="heading"
            weight="bold"
            style={{ marginBottom: 10 }}
          >
            Basic Information
          </Typography>

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
            variant="heading"
            weight="bold"
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
            onSelect={file => handleImageSelect('aadhaarFront', file)}
          />

          <ImagePickerInput
            label="Aadhaar Back Photo"
            onSelect={file => handleImageSelect('aadhaarBack', file)}
          />

          <ImagePickerInput
            label="Police Verification Photo"
            onSelect={file => handleImageSelect('policeVerification', file)}
          />

          {/* References */}
          <Typography
            variant="heading"
            weight="bold"
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
          <View style={{ marginTop: 20 }}>
            <AppButton title="Submit Profile" onPress={handleSubmit} />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ProfileScreen;