import React, { useState } from 'react';
import {
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../constants/colors';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import AppDatePicker from '../../../../ui/AppDatePicker';
import AppButton from '../../../../ui/AppButton';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../../store';
import { bookRoomApi } from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

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

const UserPGBookScreen: React.FC<{ userData: UserData }> = ({}) => {
  // Inside component
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { roomId, pgId, companyId, screenType, genderType } =
    (route.params as any) || {};
  const { userData } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.main);
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

  const handleRegister = async () => {
    const newErrors: Errors = {};

    if (genderType === 'Both' && selectedGender.length === 0)
      newErrors.selectedGender = 'Please select gender';
    if (foodPreference.length === 0)
      newErrors.foodPreference = 'Please select food preference';
    if (!startDate) newErrors.startDate = 'Please select start date';
    if (!endDate) newErrors.endDate = 'Please select end date';
    if (startDate && endDate && endDate < startDate)
      newErrors.endDate = 'End Date cannot be before Start Date';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const genderValue =
          genderType === 'Both'
            ? selectedGender[0]
            : genderType === 'Boys'
            ? 'male'
            : genderType === 'Girls'
            ? 'female'
            : '';

        const payload = {
          pg_id: screenType === 'isRoom' ? roomId : pgId,
          company_id: companyId,
          user_id: userData?.user_id,
          name: userData?.user_fullname,
          mobile: userData?.user_mobile,
          email: userData?.user_email,
          gender: genderValue,
          no_of_persons: '1',
          food_preference: foodPreference[0],
          check_in_date: startDate?.toISOString().split('T')[0],
          check_out_date: endDate?.toISOString().split('T')[0],
          type: screenType === 'isRoom' ? 'room' : 'pg',
          ...(screenType === 'isRoom' && { room_id: roomId }),
          ...(userMessage?.trim() && { message: userMessage.trim() }),
        };

        const res = await dispatch(bookRoomApi(payload)).unwrap();
        appLog('UserPGBookScreen', 'payload sending:', payload);
        appLog('UserPGBookScreen', 'API response:', res);

        if (res?.success) {
          showSuccessMsg(res.message);
          navigation.goBack();
        } else {
          showErrorMsg(res?.message || 'Something went wrong');
        }
      } catch (err: any) {
        appLog('UserPGBookScreen', 'Booking Error:', err);
        showErrorMsg('Booking failed. Please try again.');
      }
    }
  };

  appLog('UserPGBookScreen', 'genderType', genderType);

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
            value={userData.user_fullname || ''}
            editable={false}
          />
          <AppTextInput
            placeholder="Mobile Number"
            value={userData.user_mobile || ''}
            editable={false}
          />
          <AppTextInput
            placeholder="Email Address"
            value={userData.user_email || ''}
            editable={false}
          />
          {/* Gender Selection */}
          {genderType === 'Both' ? (
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
          ) : (
            <AppCustomDropdown
              label="Gender"
              data={genderOptions}
              selectedValues={[
                genderType === 'Boys'
                  ? 'male'
                  : genderType === 'Girls'
                  ? 'female'
                  : '',
              ]}
              editable={false} // 👈 user cannot change
            />
          )}

          {/* <AppCustomDropdown
            label="Stay Duration *"
            data={stayDurations}
            selectedValues={stayDuration}
            onSelect={val => {
              setStayDuration(val);
              if (val.length)
                setErrors(prev => ({ ...prev, stayDuration: '' }));
            }}
            error={errors.stayDuration}
          /> */}
          {/* <AppCustomDropdown
            label="Number of Persons *"
            data={personCounts}
            selectedValues={numPersons}
            onSelect={val => {
              setNumPersons(val);
              if (val.length) setErrors(prev => ({ ...prev, numPersons: '' }));
            }}
            error={errors.numPersons}
          /> */}
          <AppTextInput
            placeholder="Number of Persons"
            value={'1 Person'}
            editable={false}
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
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flex: 1 }}>
              <AppDatePicker
                placeholder="Start Date"
                date={startDate}
                onDateChange={d => {
                  setStartDate(d);
                  setErrors(prev => ({ ...prev, startDate: '' }));
                  //Automatically set End Date = Start Date + 30 days
                  const nextMonthDate = new Date(d);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 30);
                  setEndDate(nextMonthDate);
                }}
                error={errors.startDate}
                minimumDate={new Date()} // Back date disabled
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View style={{ width: 10 }} />

            <View style={{ flex: 1 }}>
              {/* End Date readonly bana diya */}
              <AppDatePicker
                placeholder="End Date"
                date={endDate}
                onDateChange={() => {}} // No manual change
                disabled={true} // ✅ Readonly mode
                containerStyle={{ flex: 1 }}
                error={errors.endDate}
              />
            </View>
          </View>

          {/* Message input */}
          <AppTextInput
            placeholder="Your Message"
            value={userMessage || ''}
            onChangeText={setUserMessage}
            multiline
            inputHeight={100}
          />

          <AppButton
            title="Submit"
            onPress={handleRegister}
            style={{ marginTop: 70 }}
            loading={loading}
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default UserPGBookScreen;
