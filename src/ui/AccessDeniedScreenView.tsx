import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Typography from '../ui/Typography';
import colors from '../constants/colors';

interface AccessDeniedScreenViewProps {
  message?: string;
  onBackPress?: () => void;
}

const AccessDeniedScreenView: React.FC<AccessDeniedScreenViewProps> = ({
  message = 'Your account doesn’t have access to this feature.',
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Feather
          name="lock"
          size={40}
          color={colors.error}
          style={styles.icon}
        />

        <Typography weight="bold" variant="subheading" style={styles.title}>
          Access Denied
        </Typography>

        <Typography variant="body" style={styles.message}>
          {message}
        </Typography>

        {/* Optional Back Button */}
        {/* {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.8}
            style={styles.backButton}
          >
            <Typography style={styles.backButtonText}>Go Back</Typography>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
};

export default AccessDeniedScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6f6ff',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    color: colors.error,
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.gray,
    lineHeight: 30,
  },
  backButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.white,
  },
});
