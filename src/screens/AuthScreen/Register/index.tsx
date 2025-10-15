import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NAV_KEYS } from '../../../navigation/NavKeys';
import colors from '../../../constants/colors';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import images from '../../../assets/images';
import Typography from '../../../ui/Typography';
import AppButton from '../../../ui/AppButton';
import AppTextInput from '../../../ui/AppTextInput';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { registerUser, sendOtp } from '../../../store/authSlice';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';

const Register: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const role = route.params?.role ?? 'user';
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(
      fullName.trim().length > 0 &&
        email.trim().length > 0 &&
        mobile.trim().length > 0 &&
        password.trim().length > 0 &&
        confirmPassword.trim().length > 0,
    );
  }, [fullName, email, mobile, password, confirmPassword]);

  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Enter a valid email address';
    if (!mobile) newErrors.mobile = 'Mobile number is required';
    else if (mobile.length < 10) newErrors.mobile = 'Enter valid mobile number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirm Password is required';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!handleValidate()) return;

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password: confirmPassword,
        user_type: role,
        company_id: '35',
      };

      console.log('Register payload ===>', payload);

      // ---------------- Register ----------------
      const resultAction = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(resultAction)) {
        const data = resultAction.payload;

        if (data.success) {
          showSuccessMsg(data.message || 'Registered successfully!');

          // ---------------- Send OTP via Redux ----------------
          const otpPayload = {
            email: email.trim(),
            mobile_number: mobile.trim(),
          };

          try {
            const otpResponse = await dispatch(sendOtp(otpPayload)).unwrap();
            console.log('otpResponse ============>>>>>', otpResponse?.otp);

            if (otpResponse.success) {
              showSuccessMsg('OTP sent to your email');
              navigation.navigate(NAV_KEYS.EmailVerification, {
                email,
                otp: otpResponse.otp,
                role,
                mobile_number: mobile.trim(),
                full_name: fullName.trim(),
              });
            } else {
              showErrorMsg(otpResponse.message || 'Failed to send OTP');
            }
          } catch (otpErr: any) {
            console.log('OTP Error ===>', otpErr);
            showErrorMsg('Failed to send OTP');
          }
        } else {
          showErrorMsg(data.message || 'Registration failed');
        }
      } else {
        showErrorMsg('Something went wrong');
      }
    } catch (err) {
      console.log('Register Error ===>', err);
      showErrorMsg('Error: Something went wrong');
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
          <Image source={images.TransparentWebRoomerLogo} style={styles.logo} />
          <Typography
            variant="heading"
            weight="bold"
            color={colors.mainColor}
            style={styles.titleText}
          >
            Register
          </Typography>
          <Typography
            variant="body"
            weight="light"
            color={colors.mainColor}
            style={styles.subtitleText}
          >
            Register using your details.
          </Typography>

          <AppTextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
          />
          <AppTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
          />
          <AppTextInput
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            error={errors.mobile}
            keyboardType="number-pad"
            maxLength={10}
          />
          <AppTextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
          <AppTextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <AppButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
            disabled={!isActive || loading}
          />

          <View style={styles.loginContainer}>
            <Typography
              variant="label"
              weight="regular"
              color={colors.mainColor}
            >
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity
              onPress={() => navigation.navigate(NAV_KEYS.LOGIN, { role })}
            >
              <Typography
                variant="label"
                weight="medium"
                color={colors.mainColor}
                style={styles.loginText}
              >
                Login
              </Typography>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Register;
