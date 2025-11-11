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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
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
