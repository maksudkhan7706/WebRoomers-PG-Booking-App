import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Modal,
  Animated,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfilePhotoPicker from '../../../../ui/ProfilePhotoPicker';
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
import {
  apiUserDataFetch,
  fetchAllUserPermissions,
} from '../../../../store/mainSlice';
import { hasPermission } from '../../../../utils/permissions';
import AccessDeniedModal from '../../../../ui/AccessDeniedModal';
import { menuItems } from '../../../../constants/dummyData';
import { PLAY_STORE_URL } from '../../../../services/urlHelper';
import AppButton from '../../../../ui/AppButton';

const ProfileMenuSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const { userData, userRole } = useSelector((state: RootState) => state.auth);
  const isFocused = useIsFocused();
  const { apiUserData, userAllPermissions } = useSelector(
    (state: RootState) => state.main,
  );
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');
  //Fetch latest user info and permissions from API
  useEffect(() => {
    if (userData?.user_id && userData?.company_id) {
      dispatch(
        apiUserDataFetch({
          user_id: userData.user_id,
          company_id: userData.company_id,
        }),
      );
      dispatch(
        fetchAllUserPermissions({
          company_id: userData.company_id,
        }),
      );
    }
  }, [isFocused, dispatch, userData]);

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeLogoutModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLogoutModalVisible(false);
      callback?.();
    });
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
  // Handle navigation
  const handleMenuPress = (item: any) => {
    if (item.navKey === 'SHARE_APP') {
      Linking.openURL(PLAY_STORE_URL).catch(() =>
        showSuccessMsg('Unable to open Play Store.'),
      );
      return;
    }
    if (item.navKey === 'ENQUIRY') {
      if (userRole === 'user') {
        navigation.navigate(NAV_KEYS.UserEnquiryScreen);
        return;
      }
      if (userRole === 'landlord') {
        // Landlord role -> permission check
        if (
          !hasPermission(userData, apiUserData, 'enquiry', userAllPermissions)
        ) {
          setAccessMessage('You do not have permission to view Enquiries.');
          setShowAccessDenied(true);
          return;
        }
        navigation.navigate(NAV_KEYS.LandlordEnquiryScreen);
        return;
      }
      // Unknown role
      setAccessMessage('Unable to identify user role.');
      setShowAccessDenied(true);
      return;
    }
    if (item.navKey === 'BANK_DETAILS') {
      navigation.navigate(NAV_KEYS.LandlordBankDetailScreen);
      return;
    }
    if (item.navKey) {
      navigation.navigate(item.navKey);
    }
  };

  const computedMenuItems = useMemo(() => {
    if (userRole === 'landlord') {
      const bankDetailsItem = {
        id: 999,
        title: 'Bank Details',
        icon: 'credit-card',
        navKey: 'BANK_DETAILS',
      };
      const [firstItem, ...rest] = menuItems;
      return [firstItem, bankDetailsItem, ...rest];
    }
    return menuItems;
  }, [userRole]);

  // Memoize profile photo value to prevent unnecessary re-renders and blinking
  // Use ref to persist value during API refetch when apiUserData temporarily becomes null
  const profilePhotoRef = useRef<string | null>(null);
  const profilePhoto = useMemo(() => {
    const photo =
      apiUserData?.data?.profile_photo || apiUserData?.data?.profile_image;
    if (photo && photo !== 'null' && photo !== '') {
      profilePhotoRef.current = photo;
      return photo;
    }
    // If apiUserData exists but no photo, return null
    // If apiUserData is null (during refetch), return last known value
    if (apiUserData === null) {
      return profilePhotoRef.current;
    }
    return null;
  }, [
    apiUserData?.data?.profile_photo,
    apiUserData?.data?.profile_image,
    apiUserData,
  ]);

  // Memoize userName with ref persistence to prevent blinking during refetch
  const userNameRef = useRef<string>('User Name');
  const userName = useMemo(() => {
    const name = apiUserData?.data?.user_fullname;
    if (name && name.trim() !== '') {
      userNameRef.current = name;
      return name;
    }
    // If apiUserData is null (during refetch), return last known value
    if (apiUserData === null) {
      return userNameRef.current;
    }
    return userNameRef.current;
  }, [apiUserData?.data?.user_fullname, apiUserData]);

  // Memoize user email with ref persistence to prevent blinking during refetch
  const userEmailRef = useRef<string>('user@email.com');
  const userEmail = useMemo(() => {
    const email = apiUserData?.data?.user_email;
    if (email && email.trim() !== '') {
      userEmailRef.current = email;
      return email;
    }
    // If apiUserData is null (during refetch), return last known value
    if (apiUserData === null) {
      return userEmailRef.current;
    }
    return userEmailRef.current;
  }, [apiUserData?.data?.user_email, apiUserData]);

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" rightIcon={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section with Modern Design */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileContent}>
              <ProfilePhotoPicker
                value={profilePhoto}
                userName={userName}
                readOnly={true}
                size={68}
                containerStyle={{ marginBottom: 0, marginRight: 16 }}
              />
              <View style={styles.profileDetails}>
                <Typography
                  variant="subheading"
                  weight="bold"
                  style={styles.profileName}
                >
                  {userName}
                </Typography>
                <Typography variant="label" style={styles.profileEmail}>
                  {userEmail}
                </Typography>
              </View>
            </View>
          </View>
        </View>
        {/* Menu List */}
        <View style={styles.menuContainer}>
          {computedMenuItems.map((item, index) => {
            return (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleMenuPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.iconContainer}>
                      <FontAwesome
                        name={item.icon}
                        size={20}
                        color={colors.mainColor}
                      />
                    </View>
                    <Typography
                      variant="body"
                      weight="medium"
                      color={colors.textDark}
                      style={styles.cardText}
                    >
                      {item.title}
                    </Typography>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={22}
                    color={colors.lightGary}
                  />
                </TouchableOpacity>
                {/* Extra Menu: Sub-user (only for landlord or users with permission) */}
                {userRole === 'user' ? null : (
                  <>
                    {item.title === 'Update Profile' && (
                      <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (
                            hasPermission(
                              userData,
                              apiUserData,
                              'subuser_list',
                              userAllPermissions,
                            )
                          ) {
                            navigation.navigate(NAV_KEYS.SubUserScreen);
                          } else {
                            setAccessMessage(
                              'You do not have permission to view the Sub-user list.',
                            );
                            setShowAccessDenied(true);
                          }
                        }}
                      >
                        <View style={styles.cardLeft}>
                          <View style={styles.iconContainer}>
                            <FontAwesome
                              name="users"
                              size={20}
                              color={colors.mainColor}
                            />
                          </View>
                          <Typography
                            variant="body"
                            weight="medium"
                            color={colors.textDark}
                            style={styles.cardText}
                          >
                            Sub-user
                          </Typography>
                        </View>
                        <Feather
                          name="chevron-right"
                          size={22}
                          color={colors.lightGary}
                        />
                      </TouchableOpacity>
                    )}
                    {item.title === 'Update Profile' && (
                      <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (
                            hasPermission(
                              userData,
                              apiUserData,
                              'tenant_list',
                              userAllPermissions,
                            )
                          ) {
                            navigation.navigate(NAV_KEYS.TenantsScreen);
                          } else {
                            setAccessMessage(
                              'You do not have permission to view Tenants.',
                            );
                            setShowAccessDenied(true);
                          }
                        }}
                      >
                        <View style={styles.cardLeft}>
                          <View style={styles.iconContainer}>
                            <FontAwesome
                              name="user-circle"
                              size={20}
                              color={colors.mainColor}
                            />
                          </View>
                          <Typography
                            variant="body"
                            weight="medium"
                            color={colors.textDark}
                            style={styles.cardText}
                          >
                            Tenants
                          </Typography>
                        </View>
                        <Feather
                          name="chevron-right"
                          size={22}
                          color={colors.lightGary}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <AppButton
            onPress={openLogoutModal}
            title="Logout"
            loading={loading}
            disabled={loading}
            titleIcon={
              <FontAwesome name="sign-out" size={20} color={colors.white} />
            }
            style={styles.logoutButton}
          />
        </View>

        <AccessDeniedModal
          visible={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          message={accessMessage}
        />
      </ScrollView>

      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="none"
        statusBarTranslucent
      >
        <Animated.View
          style={[styles.logoutModalBackdrop, { opacity: modalOpacity }]}
        >
          <Animated.View
            style={[
              styles.logoutModalCard,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.logoutIconWrap}>
              <FontAwesome name="sign-out" size={28} color="#fff" />
            </View>
            <Typography
              variant="body"
              weight="bold"
              style={styles.logoutModalTitle}
            >
              Logout?
            </Typography>
            <Typography variant="label" style={styles.logoutModalSubtitle}>
              Are you sure you want to logout from your account?
            </Typography>
            <View style={styles.logoutModalActions}>
              <AppButton
                title="Stay Logged In"
                style={styles.logoutCancelBtn}
                titleColor={colors.mainColor}
                onPress={() => closeLogoutModal()}
              />
              <AppButton
                title="Logout"
                onPress={() =>
                  closeLogoutModal(() => {
                    handleLogout();
                  })
                }
                loading={loading}
                disabled={loading}
                style={styles.logoutConfirmBtn}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default ProfileMenuSection;
