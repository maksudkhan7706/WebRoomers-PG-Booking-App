import FastImage, { FastImageProps } from 'react-native-fast-image';
import { View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Typography from './Typography';

interface AppImageProps {
  source: { uri?: string } | number | null; // number for local require()
  style?: ImageStyle | ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

const AppImage: React.FC<AppImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
}) => {
  const [isError, setIsError] = React.useState(false);

  // Check if source is missing or invalid
  const isSourceMissing =
    !source ||
    isError ||
    (typeof source === 'object' && 'uri' in source && !source.uri);

  if (isSourceMissing) {
    // Extract dimensions from style if available
    const width = (style as any)?.width || 100;
    const height = (style as any)?.height || 100;
    const borderRadius = (style as any)?.borderRadius || 10;

    return (
      <View
        style={[
          styles.placeholderContainer,
          {
            width,
            height,
            borderRadius,
          },
          style,
        ]}
      >
        <Feather
          name="image"
          size={Math.min(width, height) * 0.3}
          color="#aaa"
        />
        <Typography variant="caption" style={styles.placeholderText}>
          No Image
        </Typography>
      </View>
    );
  }

  const fastImageSource =
    typeof source === 'number'
      ? source
      : {
          uri: source.uri,
          priority: FastImage.priority.normal,
        };

  return (
    <FastImage
      source={fastImageSource as any}
      style={style as any}
      resizeMode={resizeMode as any}
      onError={() => setIsError(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    backgroundColor: '#f2f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
    marginTop: 4,
    fontSize: 10,
  },
});

export default React.memo(AppImage);
