import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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
  setIsAuth,
  setRole,
}) => {
  const role = route.params?.role ?? 'USER';
  console.log('login role ========>>>>', role);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleValidate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email or phone is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsActive(email.trim().length > 0 || password.trim().length > 0);
  }, [email, password]);

  const handleLogin = () => {
    if (handleValidate()) {
      setRole(role);
      setIsAuth(true);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" showBack containerStyle={styles.headerContainer} />

      <View style={styles.innerContainer}>
        <Image source={images.TransparentWebRoomerLogo} style={styles.logo} />
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
          keyboardType="email-address"
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
          onPress={() => navigation.navigate(NAV_KEYS.FORGOTPASSWORD)}
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

        <AppButton title="Login" onPress={handleLogin} disabled={!isActive} />

        <View style={styles.registerContainer}>
          <Typography variant="label" weight="regular" color={colors.mainColor}>
            Not have an Account?{' '}
          </Typography>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(NAV_KEYS.REGISTER)}
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
      </View>
    </View>
  );
};

export default Login;
