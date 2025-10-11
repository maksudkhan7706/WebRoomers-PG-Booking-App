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

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backIconColor?: string;
  onRightIconPress?: () => void
} 

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  leftIcon,
  rightIcon,
  containerStyle,
  titleStyle,
  backIconColor = colors.black,
  onRightIconPress
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.viewOfIcons}>
        {showBack && (
          <TouchableOpacity hitSlop={15} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={backIconColor} />
          </TouchableOpacity>
        )}
        {leftIcon}
      </View>
      {/* Title */}
      <Typography
        style={[styles.title, titleStyle, { marginRight: rightIcon ? 20 : 0 }]}
      >
        {title}
      </Typography>
      <TouchableOpacity activeOpacity={0.8} onPress={onRightIconPress} style={styles.viewOfIcons}>{rightIcon}</TouchableOpacity>
    </View>
  );
};

export default React.memo(AppHeader);

const styles = StyleSheet.create({
  container: {
    height: 70,
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
