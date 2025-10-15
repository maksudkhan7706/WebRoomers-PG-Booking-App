import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, NAV_KEYS } from '../../../navigation/NavKeys';
import colors from '../../../constants/colors';
import AppHeader from '../../../ui/AppHeader';
import images from '../../../assets/images';
import Typography from '../../../ui/Typography';
import AppButton from '../../../ui/AppButton';
import AppTextInput from '../../../ui/AppTextInput';
import styles from './styles';

type ForgotNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.LOGIN
>;
type ForgotRouteProp = RouteProp<RootStackParamList, typeof NAV_KEYS.LOGIN>;

interface ForgotProps {
  navigation: ForgotNavProp;
  route: ForgotRouteProp;
}

const ForgotPassword: React.FC<ForgotProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isActive, setIsActive] = useState(false);

  const handleValidate = () => {
    const newErrors: { email?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Enter a valid email address';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsActive(email.trim().length > 0);
  }, [email]);

  const handleSubmit = () => {
    if (handleValidate()) {
      // TODO: API call for forgot password
      console.log('Submit email:', email);
      navigation.navigate(NAV_KEYS.LOGIN, {});
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
          align="center"
          color={colors.mainColor}
          style={styles.titleText}
        >
          Forgot Password
        </Typography>
        <Typography
          variant="body"
          weight="light"
          align="center"
          color={colors.mainColor}
          style={styles.subtitleText}
        >
          You can get your password here.
        </Typography>

        <AppTextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
        />

        <AppButton title="Submit" onPress={handleSubmit} disabled={!isActive} />

        <View style={styles.registerContainer}>
          <Typography variant="label" weight="regular" color={colors.mainColor}>
            Already have an Account?{''}
          </Typography>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(NAV_KEYS.LOGIN, { role: 'user' })
            }
          >
            <Typography
              variant="label"
              weight="medium"
              color={colors.mainColor}
              style={styles.registerText}
            >
              Login
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={[styles.registerContainer, { marginTop: 10 }]}>
          <Typography variant="label" weight="regular" color={colors.mainColor}>
            Not have an Account?{''}
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
              Register now
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
