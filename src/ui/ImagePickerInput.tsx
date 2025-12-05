import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  StyleProp,
  TextStyle,
  Linking,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../ui/Typography';
import colors from '../constants/colors';
import { checkCameraAndGalleryPermissions } from '../utils/permissions';
import AppImage from './AppImage';
import { appLog } from '../utils/appLog';
import RNFetchBlob from 'rn-fetch-blob';

interface PickerFile {
  uri: string;
  name?: string;
  type?: string;
}

interface Props {
  label: string;
  value?: string | string[] | PickerFile | PickerFile[] | null;
  pickerPlachholer?: string;
  multiple?: boolean;
  onSelect: (files: PickerFile[]) => void;
  onPreview?: (uri: string) => void;
  labelStyle?: StyleProp<TextStyle>;
  mediaType?: 'photo' | 'video';
}

const ImagePickerInput: React.FC<Props> = ({
  label,
  value,
  multiple = false,
  onSelect,
  onPreview,
  pickerPlachholer,
  labelStyle,
  mediaType,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const resolvedMediaType =
    mediaType ??
    (label?.toLowerCase().includes('video') ? 'video' : 'photo');
  const isVideoPicker = resolvedMediaType === 'video';
  const placeholderText =
    pickerPlachholer ||
    (isVideoPicker ? 'Upload / Capture Video' : 'Upload / Capture Photo');

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

  const handlePreviewPress = (uri?: string) => {
    appLog('handlePreviewPress', 'uri', uri);
    if (!uri) return;
    if (onPreview) {
      onPreview(uri);
      return;
    }

    const normalizedUri = uri.startsWith('file://') ? uri : uri;
    if (isVideoPicker && normalizedUri.startsWith('file://')) {
      const path = normalizedUri.replace('file://', '');
      try {
        if (Platform.OS === 'android') {
          RNFetchBlob.android.actionViewIntent(path, 'video/*');
        } else {
          RNFetchBlob.ios.previewDocument(normalizedUri);
        }
        return;
      } catch (err) {
        appLog('VideoPreviewError', 'actionViewIntent failed', err);
      }
    }

    Linking.openURL(uri).catch(() =>
      Alert.alert('Unable to preview', 'Please try again.'),
    );
  };

  const openPicker = async () => {
    const hasPermission = await checkCameraAndGalleryPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow camera and gallery access.',
      );
      return;
    }

    Alert.alert(
      isVideoPicker ? 'Upload Video' : 'Upload Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () =>
            launchCamera(
              {
                mediaType: isVideoPicker ? 'video' : 'photo',
                quality: 0.7,
              },
              res => handlePickerResult(res),
            ),
        },
        {
          text: 'Gallery',
          onPress: () =>
            launchImageLibrary(
              {
                mediaType: isVideoPicker ? 'video' : 'photo',
                quality: 0.7,
                selectionLimit: multiple ? 0 : 1,
              },
              res => handlePickerResult(res),
            ),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
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

  const removeImage = (uri: string) => {
    const updated = images.filter(img => img !== uri);
    setImages(updated);
    onSelect(updated.map(u => ({ uri: u })));
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Typography
          variant="caption"
          weight="medium"
          style={[styles.label, labelStyle]}
          numberOfLines={1}
        >
          {label}
        </Typography>
      ) : null}

      <View style={styles.uploadBox}>
        {images.length > 0 ? (
          // 🔹 For multiple images: show scroll + add-more always
          multiple ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={{ position: 'relative' }}>
                  {isVideoPicker ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handlePreviewPress(uri)}
                      style={styles.videoThumb}
                    >
                      <Icon
                        name="videocam"
                        size={26}
                        color={colors.mainColor}
                      />
                      <Typography
                        variant="caption"
                        weight="medium"
                        numberOfLines={1}
                        style={styles.videoLabel}
                      >
                        {`Video ${index + 1}`}
                      </Typography>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handlePreviewPress(uri)}
                    >
                      <AppImage
                        source={{ uri }}
                        style={styles.multiImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removeImage(uri)}
                  >
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* 🔹 Always show "Add More" box when multiple=true */}
              <TouchableOpacity
                onPress={openPicker}
                style={styles.addMoreBox}
                activeOpacity={0.8}
              >
                <Icon
                  name={isVideoPicker ? 'video-library' : 'add-photo-alternate'}
                  size={30}
                  color={colors.gray}
                />
                <Typography variant="label" weight="medium" color={colors.gray}>
                  {isVideoPicker ? 'Add Video' : 'Add More'}
                </Typography>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            // 🔹 Single Image UI
            <TouchableOpacity
              onPress={() => handlePreviewPress(images[0])}
              style={isVideoPicker ? styles.singleVideo : styles.singleImage}
              activeOpacity={0.8}
            >
              {isVideoPicker ? (
                <View style={styles.videoPreviewContent}>
                  <Icon name="play-circle-filled" size={36} color="#fff" />
                  <Typography
                    variant="label"
                    weight="medium"
                    color="#fff"
                    style={{ marginTop: 6 }}
                  >
                    Preview Video
                  </Typography>
                </View>
              ) : (
                <AppImage
                  source={{ uri: images[0] }}
                  style={styles.singleImage}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(images[0])}
              >
                <Icon name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )
        ) : (
          // 🔹 Empty state: upload button
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openPicker}
            style={styles.placeholderContainer}
          >
            <Icon
              name={isVideoPicker ? 'videocam' : 'photo-camera'}
              size={30}
              color={colors.gray}
            />
            <Typography variant="label" weight="medium" color={colors.gray}>
              {placeholderText}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
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
  scrollContainer: {
    gap: 10,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
  addMoreBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#e9e9f3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.mainColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  videoThumb: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#e4e8f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  videoLabel: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.textDark,
  },
  singleVideo: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: colors.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPreviewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImagePickerInput;
