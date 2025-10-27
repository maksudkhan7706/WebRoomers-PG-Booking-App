import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    backgroundColor: colors.white,
    elevation: 0,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logo: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
    marginTop: 55,
    marginBottom: 30,
  },
  titleText: {
    textAlign: 'center',
    marginTop: 30,
  },
  subtitleText: {
    textAlign: 'center',
    marginBottom: -5,
  },
});
