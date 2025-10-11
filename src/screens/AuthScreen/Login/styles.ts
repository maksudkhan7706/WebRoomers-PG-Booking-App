import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
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
    marginBottom: 30,
  },
  forgotContainer: {
    marginBottom: 20,
    marginTop: -5,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  registerText: {
    textDecorationLine: 'underline',
  },
});

export default styles;
