import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../../ui/Typography';

const BookingScreen = () => (
  <View style={styles.container}>
    <Typography variant="heading" weight="bold">
      Booking Screen
    </Typography>
  </View>
);

export default BookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
