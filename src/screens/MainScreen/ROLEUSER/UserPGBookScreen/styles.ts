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

  checkboxContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginBottom:50
  },
  checkboxText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    flexShrink: 1,
  },
});
