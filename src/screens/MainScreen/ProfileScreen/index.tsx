import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../../ui/Typography';

const ProfileScreen = () => (
  <View style={styles.container}>
    <Typography variant="heading" weight="bold">
      Profile Screen
    </Typography>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
