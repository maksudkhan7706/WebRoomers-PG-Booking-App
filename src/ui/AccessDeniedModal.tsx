import React from 'react';
import { View, Modal, Animated, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Typography from '../ui/Typography';
import colors from '../constants/colors';
import AppButton from './AppButton';

interface AccessDeniedModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  visible,
  onClose,
  message = 'You do not have permission to view this feature.',
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleValue }] }]}
        >
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

          <AppButton
            title="Close"
            onPress={onClose}
            style={styles.closeButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    color: colors.error,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.gray,
  },
  closeButton: {
    marginTop: 30,
  },
});

export default AccessDeniedModal;
