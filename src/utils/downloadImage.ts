import RNFetchBlob from 'rn-fetch-blob';
import { appLog } from './appLog';
import { showErrorMsg, showSuccessMsg } from './appMessages';

interface DownloadImageOptions {
  url: string;
  fileName?: string;
  onLoadingChange?: (loading: boolean) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Downloads an image from a URL (remote or local) to the device's Pictures directory
 * @param options - Download options
 * @returns Promise that resolves when download is complete
 */
export const downloadImage = async (options: DownloadImageOptions): Promise<void> => {
  const {
    url,
    fileName,
    onLoadingChange,
    successMessage,
    errorMessage,
  } = options;

  try {
    const { fs } = RNFetchBlob;
    const PictureDir = fs.dirs.PictureDir;
    const timestamp = Date.now();
    const finalFileName = fileName || `QRCode_${timestamp}.png`;
    const filePath = `${PictureDir}/${finalFileName}`;

    // Set loading state if callback provided
    onLoadingChange?.(true);

    if (url.startsWith('file://')) {
      // It's a local file — copy it
      const sourcePath = url.replace('file://', '');
      await fs.cp(sourcePath, filePath);
    } else {
      // It's a remote URL — fetch it
      await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        path: filePath,
      }).fetch('GET', url);
    }

    // Set loading state to false
    onLoadingChange?.(false);

    // Show success message
    const message = successMessage || `Download Complete. File saved to: ${filePath}`;
    showSuccessMsg(message);
  } catch (error: any) {
    appLog('downloadImage', 'Download error:', error);
    onLoadingChange?.(false);
    const message = errorMessage || 'Download Failed';
    showErrorMsg(message, error?.message || 'Unknown error occurred');
    throw error;
  }
};

