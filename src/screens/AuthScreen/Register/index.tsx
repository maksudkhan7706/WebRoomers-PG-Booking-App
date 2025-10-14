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

type RegisterNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.REGISTER
>;
type RegisterRouteProp = RouteProp<
  RootStackParamList,
  typeof NAV_KEYS.REGISTER
>;

interface RegisterProps {
  navigation: RegisterNavProp;
  route: RegisterRouteProp;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [data, setData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<typeof data>>({});
  const [isActive, setIsActive] = useState(false);

  const handleChange = (key: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleValidate = () => {
    const newErrors: Partial<typeof data> = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = 'Enter a valid email';
    if (!data.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!data.password.trim()) newErrors.password = 'Password is required';
    else if (data.password.length < 6)
      newErrors.password = 'Min 6 characters required';
    if (data.confirmPassword !== data.password)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const filled = Object.values(data).some(v => v.trim().length > 0);
    setIsActive(filled);
  }, [data]);

  const handleRegister = () => {
    if (handleValidate()) {
      navigation.navigate(NAV_KEYS.LOGIN, {});
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" showBack containerStyle={styles.headerContainer} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
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
            value={data.fullName}
            onChangeText={t => handleChange('fullName', t)}
            error={errors.fullName}
          />

          <AppTextInput
            placeholder="Email Address"
            keyboardType="email-address"
            value={data.email}
            onChangeText={t => handleChange('email', t)}
            error={errors.email}
          />

          <AppTextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={data.mobile}
            onChangeText={t => handleChange('mobile', t)}
            error={errors.mobile}
          />

          <AppTextInput
            placeholder="Password"
            secureTextEntry
            value={data.password}
            onChangeText={t => handleChange('password', t)}
            error={errors.password}
          />

          <AppTextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={data.confirmPassword}
            onChangeText={t => handleChange('confirmPassword', t)}
            error={errors.confirmPassword}
          />

          <AppButton
            title="Register"
            onPress={handleRegister}
            disabled={!isActive}
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
              activeOpacity={0.8}
              onPress={() => navigation.navigate(NAV_KEYS.LOGIN, {})}
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