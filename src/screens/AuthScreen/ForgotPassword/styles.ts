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
    flex: 1,
    paddingHorizontal: 16,
    // justifyContent: 'center',
  },
  logo: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
    marginTop: 50,
    marginBottom: 30,
  },
  titleText: {
    marginBottom: 10,
    marginTop: 30,
  },
  subtitleText: {
    marginBottom: 30,
  },
  forgotContainer: {
    marginBottom: 20,
    marginTop: -5,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
});
