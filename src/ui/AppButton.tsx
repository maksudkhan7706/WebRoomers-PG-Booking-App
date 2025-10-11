import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import colors from '../constants/colors';
import Typography from './Typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.btn,
          style,
          { transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <Typography variant="body" weight="medium" color={colors.white}>
          {title}
        </Typography>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.mainColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
  },
});

export default AppButton;