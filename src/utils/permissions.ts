// utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { appLog } from './appLog';

export const checkCameraAndGalleryPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const camera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return camera === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  } catch (err) {
    appLog('checkCameraAndGalleryPermissions', 'Permission error:', err);
    return false;
  }
};
//Check and request location permission
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (status === RESULTS.GRANTED) return true;

      const newStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return newStatus === RESULTS.GRANTED;
    } else {
      // 🔹 Android
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (status === RESULTS.GRANTED) return true;

      const newStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return newStatus === RESULTS.GRANTED;
    }
  } catch (err) {
    appLog('checkLocationPermission', 'Location permission error:', err);
    return false;
  }
};
