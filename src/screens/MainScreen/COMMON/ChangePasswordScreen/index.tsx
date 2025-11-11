import React, { useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import colors from '../../../../constants/colors';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { appLog } from '../../../../utils/appLog';
import AppButton from '../../../../ui/AppButton';
import images from '../../../../assets/images';
import { updateChangePassword } from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/NavKeys';

type ChangePasswordScreenNavProp =
  NativeStackNavigationProp<RootStackParamList>;

const ChangePasswordScreen = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ChangePasswordScreenNavProp>();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 👁️ password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.currentPassword.trim())
      newErrors.currentPassword = 'Please enter current password';
    if (!form.newPassword.trim())
      newErrors.newPassword = 'Please enter new password';
    else if (form.newPassword.length < 6)
      newErrors.newPassword = 'Password must be at least 6 characters long';
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        user_id: userData?.user_id,
        current_password: form.currentPassword,
        new_password: form.confirmPassword,
      };
      const response = await dispatch(updateChangePassword(payload)).unwrap();
      appLog('onChangePassword', 'response', response);
      if (response?.success) {
        showSuccessMsg(response?.message);
        navigation.goBack();
      } else {
        showErrorMsg(response?.message);
      }
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      showErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Change Password" showBack />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'ios' ? 80 : 80}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          <View
            style={{
              height: 150,
        width: '100%',
              alignSelf: 'center',
              marginBottom: 30,
            }}
          >
            <Image
              source={images.NewAppLogo}
              style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            />
          </View>

          <Typography variant="body" style={styles.heading}>
            Change Your Password
          </Typography>

          {/* Current Password */}
          <AppTextInput
            label="Current Password *"
            placeholder="Enter current password"
            secureTextEntry={!showCurrent}
            value={form.currentPassword}
            onChangeText={text => setForm({ ...form, currentPassword: text })}
            error={errors.currentPassword}
            rightIcon={
              <Feather
                name={showCurrent ? 'eye' : 'eye-off'}
                size={20}
                color={colors.gray}
                onPress={() => setShowCurrent(!showCurrent)}
              />
            }
          />

          {/* New Password */}
          <AppTextInput
            label="New Password *"
            placeholder="Enter new password"
            secureTextEntry={!showNew}
            value={form.newPassword}
            onChangeText={text => setForm({ ...form, newPassword: text })}
            error={errors.newPassword}
            rightIcon={
              <Feather
                name={showNew ? 'eye' : 'eye-off'}
                size={20}
                color={colors.gray}
                onPress={() => setShowNew(!showNew)}
              />
            }
          />

          {/* Confirm Password */}
          <AppTextInput
            label="Confirm Password *"
            placeholder="Re-enter new password"
            secureTextEntry={!showConfirm}
            value={form.confirmPassword}
            onChangeText={text => setForm({ ...form, confirmPassword: text })}
            error={errors.confirmPassword}
            rightIcon={
              <Feather
                name={showConfirm ? 'eye' : 'eye-off'}
                size={20}
                color={colors.gray}
                onPress={() => setShowConfirm(!showConfirm)}
              />
            }
          />

          <AppButton
            title={loading ? 'Updating...' : 'Change Password'}
            onPress={onChangePassword}
            disabled={!form.currentPassword.trim() || loading}
            style={{
              marginTop: 20,
              opacity: !form.currentPassword.trim() || loading ? 0.6 : 1,
            }}
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ChangePasswordScreen;
