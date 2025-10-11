import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const Input = ({ placeholder, value, onChangeText }: Props) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
});

export default Input;
