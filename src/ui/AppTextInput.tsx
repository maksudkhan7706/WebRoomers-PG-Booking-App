import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import colors from '../constants/colors';
import Typography from './Typography';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  rightIcon?: React.ReactNode;
  inputHeight?: number; // custom height for multiline
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  error,
  style,
  containerStyle,
  rightIcon,
  inputHeight,
  multiline = false,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          variant="caption"
          weight="medium"
          color={colors.textDark}
          style={styles.label}
        >
          {label}
        </Typography>
      )}

      {/* Input Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
          multiline && {
            alignItems: 'flex-start',
            minHeight: inputHeight || 100,
            paddingVertical: 0,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.gray}
          style={[
            styles.input,
            style,
            multiline && {
              textAlignVertical: 'top',
              paddingVertical: 0,
              minHeight: inputHeight || 100,
            },
          ]}
          multiline={multiline}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error && (
        <Typography variant="caption" color={colors.error} style={styles.error}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  iconContainer: {
    marginLeft: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: 4,
  },
});

export default React.memo(AppTextInput);