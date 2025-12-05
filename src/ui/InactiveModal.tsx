import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Typography from './Typography';
import AppButton from './AppButton';
import colors from '../constants/colors';
import Feather from 'react-native-vector-icons/Feather';

interface InactiveModalProps {
  visible: boolean;
  userName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const InactiveModal: React.FC<InactiveModalProps> = ({
  visible,
  userName,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, modalOpacity, modalScale]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: modalOpacity }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.iconWrap}>
                <Feather name="user-x" size={24} color="#fff" />
              </View>
              <Typography variant="body" weight="bold" style={styles.title}>
                {userName}
              </Typography>
              <Typography variant="label" style={styles.subtitle}>
                Are you sure you want to inactivate this user?
              </Typography>
              <View style={styles.actions}>
                <AppButton
                  title="No"
                  titleColor={colors.mainColor}
                  style={styles.cancelBtn}
                  onPress={onCancel}
                />
                <AppButton
                  title="Yes"
                  loading={loading}
                  disabled={loading}
                  style={styles.confirmBtn}
                  onPress={onConfirm}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.textDark,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  subtitle: {
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  userName: {
    color: colors.textDark,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#FF9800',
  },
});

export default InactiveModal;

