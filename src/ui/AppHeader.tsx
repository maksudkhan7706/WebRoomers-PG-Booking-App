import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from './Typography';
import colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NAV_KEYS, RootStackParamList } from '../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppImage from './AppImage';
import images from '../assets/images';

type HeaderNavprop = NativeStackNavigationProp<RootStackParamList>;

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backIconColor?: string;
  onRightIconPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  leftIcon,
  rightIcon,
  containerStyle,
  titleStyle,
  backIconColor = colors.black,
  onRightIconPress,
}) => {
  const navigation = useNavigation<HeaderNavprop>();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.viewOfIcons}>
        {showBack ? (
          <TouchableOpacity hitSlop={15} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={backIconColor} />
          </TouchableOpacity>
        ) : (
          <AppImage
            source={images.TransparentWebRoomerLogo}
            style={{ width: 100, height: 60, right: 10 }}
            resizeMode="cover"
          />
        )}
      </View>
      {/* Title */}
      <Typography
        style={[styles.title, titleStyle, { marginRight: rightIcon ? 60 : 0 }]}
      >
        {title}
      </Typography>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(NAV_KEYS.ProfileScreen);
        }}
        style={styles.viewOfIcons}
      >
        {rightIcon}
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(AppHeader);

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: colors.mainColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: colors.mainColor,
  },
  viewOfIcons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
