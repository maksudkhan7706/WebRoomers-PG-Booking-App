import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Linking,
  StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/colors';

const FloatingActions = () => {
  const [showOptions, setShowOptions] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    Animated.timing(animation, {
      toValue: showOptions ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const callStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
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
  const inquiryStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -180],
        }),
      },
    ],
    opacity: animation,
  };

  return (
    <>
      {/* Overlay */}
      {showOptions && (
        <TouchableOpacity
          onPress={toggleOptions}
          activeOpacity={0.9}
          style={styles.overlay}
        />
      )}

      <View style={styles.container}>
        {/* Inquiry */}
        {/* <Animated.View style={[styles.iconWrapper, inquiryStyle]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.mainColor }]}
          >
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View> */}

        {/* WhatsApp */}
        <Animated.View style={[styles.iconWrapper, whatsappStyle]}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/919876543210')}
            style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
          >
            <FontAwesome name="whatsapp" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Call */}
        <Animated.View style={[styles.iconWrapper, callStyle]}>
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:+919876543210')}
            style={[styles.actionBtn, { backgroundColor: '#1E90FF' }]}
          >
            <Feather name="phone-call" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

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