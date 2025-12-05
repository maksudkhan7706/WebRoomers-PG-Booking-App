import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? colors.mainColor : '#E5E7EB',
          backgroundColor: active ? '#EFF6FF' : '#F9FAFB',
          marginRight: 8,
          marginBottom: 8,
        },
        style,
      ]}
    >
      <Typography
        variant="caption"
        weight={active ? 'bold' : 'medium'}
        style={{ color: active ? colors.mainColor : '#6B7280' }}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export default React.memo(FilterChip);


