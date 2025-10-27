import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../../ui/Typography';
import colors from '../../constants/colors';
import { checkCameraAndGalleryPermissions } from '../../utils/permissions';
import AppImage from '../../ui/AppImage';

interface PickerFile {
  uri: string;
  name?: string;
  type?: string;
}

interface Props {
  label: string;
  value?: string | string[] | PickerFile | PickerFile[] | null;
  multiple?: boolean;
  onSelect: (files: PickerFile[]) => void;
}

const ImagePickerInput: React.FC<Props> = ({
  label,
  value,
  multiple = false,
  onSelect,
}) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!value) {
      setImages([]);
      return;
    }
    const normalizeImageUri = (val: any): string | null => {
      if (typeof val !== 'string' || !val) return null;
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      const cleanPath = val.startsWith('/') ? val.slice(1) : val;
      return `https://domain.webroomer.com/${cleanPath}`;
    };

    if (Array.isArray(value)) {
      const validUris = value
        .map(v => {
          if (typeof v === 'string') return normalizeImageUri(v);
          if (typeof v === 'object' && v?.uri) return v.uri;
          return null;
        })
        .filter((v): v is string => v !== null);
      setImages(validUris);
    } else if (typeof value === 'string') {
      const uri = normalizeImageUri(value);
      setImages(uri ? [uri] : []);
    } else if (typeof value === 'object' && value?.uri) {
      setImages([value.uri]);
    } else {
      setImages([]);
    }
  }, [value]);

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
          launchCamera({ mediaType: 'photo', quality: 0.7 }, res =>
            handlePickerResult(res),
          ),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.7,
              selectionLimit: multiple ? 0 : 1,
            },
            res => handlePickerResult(res),
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePickerResult = (res: any) => {
    if (!res.assets || res.assets.length === 0) return;

    const files: PickerFile[] = res.assets.map((a: any) => ({
      uri: a.uri,
      name: a.fileName,
      type: a.type,
    }));

    if (multiple) {
      const newUris = files.map(f => f.uri);
      const updatedImages = [...images, ...newUris];
      setImages(updatedImages);
      onSelect([...images.map(uri => ({ uri })), ...files]);
    } else {
      setImages([files[0].uri]);
      onSelect([files[0]]);
    }
  };

  // 🧹 Remove selected image
  const removeImage = (uri: string) => {
    const updated = images.filter(img => img !== uri);
    setImages(updated);
    onSelect(updated.map(u => ({ uri: u })));
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Typography variant="caption" weight="medium" style={styles.label}>
          {label}
        </Typography>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openPicker}
        style={styles.uploadBox}
      >
        {images.length > 0 ? (
          images.length === 1 ? (
            <View style={styles.imageWrapper}>
              <AppImage
                source={{ uri: images[0] }}
                style={styles.singleImage}
                resizeMode="stretch"
              />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(images[0])}
              >
                <Icon name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <AppImage
                    source={{ uri }}
                    style={styles.multiImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removeImage(uri)}
                  >
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name="photo-camera" size={30} color={colors.gray} />
            <Typography variant="label" weight="medium" color={colors.gray}>
              Upload / Capture Photo
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  uploadBox: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#f3f3fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3fa',
    padding: 6,
  },
  imageWrapper: {
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  multiImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
  scrollContainer: {
    gap: 10,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImagePickerInput;
