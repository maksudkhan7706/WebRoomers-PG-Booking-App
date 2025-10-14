import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Typography from '../ui/Typography';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { checkCameraAndGalleryPermissions } from '../utils/permissions';

interface Props {
  label: string;
  onSelect: (file: any) => void;
}

const ImagePickerInput: React.FC<Props> = ({ label, onSelect }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const openPicker = async () => {
    const hasPermission = await checkCameraAndGalleryPermissions();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow camera and gallery access.',
      );
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
      <Typography weight="medium" style={{ marginBottom: 6 }}>
        {label}
      </Typography>
      <TouchableOpacity
        onPress={openPicker}
        style={{
          height: 120,
          borderWidth: 1,
          borderColor: colors.logoBg,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.logoBg,
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
          />
        ) : (
          <>
            <Icon name="photo-camera" size={30} color={colors.gray} />
            <Typography color={colors.gray}>Upload / Capture Photo</Typography>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerInput;
