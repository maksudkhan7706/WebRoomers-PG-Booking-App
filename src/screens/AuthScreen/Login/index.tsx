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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, NAV_KEYS } from '../../../navigation/NavKeys';
import colors from '../../../constants/colors';
import styles from './styles';
import AppHeader from '../../../ui/AppHeader';
import images from '../../../assets/images';
import Typography from '../../../ui/Typography';
import AppButton from '../../../ui/AppButton';
import AppTextInput from '../../../ui/AppTextInput';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { loginUser } from '../../../store/authSlice';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';

type LoginNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.LOGIN
>;
type LoginRouteProp = RouteProp<RootStackParamList, typeof NAV_KEYS.LOGIN>;

interface LoginProps {
  navigation: LoginNavProp;
  route: LoginRouteProp;
  setIsAuth: (val: boolean) => void;
}

const Login: React.FC<LoginProps & { setRole: (role: string) => void }> = ({
  navigation,
  route,
}) => {
  const role = route.params?.role ?? 'user';
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(email.trim().length > 0 || password.trim().length > 0);
  }, [email, password]);

  const handleValidate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedValue = email.trim();
    //Email & Phone Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!trimmedValue) {
      newErrors.email = 'Email or Mobile number is required';
    } else if (emailRegex.test(trimmedValue)) {
      // Valid email → no error
    } else if (phoneRegex.test(trimmedValue)) {
      // Valid 10-digit phone number → no error
    } else if (/^[0-9]+$/.test(trimmedValue)) {
      //  Only digits but not exactly 10
      newErrors.email = 'Mobile number must be exactly 10 digits';
    } else {
      //Invalid email format
      newErrors.email = 'Enter a valid email address';
    }
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    //Returns true if no validation errors
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!handleValidate()) return;
    try {
      const payload = {
        email_mobile: email.trim(),
        password: password,
        company_id: '35',
        role,
      };
      const resultAction = await dispatch(loginUser(payload));
      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        if (userData?.success) {
          showSuccessMsg(userData?.message || 'Successfully logged in.');
        } else {
          //Role mismatch ya API fail message
          showErrorMsg(userData?.message || 'Login Failed');
          navigation.goBack();
        }
      } else {
        showErrorMsg('Login Failed');
      }
    } catch (err) {
      showErrorMsg('Login Error Something went wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" showBack containerStyle={styles.headerContainer} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 80}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.innerContainer}
        >
          <View
            style={{
              height: 180,
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <Image
              source={images.NewAppLogo}
              style={[
                {
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                },
              ]}
            />
          </View>

          <Typography
            variant="heading"
            weight="bold"
            color={colors.mainColor}
            style={styles.titleText}
          >
            Login
          </Typography>

          <Typography
            variant="body"
            weight="light"
            color={colors.mainColor}
            style={styles.subtitleText}
          >
            Login using your details.
          </Typography>

          <AppTextInput
            placeholder="Email / Mobile Number"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="default"
          />

          <AppTextInput
            placeholder="Enter Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.forgotContainer}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(NAV_KEYS.FORGOTPASSWORD, { role })
            }
          >
            <Typography
              variant="label"
              weight="medium"
              color={colors.mainColor}
              align="right"
            >
              Forgot Password?
            </Typography>
          </TouchableOpacity>

          <AppButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            disabled={!isActive || loading}
          />

          <View style={styles.registerContainer}>
            <Typography
              variant="label"
              weight="regular"
              color={colors.mainColor}
            >
              Not have an Account?{' '}
            </Typography>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate(NAV_KEYS.REGISTER, { role })}
            >
              <Typography
                variant="label"
                weight="medium"
                color={colors.mainColor}
                style={styles.registerText}
              >
                Register Now
              </Typography>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Login;
