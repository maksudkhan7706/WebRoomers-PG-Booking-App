import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from './Typography';
import colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NAV_KEYS, RootStackParamList } from '../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLogo from './AppLogo';

type HeaderNavprop = NativeStackNavigationProp<RootStackParamList>;

interface AppHeaderProps {
  title: string;
  subtitle?: string;
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
  subtitle,
  showBack = false,
  leftIcon,
  rightIcon,
  containerStyle,
  titleStyle,
  backIconColor = colors.white,
  onRightIconPress,
}) => {
  const navigation = useNavigation<HeaderNavprop>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 10, 20) },
        containerStyle,
      ]}
    >
      <View style={styles.headerAccentOne} />
      <View style={styles.headerAccentTwo} />
      <View style={styles.headerTop}>
        <View style={styles.viewOfIcons}>
          {showBack ? (
            <TouchableOpacity
              hitSlop={15}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={20} color={backIconColor} />
            </TouchableOpacity>
          ) : leftIcon ? (
            leftIcon
          ) : (
            <AppLogo
              style={styles.headerLogo}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.titleContainer}>
          <Typography
            style={[styles.title, titleStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Typography>
          ) : null}
        </View>

        {rightIcon ?? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              onRightIconPress ||
              (() => navigation.navigate(NAV_KEYS.ProfileScreen))
            }
            style={styles.profileButton}
          >
            <FontAwesome name="user-circle-o" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(AppHeader);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.mainColor,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  headerAccentOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -60,
    right: -40,
  },
  headerAccentTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -40,
    left: -30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewOfIcons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: colors.white,
    padding: 6,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.8)',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
