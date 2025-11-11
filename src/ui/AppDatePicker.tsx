import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Typography from './Typography';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors';

type Props = {
  label?: string;
  date: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
  disabled?: boolean; // ✅ Added new prop
};

const AppDatePicker: React.FC<Props> = ({
  label,
  date,
  onDateChange,
  placeholder = 'Select Date',
  error,
  minimumDate,
  maximumDate,
  containerStyle,
  disabled = false, // default false
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) onDateChange(selectedDate);
  };

  return (
    <View
      style={[
        styles.container,
        { marginBottom: error ? 5 : 16 },
        containerStyle,
        disabled && { opacity: 0.6 }, // visual effect when disabled
      ]}
    >
      {label && (
        <Typography variant="label" style={styles.label}>
          {label}
        </Typography>
      )}

      <TouchableOpacity
        disabled={disabled} // ✅ Disable touch
        onPress={() => setShowPicker(true)}
        style={[
          styles.inputContainer,
          error ? { borderColor: colors.error } : {},
        ]}
        activeOpacity={0.8}
      >
        <Typography
          style={[
            styles.dateText,
            { color: date ? colors.black : colors.gray },
          ]}
        >
          {date ? date.toDateString() : placeholder}
        </Typography>
        <FontAwesome name="calendar" size={18} color={colors.mainColor} />
      </TouchableOpacity>

      {error && (
        <Typography
          variant="label"
          style={{ color: 'red', marginTop: 5, marginBottom: 5 }}
        >
          {error}
        </Typography>
      )}

      {showPicker &&
        !disabled && ( // ✅ Prevent showing picker if disabled
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
    </View>
  );
};

export default React.memo(AppDatePicker);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    marginBottom: 6,
    color: colors.gray,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
  },
  dateText: { fontSize: 15 },
});
