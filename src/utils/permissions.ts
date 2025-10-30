// utils/permissions.ts
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const checkCameraAndGalleryPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const camera = await check(PERMISSIONS.IOS.CAMERA);
      const photos = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      const cameraGranted =
        camera === RESULTS.GRANTED ||
        (await request(PERMISSIONS.IOS.CAMERA)) === RESULTS.GRANTED;
      const photoGranted =
        photos === RESULTS.GRANTED ||
        (await request(PERMISSIONS.IOS.PHOTO_LIBRARY)) === RESULTS.GRANTED;

      return cameraGranted && photoGranted;
    } else {
      // Android
      let camera = await check(PERMISSIONS.ANDROID.CAMERA);
      if (camera !== RESULTS.GRANTED)
        camera = await request(PERMISSIONS.ANDROID.CAMERA);

      let gallery;
      if (Number(Platform.Version) >= 33) {
        gallery = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        if (gallery !== RESULTS.GRANTED)
          gallery = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        gallery = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (gallery !== RESULTS.GRANTED)
          gallery = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }

      return camera === RESULTS.GRANTED && gallery === RESULTS.GRANTED;
    }
  } catch (err) {
    console.log('Permission error:', err);
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
    console.log('📍 Location permission error:', err);
    return false;
  }
};