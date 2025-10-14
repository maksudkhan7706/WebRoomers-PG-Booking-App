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
