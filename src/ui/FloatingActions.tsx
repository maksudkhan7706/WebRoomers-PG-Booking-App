import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../store';
import { appLog } from '../utils/appLog';
import { getSettings } from '../store/mainSlice';

const FloatingActions = () => {
  const [showOptions, setShowOptions] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { userRole, userData } = useSelector((state: RootState) => state.auth);
  const { settingsData } = useSelector((state: any) => state.main);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
    Animated.timing(animation, {
      toValue: showOptions ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    dispatch(getSettings({ company_id: userData?.company_id}));
  }, []);

  // const confirmLogout = () => {
  //   Alert.alert(
  //     'Logout Confirmation',
  //     'Are you sure you want to logout?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: handleLogout,
  //       },
  //     ],
  //     { cancelable: true },
  //   );
  // };

  // const handleLogout = async () => {
  //   try {
  //     toggleOptions();
  //     await dispatch(logoutUser());
  //     showSuccessMsg('Logout successfully');
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: NAV_KEYS.ROLE_SELECT }],
  //     });
  //   } catch (error) {
  //     appLog('Logout', 'error:', error);
  //   }
  // };

  // Animation styles (bottom to top distance)
  // const logoutStyle = {
  //   transform: [
  //     { scale: animation },
  //     {
  //       translateY: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [0, -60],
  //       }),
  //     },
  //   ],
  //   opacity: animation,
  // };

  const callStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60], // ☎️ Call (Logout ke upar)
        }),
      },
    ],
    opacity: animation,
  };

  const whatsappStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -120],
        }),
      },
    ],
    opacity: animation,
  };

  return (
    <>
      {showOptions && (
        <TouchableOpacity
          onPress={toggleOptions}
          activeOpacity={0.9}
          style={styles.overlay}
        />
      )}
      <View style={styles.container}>
        {userRole == 'landlord' ? null : (
          <>
            <Animated.View style={[styles.iconWrapper, whatsappStyle]}>
              <TouchableOpacity
                onPress={() => {
                  const whatsappNumber = settingsData?.whatsapp_number
                    ?.replace(/\s+/g, '') // space hata de
                    ?.replace('+', ''); // + symbol bhi hata de (wa.me me + nahi chalta)
                  if (whatsappNumber) {
                    Linking.openURL(`https://wa.me/${whatsappNumber}`);
                  } else {
                    appLog('FloatingActions', 'No WhatsApp number found');
                  }
                }}
                style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
              >
                <FontAwesome name="whatsapp" size={22} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.iconWrapper, callStyle]}>
              <TouchableOpacity
                onPress={() => {
                  const callNumber = settingsData?.mobile_number
                    ?.replace(/\s+/g, '')
                    ?.replace('+', '');
                  if (callNumber) {
                    Linking.openURL(`tel:+${callNumber}`);
                  } else {
                    appLog('FloatingActions', 'No mobile number found');
                  }
                }}
                style={[styles.actionBtn, { backgroundColor: '#1E90FF' }]}
              >
                <Feather name="phone-call" size={22} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        {/* Logout */}
        {/* <Animated.View style={[styles.iconWrapper, logoutStyle]}>
          <TouchableOpacity
            onPress={confirmLogout}
            style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View> */}

        {/* Main + Button */}
        <TouchableOpacity onPress={toggleOptions} style={styles.mainButton}>
          <FontAwesome
            name={showOptions ? 'close' : 'plus'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 120,
    right: 25,
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
  },
  actionBtn: {
    padding: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  mainButton: {
    backgroundColor: colors.mainColor,
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});

export default React.memo(FloatingActions);
