import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, NAV_KEYS } from '../../../navigation/NavKeys';
import colors from '../../../constants/colors';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import Typography from '../../../ui/Typography';
import AppButton from '../../../ui/AppButton';
import AppTextInput from '../../../ui/AppTextInput';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';
import { AppDispatch } from '../../../store';
import { useDispatch } from 'react-redux';
import { registerUser, reSendOtp } from '../../../store/authSlice';
import { appLog } from '../../../utils/appLog';
import AppLogo from '../../../ui/AppLogo';

type EmailVerificationNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.EmailVerification
>;
type EmailVerificationRouteProp = RouteProp<
  RootStackParamList,
  typeof NAV_KEYS.EmailVerification
>;

interface Props {
  navigation: EmailVerificationNavProp;
  route: EmailVerificationRouteProp;
}

const EmailVerification: React.FC<Props> = ({ navigation, route }) => {
  const { email, otp, role, mobile_number, full_name, registerPayload } =
    route.params || {};

  const [enteredOtp, setEnteredOtp] = useState('');
  const [currentOtp, setCurrentOtp] = useState(otp);
  const dispatch = useDispatch<AppDispatch>();

  const handleVerify = async () => {
    if (!enteredOtp.trim()) {
      showErrorMsg('Please enter OTP');
      return;
    }

    if (enteredOtp.trim() === String(currentOtp)) {
      try {
        //OTP verified, and user register
        const resultAction = await dispatch(
          registerUser(registerPayload),
        ).unwrap();
        if (resultAction.success) {
          showSuccessMsg(
            resultAction?.message ||
              'Email verified & registration successful!',
          );
          navigation.navigate(NAV_KEYS.LOGIN, { role });
        } else {
          showErrorMsg(resultAction.message || 'Registration failed');
        }
      } catch (err) {
        showErrorMsg('Something went wrong during registration');
      }
    } else {
      showErrorMsg('Invalid OTP! Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!email || !mobile_number || !full_name) return;

    const payload = {
      email,
      mobile_number,
      full_name,
    };

    try {
      const resultAction = await dispatch(reSendOtp(payload)).unwrap();
      if (resultAction.success) {
        showSuccessMsg('OTP re-sent successfully!');
        setCurrentOtp(resultAction.otp); //update current OTP
      } else {
        showErrorMsg(resultAction.message || 'Failed to re-send OTP');
      }
    } catch (err: any) {
      appLog('EmailVerification', 'Re-send OTP Error ===>', err);
      showErrorMsg('Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" showBack containerStyle={styles.headerContainer} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 100}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.innerContainer}
        >
          <AppLogo
            containerStyle={{
              height: 300,
              width: '100%',
              alignSelf: 'center',
              marginTop: -100,
            }}
          />

          <View style={{ marginTop: -40 }}>
            <Typography
              variant="heading"
              weight="bold"
              color={colors.mainColor}
              style={styles.titleText}
            >
              Verify your Email Address
            </Typography>

            <Typography
              variant="body"
              weight="light"
              color={colors.mainColor}
              style={styles.subtitleText}
            >
              {email}
            </Typography>
            {currentOtp ? (
              <Typography
                variant="body"
                weight="bold"
                color={colors.gray}
                style={{ marginBottom: 15, marginTop: 10, textAlign: 'center' }}
              >
                OTP: {currentOtp}
              </Typography>
            ) : null}

            <AppTextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={enteredOtp}
              onChangeText={setEnteredOtp}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginBottom: 20 }}
              onPress={handleResendOtp}
            >
              <Typography
                variant="body"
                weight="light"
                align="right"
                color={colors.mainColor}
                style={{
                  textDecorationLine: 'underline',
                }}
              >
                Re-send OTP
              </Typography>
            </TouchableOpacity>

            <AppButton
              title="Verify & Continue"
              onPress={handleVerify}
              disabled={!enteredOtp.trim()}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default EmailVerification;
