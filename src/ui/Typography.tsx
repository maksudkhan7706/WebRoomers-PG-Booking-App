import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import colors from '../constants/colors';

type Variant = 'heading' | 'subheading' | 'body' | 'caption' | 'label';
type Align = 'left' | 'center' | 'right' | 'justify' | 'auto';

interface TypographyProps extends TextProps {
  variant?: Variant;
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: string;
  align?: Align; // 👈 new prop added
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const getFontWeight = (
  weight?: TypographyProps['weight'],
): TextStyle['fontWeight'] => {
  switch (weight) {
    case 'bold':
      return '700';
    case 'medium':
      return '500';
    case 'light':
      return '300';
    default:
      return '400';
  }
};

const stylesMap: Record<Variant, TextStyle> = {
  heading: { fontSize: 22, lineHeight: 32 },
  subheading: { fontSize: 18, lineHeight: 26 },
  body: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 12, lineHeight: 16 },
  label: { fontSize: 14, lineHeight: 20 },
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  color = colors.black,
  align = 'auto', // 👈 default value
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[
        stylesMap[variant],
        {
          fontWeight: getFontWeight(weight),
          color,
          textAlign: align,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default React.memo(Typography);
