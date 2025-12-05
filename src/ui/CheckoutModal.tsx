import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Typography from './Typography';
import AppButton from './AppButton';
import AppDatePicker from './AppDatePicker';
import AppTextInput from './AppTextInput';
import colors from '../constants/colors';
import Feather from 'react-native-vector-icons/Feather';

interface CheckoutModalProps {
  visible: boolean;
  pgTitle: string;
  lockInPeriod: number; // in days
  onCancel: () => void;
  onSubmit: (checkoutDate: Date, reason: string) => void;
  loading?: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  pgTitle,
  lockInPeriod,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;
  const modalTranslateY = useRef(new Animated.Value(20)).current;

  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ date?: string; reason?: string }>({});

  // Calculate minimum date (lock-in period end date from today)
  // Example: Today is 4th, lock_in_period is 15 days
  // User can only select dates from 19th onwards (4 + 15 = 19)
  const getMinimumDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    // Add lock-in period days
    minDate.setDate(today.getDate() + lockInPeriod);
    // Ensure we're at the start of the day
    minDate.setHours(0, 0, 0, 0);
    return minDate;
  };

  const minimumDate = getMinimumDate();

  useEffect(() => {
    if (visible) {
      // Reset values before animation
      modalScale.setValue(0.85);
      modalTranslateY.setValue(20);
      modalOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset form when modal closes
        setCheckoutDate(null);
        setReason('');
        setErrors({});
      });
    }
  }, [visible, modalOpacity, modalScale, modalTranslateY]);

  const handleSubmit = () => {
    const newErrors: { date?: string; reason?: string } = {};

    if (!checkoutDate) {
      newErrors.date = 'Please select a checkout date';
    } else if (checkoutDate < minimumDate) {
      newErrors.date = `Checkout date must be on or after ${formatDate(
        minimumDate,
      )}`;
    }

    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for checkout';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(checkoutDate!, reason.trim());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <Animated.View style={[styles.backdrop, { opacity: modalOpacity }]}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    opacity: modalOpacity,
                    transform: [
                      { scale: modalScale },
                      { translateY: modalTranslateY },
                    ],
                  },
                ]}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Header Icon */}
                  <View style={styles.iconWrap}>
                    <Feather name="log-out" size={22} color="#fff" />
                  </View>

                  {/* Title */}
                  <Typography variant="body" weight="bold" style={styles.title}>
                    Check Out
                  </Typography>

                  {/* PG Title */}
                  <View style={styles.pgTitleContainer}>
                    <Typography variant="label" style={styles.pgTitleLabel}>
                      PG Name
                    </Typography>
                    <Typography
                      variant="body"
                      weight="medium"
                      style={styles.pgTitle}
                    >
                      {pgTitle}
                    </Typography>
                  </View>

                  {/* Lock-in Period Info */}
                  <View style={styles.infoBox}>
                    <Feather
                      name="info"
                      size={18}
                      color="#2563EB"
                      style={styles.infoIcon}
                    />
                    <Typography variant="caption" style={styles.infoText}>
                      {lockInPeriod > 0
                        ? `You can only checkout after ${lockInPeriod} day${
                            lockInPeriod > 1 ? 's' : ''
                          } from today. The earliest checkout date is ${formatDate(
                            minimumDate,
                          )}. This is due to the lock-in period policy.`
                        : 'You can select any date from today onwards for checkout.'}
                    </Typography>
                  </View>

                  {/* Date Picker */}
                  <View style={styles.datePickerContainer}>
                    <AppDatePicker
                      label="Checkout Date"
                      date={checkoutDate}
                      onDateChange={selectedDate => {
                        // Ensure selected date is not before minimum date
                        if (selectedDate < minimumDate) {
                          setCheckoutDate(minimumDate);
                        } else {
                          setCheckoutDate(selectedDate);
                        }
                        if (errors.date) {
                          setErrors(prev => ({ ...prev, date: undefined }));
                        }
                      }}
                      placeholder="Select checkout date"
                      minimumDate={minimumDate}
                      error={errors.date}
                      containerStyle={styles.datePicker}
                    />
                    {lockInPeriod > 0 && !errors.date && (
                      <Typography variant="caption" style={styles.helperText}>
                        Earliest checkout date: {formatDate(minimumDate)}
                      </Typography>
                    )}
                  </View>

                  {/* Reason Input */}
                  <AppTextInput
                    label="Reason for Checkout"
                    placeholder="Please provide a reason for checkout..."
                    value={reason}
                    onChangeText={text => {
                      setReason(text);
                      if (errors.reason) {
                        setErrors(prev => ({ ...prev, reason: undefined }));
                      }
                    }}
                    multiline
                    inputHeight={100}
                    error={errors.reason}
                    containerStyle={styles.reasonInput}
                  />

                  {/* Action Buttons */}
                  <View style={styles.actions}>
                    <AppButton
                      title="Cancel"
                      titleColor={colors.mainColor}
                      style={styles.cancelBtn}
                      onPress={onCancel}
                      disabled={loading}
                    />
                    <AppButton
                      title="Submit"
                      loading={loading}
                      disabled={loading}
                      style={styles.submitBtn}
                      onPress={handleSubmit}
                    />
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  title: {
    color: colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 20,
  },
  pgTitleContainer: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pgTitleLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  pgTitle: {
    color: colors.textDark,
    textTransform: 'capitalize',
    fontSize: 15,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: '#1E40AF',
    lineHeight: 18,
  },
  infoIcon: {
    marginTop: 2,
  },
  datePickerContainer: {
    marginBottom: 18,
  },
  datePicker: {
    marginBottom: 0,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 6,
    marginLeft: 2,
  },
  reasonInput: {
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.mainColor,
    height: 44,
  },
  submitBtn: {
    flex: 1,
    height: 44,
  },
});

export default CheckoutModal;
