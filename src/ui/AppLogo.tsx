import React from 'react';
import { View, ViewStyle, ImageStyle } from 'react-native';
import AppImage from './AppImage';
import images from '../assets/images';

interface AppLogoProps {
  /**
   * Style for the container View that wraps the logo
   * Use this for sizing, margins, alignment, etc.
   */
  containerStyle?: ViewStyle;
  /**
   * Style for the Image component itself
   */
  style?: ImageStyle;
  /**
   * Resize mode for the image
   * @default 'contain'
   */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  /**
   * Custom image source (optional)
   * @default images.NewAppLogo
   */
  source?: { uri?: string } | number;
}

/**
 * Reusable AppLogo component
 *
 * This component centralizes logo management. To change the logo across the entire app,
 * simply update the import in src/assets/images/index.ts
 *
 * @example
 * // Basic usage with default sizing
 * <AppLogo />
 *
 * @example
 * // With custom container styling (common for auth screens)
 * <AppLogo
 *   containerStyle={{ height: 180, width: 180, alignSelf: 'center' }}
 * />
 *
 * @example
 * // With custom image styling (common for headers)
 * <AppLogo
 *   style={{ width: 48, height: 48, borderRadius: 24 }}
 *   resizeMode="cover"
 * />
 */
const AppLogo: React.FC<AppLogoProps> = ({
  containerStyle,
  style,
  resizeMode = 'contain',
  source = images.NewAppLogo,
}) => {
  // If containerStyle is provided, wrap in View
  if (containerStyle) {
    return (
      <View style={containerStyle}>
        <AppImage
          source={source}
          style={{
            height: '100%',
            width: '100%',
            ...style,
          }}
          resizeMode={resizeMode}
        />
      </View>
    );
  }

  // If no containerStyle, render image directly with provided style
  return <AppImage source={source} style={style} resizeMode={resizeMode} />;
};

export default React.memo(AppLogo);
