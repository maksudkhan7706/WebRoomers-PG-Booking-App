import { showMessage, MessageOptions } from 'react-native-flash-message';

export const showErrorMsg = (msgStr: string, options: Partial<MessageOptions> = {}) =>
  showMessage({
    message: msgStr,
    type: 'danger',
    ...options
  });

export const showSuccessMsg = (msgStr: string, options: Partial<MessageOptions> = {}) =>
  showMessage({
    message: msgStr,
    type: 'success',
    ...options
  });

export const showWarningMsg = (msgStr: string, options: Partial<MessageOptions> = {}) =>
  showMessage({
    message: msgStr,
    type: 'warning',
    ...options
  });
