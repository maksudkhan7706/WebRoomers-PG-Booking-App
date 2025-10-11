import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../../ui/Typography';

const MyPGScreen = () => (
    <View style={styles.container}>
        <Typography variant="heading" weight="bold">
            MyPG Screen
        </Typography>
    </View>
);

export default MyPGScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
