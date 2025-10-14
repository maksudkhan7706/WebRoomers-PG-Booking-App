import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

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
});
