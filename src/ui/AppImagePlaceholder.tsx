import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Typography from './Typography'; // apne project ke Typography path se import karna

interface AppImagePlaceholderProps {
  style?: ViewStyle;
  label?: string;
}

const AppImagePlaceholder: React.FC<AppImagePlaceholderProps> = ({
  style,
  label = 'No Image',
}) => {
  return (
    <View style={[styles.container, style]}>
      <Feather name="image" size={30} color="#aaa" />
      <Typography variant="label" style={styles.text}>
        {label}
      </Typography>
    </View>
  );
};

export default AppImagePlaceholder;

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 10,
    backgroundColor: '#f2f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#777',
    marginTop: 6,
  },
});
