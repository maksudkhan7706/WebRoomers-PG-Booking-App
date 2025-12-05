import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import colors from '../constants/colors';
import Typography from './Typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  titleSize?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  titleIcon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gap?: number;
  titleColor?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  titleSize = 'body',
  titleIcon,
  iconPosition = 'left',
  gap = 8,
  titleColor = colors.white,
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
      disabled={disabled || loading} // disable while loading
    >
      <Animated.View
        style={[
          styles.btn,
          style,
          { transform: [{ scale }], opacity: disabled || loading ? 0.5 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <View style={[styles.content, { gap }]}>
            {titleIcon && iconPosition === 'left' ? titleIcon : null}
            <Typography variant={titleSize} weight="medium" numberOfLines={1} color={titleColor}>
              {title}
            </Typography>
            {titleIcon && iconPosition === 'right' ? titleIcon : null}
          </View>
        )}
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(AppButton);
