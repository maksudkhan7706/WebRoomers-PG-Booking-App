import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import styles from './styles';
import AppTextInput from '../../../ui/AppTextInput';
import AppCustomDropdown from '../../../ui/AppCustomDropdown';
import AppButton from '../../../ui/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  fetchPgCategories,
  fetchPgCities,
  submitPgEnquiry,
} from '../../../store/mainSlice';
import { postEnquiry } from '../../../services/urlHelper';
import { showMessage } from 'react-native-flash-message';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';

const PGEnquiryScreen = () => {
  const { pgCategories, pgCities, loading } = useSelector(
    (state: any) => state.main,
  );
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: any) => state.auth);
  const [userFullName, setUserFullName] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userEmailAddress, setUserEmailAddress] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string[]>([]);
  const isActive = isAgreed;

  //Drop-down Apis
  useEffect(() => {
    // Dropdown API calls
    dispatch(fetchPgCategories({ company_id: userData?.company_id || '41' }));
    dispatch(fetchPgCities({ company_id: userData?.company_id || '41' }));
    //Default user details fill
    if (userData) {
      setUserFullName(userData?.user_fullname || '');
      setUserMobileNumber(userData?.user_mobile || '');
      setUserEmailAddress(userData?.user_email || '');
    }
  }, []);

  const handleRegister = async () => {
    try {
      //Only required fields check
      if (selectedLocation.length === 0 || selectedProperty.length === 0) {
        Alert.alert('Please select Property Location and Type of Property.');
        return;
      }
      const payload = {
        name: userFullName.trim(),
        mobile: userMobileNumber.trim(),
        email: userEmailAddress.trim(),
        city_id: selectedLocation[0],
        category_id: selectedProperty[0],
        message: userMessage.trim(),
        user_id: userData?.user_id || 1,
        company_id: userData?.company_id || 41,
      };
      console.log('Enquiry payload:', payload);
      const res = await dispatch(submitPgEnquiry(payload)).unwrap();
      if (res?.success) {
        showSuccessMsg('Enquiry submitted successfully!');
        //Reset only non-default fields
        setSelectedLocation([]);
        setSelectedProperty([]);
        setUserMessage('');
        setIsAgreed(false);
      } else {
        showErrorMsg(res?.message || 'Something went wrong.');
      }
    } catch (err: any) {
      showErrorMsg('Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Enquiry"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 80}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
        >
          <AppTextInput
            placeholder="Full Name"
            value={userFullName}
            onChangeText={t => setUserFullName(t)}
          />

          <AppTextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={userMobileNumber}
            onChangeText={t => setUserMobileNumber(t)}
          />

          <AppTextInput
            placeholder="Email Address"
            keyboardType="email-address"
            value={userEmailAddress}
            onChangeText={t => setUserEmailAddress(t)}
          />

          <AppCustomDropdown
            label="Property Location *"
            data={pgCities}
            selectedValues={selectedLocation}
            onSelect={setSelectedLocation}
            showSearch={true}
          />

          <AppCustomDropdown
            label="Type of Property *"
            data={pgCategories}
            selectedValues={selectedProperty}
            onSelect={setSelectedProperty}
          />

          <AppTextInput
            placeholder="Message"
            value={userMessage}
            onChangeText={t => setUserMessage(t)}
            multiline={true}
            inputHeight={100}
          />

          {/* Checkbox Section */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsAgreed(prev => !prev)}
            activeOpacity={0.8}
          >
            <FontAwesome
              name={isAgreed ? 'check-square' : 'square-o'}
              size={20}
              color={isAgreed ? colors.mainColor : '#888'}
            />
            <Typography variant="label" style={styles.checkboxText}>
              I agree to the Terms of Services and Privacy Policy.
            </Typography>
          </TouchableOpacity>

          <AppButton
            title="Submit Enquiry"
            onPress={handleRegister}
            disabled={!isActive}
            loading={loading}
            style={{ marginTop: 50 }}
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PGEnquiryScreen;
