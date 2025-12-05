// utils/permissions.ts
import { Alert, PermissionsAndroid, Platform } from 'react-native';
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

/**
 * Check if user has specific permission
 * Landlord => always allowed
 * Supports both permission keys (strings) and permission IDs (numbers)
 */
export const hasPermission = (
  userData: any,
  apiUserData: any,
  key: string,
  userAllPermissions?: any[], // Optional: array of permission objects with id and permission_key
): boolean => {
  try {
    //Landlord = full access
    if (userData?.user_type === 'landlord') return true;

    const permissions = apiUserData?.data?.user_permissions;
    //If no permission list found
    if (!Array.isArray(permissions) || permissions.length === 0) {
      appLog('hasPermission', `Key: ${key}`, 'No permissions array found');
      return false;
    }

    // Check if permissions array contains IDs (numbers) or keys (strings)
    const firstPermission = permissions[0];
    const isIdBased =
      typeof firstPermission === 'number' ||
      (typeof firstPermission === 'string' && /^\d+$/.test(firstPermission));

    if (isIdBased) {
      // Permissions are IDs - need to map key to ID using userAllPermissions
      if (!userAllPermissions || !Array.isArray(userAllPermissions)) {
        appLog(
          'hasPermission',
          `Key: ${key}`,
          'ID-based permissions but userAllPermissions not provided',
        );
        return false;
      }

      // Find the permission object with matching key
      const permissionObj = userAllPermissions.find(
        (p: any) => p?.permission_key === key,
      );

      if (!permissionObj?.id) {
        appLog(
          'hasPermission',
          `Key: ${key}`,
          'Permission not found in userAllPermissions',
        );
        return false;
      }

      // Check if permission ID exists in user's permissions
      const permissionId = permissionObj.id;
      const hasAccess = permissions.some(
        (id: any) => String(id) === String(permissionId),
      );

      appLog('hasPermission', `Key: ${key}`, {
        permissionId,
        userPermissionIds: permissions,
        hasAccess,
      });
      return hasAccess;
    } else {
      // Permissions are keys (strings) - direct check
      const allowed = permissions.includes(key);
      appLog('hasPermission', `Key: ${key}`, `Allowed: ${allowed}`);
      return allowed;
    }
  } catch (err) {
    appLog('hasPermission', 'Error:', err);
    return false;
  }
};

/**
 *Helper for conditional rendering (hide/show UI)
 */
export const withPermission = (
  userData: any,
  apiUserData: any,
  key: string,
  children: React.ReactNode,
  userAllPermissions?: any[],
) => {
  return hasPermission(userData, apiUserData, key, userAllPermissions)
    ? children
    : null;
};

/**
 *Common handler for actions (with Alert)
 */
export const handlePermissionAction = ({
  userData,
  apiUserData,
  key,
  onAllow,
  onDeny,
  userAllPermissions,
}: {
  userData: any;
  apiUserData: any;
  key: string;
  onAllow: () => void;
  onDeny: () => void;
  userAllPermissions?: any[];
}) => {
  if (
    userData?.user_type === 'landlord' ||
    hasPermission(userData, apiUserData, key, userAllPermissions)
  ) {
    onAllow();
  } else {
    onDeny();
  }
};
