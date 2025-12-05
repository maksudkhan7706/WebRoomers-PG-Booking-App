import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalCloseText: {
    color: colors.white,
    fontSize: 20,
  },
  downloadBtn: {
    marginTop: 40,
    marginHorizontal: 40,
    width: '80%',
  },

  imageContainer: {
    backgroundColor: colors.white,
    width: '95%',
    height: '60%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imagePickerItem: {
    flex: 1,
    marginRight: 10,
  },
  imagePickerItemLast: {
    flex: 1,
    marginRight: 0,
  },
});
