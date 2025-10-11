import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 30,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: 'center',
    elevation: 0,
    shadowColor: colors.mainColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingVertical:10,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#b1d3f470',
  },
  logo: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  cardFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
