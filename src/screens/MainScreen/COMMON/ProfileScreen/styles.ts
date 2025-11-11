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
    paddingBottom: 120,
  },
  imageSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  imagePicker: {
    marginTop: 8,
    height: 100,
    borderWidth: 1,
    borderColor: colors.logoBg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.logoBg,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
    color: '#fff',
    fontSize: 20,
  },
  downloadBtn: {
    marginTop: 40,
    marginHorizontal: 40,
    width: '80%',
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  imageContainer: {
    backgroundColor: '#fff',
    width: '95%',
    height: '60%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
