import FastImage, { FastImageProps } from 'react-native-fast-image';
import { View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import React from 'react';

interface AppImageProps {
  source: { uri?: string } | null;
  style?: ImageStyle | ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

const AppImage: React.FC<AppImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
}) => {
  const [isError, setIsError] = React.useState(false);

  if (!source?.uri || isError) {
    return <View style={[styles.skeletonBox, style]} />;
  }

  return (
    <FastImage
      source={{
        uri: source.uri,
        priority: FastImage.priority.normal,
      }}
      style={style as any}
      resizeMode={resizeMode as any}
      onError={() => setIsError(true)}
    />
  );
};

const styles = StyleSheet.create({
  skeletonBox: {
    backgroundColor: '#f2f0f0ff',
    borderRadius: 10,
  },
});

export default React.memo(AppImage);
