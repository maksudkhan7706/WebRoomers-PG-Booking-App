import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

const PGEnquiryScreen = () => {
  const [userFullName, setUserFullName] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userEmailAddress, setUserEmailAddress] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string[]>([]);
  const isActive = isAgreed;

  const propertyLocations = [
    { label: 'Delhi', value: 'delhi' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Bangalore', value: 'bangalore' },
  ];

  const propertyTypes = [
    { label: 'AC Room', value: 'ac' },
    { label: 'Non-AC Room', value: 'nonac' },
    { label: 'Double Sharing Room', value: 'double' },
    { label: 'Triple Sharing Room', value: 'triple' },
    { label: 'Dormitory (5+ sharing)', value: 'dorm' },
  ];

  const handleRegister = () => {
    console.log('Form submitted');
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
            data={propertyLocations}
            selectedValues={selectedLocation}
            onSelect={setSelectedLocation}
            showSearch={true}
          />

          <AppCustomDropdown
            label="Type of Property *"
            data={propertyTypes}
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
            style={{ marginTop: 50 }}
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PGEnquiryScreen;