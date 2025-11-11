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
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    // shadow for Android
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.mainColor,
  },
  roomInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceBox: {
    backgroundColor: colors.mainColor,
    borderRadius: 5,
    position: 'absolute',
    right: -15,
    top: -30,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
});
