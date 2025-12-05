import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from './Typography';
import colors from '../constants/colors';
import { checkCameraAndGalleryPermissions } from '../utils/permissions';
import AppImage from './AppImage';

interface PickerFile {
  uri: string;
  name?: string;
  type?: string;
}

interface Props {
  value?: string | PickerFile | null;
  userName?: string;
  onSelect?: (file: PickerFile) => void;
  readOnly?: boolean;
  size?: number;
  containerStyle?: any;
}

const ProfilePhotoPicker: React.FC<Props> = ({
  value,
  userName = '',
  onSelect,
  readOnly = false,
  size = 120,
  containerStyle,
}) => {
  // Generate initials from user name
  const getInitials = (name: string): string => {
    if (!name || name.trim().length === 0) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Persist the last known image URI to prevent blinking during refetch
  // This ensures the image stays visible even when value temporarily becomes null
  const lastImageUriRef = useRef<string | null>(null);

  // Normalize image URI
  const getImageUri = (): string | null => {
    if (!value) return null;
    if (typeof value === 'string') {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
      }
      const cleanPath = value.startsWith('/') ? value.slice(1) : value;
      return `https://domain.webroomer.com/${cleanPath}`;
    }
    if (typeof value === 'object' && value?.uri) {
      return value.uri;
    }
    return null;
  };

  const currentImageUri = getImageUri();

  // Update the ref when we have a valid image URI
  // This persists the image even when value becomes null during refetch
  useEffect(() => {
    if (currentImageUri) {
      lastImageUriRef.current = currentImageUri;
    }
  }, [currentImageUri]);

  // Use the current URI if available, otherwise fall back to the last known URI
  // This prevents the image from disappearing during API refetch
  const imageUri = currentImageUri || lastImageUriRef.current;
  const initials = getInitials(userName);

  const openCamera = async () => {
    const hasPermission = await checkCameraAndGalleryPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow camera access to capture your profile photo.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'front', // Use front camera for selfie
      },
      res => {
        if (res.didCancel) {
          return;
        }
        if (res.errorMessage) {
          Alert.alert('Error', res.errorMessage);
          return;
        }
        if (res.assets && res.assets.length > 0 && onSelect) {
          const asset = res.assets[0];
          onSelect({
            uri: asset.uri || '',
            name: asset.fileName || 'profile_photo.jpg',
            type: asset.type || 'image/jpeg',
          });
        }
      },
    );
  };

  const profileContainerStyle = [
    styles.profileContainer,
    { width: size, height: size },
  ] as any;
  const profileImageStyle = [
    styles.profileImage,
    { width: size, height: size, borderRadius: size / 2 },
  ] as any;
  const placeholderContainerStyle = [
    styles.placeholderContainer,
    { width: size, height: size, borderRadius: size / 2 },
  ] as any;
  const initialsTextStyle = [
    styles.initialsText,
    { fontSize: size * 0.33 },
  ] as any;
  const cameraIconSize = size * 0.3;
  const cameraIconContainerStyle = [
    styles.cameraIconContainer,
    {
      width: cameraIconSize,
      height: cameraIconSize,
      borderRadius: cameraIconSize / 2,
    },
  ] as any;

  const content = (
    <>
      {imageUri ? (
        <AppImage
          source={{ uri: imageUri }}
          style={profileImageStyle}
          resizeMode="cover"
        />
      ) : (
        <View style={placeholderContainerStyle}>
          <Typography variant="heading" weight="bold" style={initialsTextStyle}>
            {initials}
          </Typography>
        </View>
      )}
      {!readOnly && (
        <View style={cameraIconContainerStyle}>
          <Icon
            name="camera-alt"
            size={cameraIconSize * 0.56}
            color={colors.white}
          />
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {readOnly ? (
        <View style={profileContainerStyle}>{content}</View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openCamera}
          style={profileContainerStyle}
        >
          {content}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    borderRadius: 0, // Will be overridden by inline style
  },
  placeholderContainer: {
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: colors.white,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default ProfilePhotoPicker;
