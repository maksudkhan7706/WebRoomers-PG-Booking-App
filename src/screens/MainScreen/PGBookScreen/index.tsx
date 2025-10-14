import React, { useState } from 'react';
import {
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import AppTextInput from '../../../ui/AppTextInput';
import AppCustomDropdown from '../../../ui/AppCustomDropdown';
import AppDatePicker from '../../../ui/AppDatePicker';
import AppButton from '../../../ui/AppButton';
import styles from './styles';

interface UserData {
  fullName: string;
  mobile: string;
  email: string;
}

interface Errors {
  selectedGender?: string;
  stayDuration?: string;
  numPersons?: string;
  foodPreference?: string;
  startDate?: string;
  endDate?: string;
}

const PGBookScreen: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [stayDuration, setStayDuration] = useState<string[]>([]);
  const [numPersons, setNumPersons] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const stayDurations = [
    { label: '1 Month', value: '1' },
    { label: '3 Months', value: '3' },
    { label: '6 Months', value: '6' },
    { label: '12 Months', value: '12' },
  ];

  const personCounts = [
    { label: '1 Person', value: '1' },
    { label: '2 Persons', value: '2' },
    { label: '3 Persons', value: '3' },
    { label: '4+ Persons', value: '4+' },
  ];

  const foodOptions = [
    { label: 'Veg', value: 'veg' },
    { label: 'Non-Veg', value: 'nonveg' },
    { label: 'Both', value: 'both' },
  ];

  const handleRegister = () => {
    const newErrors: Errors = {};
    if (selectedGender.length === 0)
      newErrors.selectedGender = 'Please select gender';
    if (stayDuration.length === 0)
      newErrors.stayDuration = 'Please select stay duration';
    if (numPersons.length === 0)
      newErrors.numPersons = 'Please select number of persons';
    if (foodPreference.length === 0)
      newErrors.foodPreference = 'Please select food preference';
    if (!startDate) newErrors.startDate = 'Please select start date';
    if (!endDate) newErrors.endDate = 'Please select end date';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // All valid
      console.log('Form Submitted', {
        userData,
        selectedGender,
        stayDuration,
        numPersons,
        foodPreference,
        startDate,
        endDate,
        userMessage,
      });
      Alert.alert('PG Booking Submitted Successfully!');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Book PG"
        showBack
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
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Non-editable user fields */}
          <AppTextInput
            placeholder="Full Name"
            value={'Maksud'}
            editable={false}
          />
          <AppTextInput
            placeholder="Mobile Number"
            value={'6376247706'}
            editable={false}
          />
          <AppTextInput
            placeholder="Email Address"
            value={'maksud.khan@gmail.com'}
            editable={false}
          />
          {/* Dropdowns with inline errors */}
          <AppCustomDropdown
            label="Select Gender *"
            data={genderOptions}
            selectedValues={selectedGender}
            onSelect={val => {
              setSelectedGender(val);
              if (val.length)
                setErrors(prev => ({ ...prev, selectedGender: '' }));
            }}
            error={errors.selectedGender}
          />

          <AppCustomDropdown
            label="Stay Duration *"
            data={stayDurations}
            selectedValues={stayDuration}
            onSelect={val => {
              setStayDuration(val);
              if (val.length)
                setErrors(prev => ({ ...prev, stayDuration: '' }));
            }}
            error={errors.stayDuration}
          />

          <AppCustomDropdown
            label="Number of Persons *"
            data={personCounts}
            selectedValues={numPersons}
            onSelect={val => {
              setNumPersons(val);
              if (val.length) setErrors(prev => ({ ...prev, numPersons: '' }));
            }}
            error={errors.numPersons}
          />

          <AppCustomDropdown
            label="Food Preference *"
            data={foodOptions}
            selectedValues={foodPreference}
            onSelect={val => {
              setFoodPreference(val);
              if (val.length)
                setErrors(prev => ({ ...prev, foodPreference: '' }));
            }}
            error={errors.foodPreference}
          />

          {/* DatePickers with inline errors */}
          <AppDatePicker
            placeholder="Start Date"
            date={startDate}
            onDateChange={d => {
              setStartDate(d);
              setErrors(prev => ({ ...prev, startDate: '' }));
            }}
            error={errors.startDate}
          />

          <AppDatePicker
            placeholder="End Date"
            date={endDate}
            onDateChange={d => {
              setEndDate(d);
              setErrors(prev => ({ ...prev, endDate: '' }));
            }}
            error={errors.endDate}
          />
          {/* Message input */}
          <AppTextInput
            placeholder="Your Message"
            value={userMessage}
            onChangeText={setUserMessage}
            multiline
            inputHeight={100}
          />

          <AppButton
            title="Submit"
            onPress={handleRegister}
            style={{ marginTop: 70 }}
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PGBookScreen;