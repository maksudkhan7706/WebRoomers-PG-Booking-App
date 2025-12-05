import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    marginTop: 14,
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.mainColor,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  facilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  facilityBadge: {
    backgroundColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },



  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginBottom: 30,
  },
  checkboxText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    flexShrink: 1,
    textDecorationLine: 'underline',
    marginBottom: 2,
  },
});
