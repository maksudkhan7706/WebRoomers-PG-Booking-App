import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../ui/Typography';
import colors from '../constants/colors';
import { checkCameraAndGalleryPermissions } from '../utils/permissions';
import AppImage from './AppImage';

interface Props {
  label: string;
  value?: string | null; // Default image URL
  onSelect: (file: any) => void;
}

const ImagePickerInput: React.FC<Props> = ({ label, value, onSelect }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const fullUri = `https://domain.webroomer.com/${value}`;
      setImageUri(fullUri);
    } else {
      setImageUri(null);
    }
  }, [value]);

  const openPicker = async () => {
    const hasPermission = await checkCameraAndGalleryPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Please allow camera and gallery access.');
      return;
    }

    Alert.alert('Upload Photo', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
            if (res.assets && res.assets[0]?.uri) {
              const file = res.assets[0];
              setImageUri(file.uri ?? null);
              onSelect(file);
            }
          }),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
            if (res.assets && res.assets[0]?.uri) {
              const file = res.assets[0];
              setImageUri(file.uri ?? null);
              onSelect(file);
            }
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Typography variant="caption" weight="medium" style={{ marginBottom: 6 }}>
        {label}
      </Typography>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openPicker}
        style={{
          height: 120,
          borderWidth: 1,
          borderColor: '#f3f3fa',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f3fa',
        }}
      >
        {imageUri ? (
          <AppImage
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="photo-camera" size={30} color={colors.gray} />
            <Typography color={colors.gray}>Upload / Capture Photo</Typography>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerInput;