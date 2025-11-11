import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../../../store/authSlice';
import { showSuccessMsg } from '../../../../utils/appMessages';
import { NAV_KEYS } from '../../../../navigation/NavKeys';
import { appLog } from '../../../../utils/appLog';
import { RootState, AppDispatch } from '../../../../store';
import styles from './styles';
import { apiUserDataFetch } from '../../../../store/mainSlice';

// Menu items
const menuItems = [
  {
    id: 1,
    title: 'Update Profile',
    icon: 'user',
    navKey: NAV_KEYS.ProfileScreen,
  },
  {
    id: 2,
    title: 'Change Password',
    icon: 'lock',
    navKey: NAV_KEYS.ChangePasswordScreen,
  },
  {
    id: 3,
    title: 'Complaint',
    icon: 'exclamation-circle',
    navKey: 'COMPLAINT',
  }, // special case
  {
    id: 4,
    title: 'Privacy Policy',
    icon: 'shield',
    navKey: NAV_KEYS.PrivacyPolicyScreen,
  },
  {
    id: 5,
    title: 'Terms & Conditions',
    icon: 'file-text',
    navKey: NAV_KEYS.TermsConditionsScreen,
  },
  
];

const ProfileMenuSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector((state: RootState) => state.auth);
  const isFocused = useIsFocused();

  //Assuming you store user role in Redux
  const { userRole } = useSelector((state: RootState) => state.auth);
  // e.g., role = 'user' or 'landlord'


  //Fetch latest user info from API
  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      dispatch(
        apiUserDataFetch({
          user_id: userData.user_id,
          company_id: userData.company_id,
        }),
      );
    }
  }, [isFocused]);



  const confirmLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: handleLogout },
      ],
      { cancelable: true },
    );
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await dispatch(logoutUser());
      setLoading(false);
      showSuccessMsg('Logout successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: NAV_KEYS.ROLE_SELECT }],
      });
    } catch (error) {
      setLoading(false);
      appLog('Logout', 'error:', error);
    }
  };

  // 🔹 Handle navigation
  const handleMenuPress = (item: {
    id?: number;
    title?: string;
    icon?: string;
    navKey: any;
  }) => {
    if (item.navKey === 'COMPLAINT') {
      // userRole-based navigation
      if (userRole === 'landlord') {
        navigation.navigate(NAV_KEYS.LandlordComplaintScreen);
      } else {
        navigation.navigate(NAV_KEYS.UserComplaintScreen);
      }
      return;
    }

    if (item.navKey) {
      navigation.navigate(item.navKey);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Profile"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Icon */}
        <View style={styles.profileIconWrapper}>
          <FontAwesome name="user-circle" size={90} color={colors.mainColor} />
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.cardLeft}>
                <FontAwesome
                  name={item.icon}
                  size={20}
                  color={colors.mainColor}
                />
                <Typography style={styles.cardText}>{item.title}</Typography>
              </View>
              <Feather name="chevron-right" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, loading && { opacity: 0.7 }]}
          onPress={confirmLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <FontAwesome name="sign-out" size={20} color={colors.white} />
              <Typography style={styles.logoutText}>Logout</Typography>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileMenuSection;
