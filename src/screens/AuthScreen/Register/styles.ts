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
    height: 170,
    width: '100%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
    marginBottom: 30,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  loginText: {
    textDecorationLine: 'underline',
  },
});
