import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.mainColor,
    marginBottom: 16,
  },

  cardBody: {
    padding: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  facilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  facilityTag: {
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 3,
  },

  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  sliderContainer: {
    marginHorizontal: 10,
  },
  commonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  availabilityCard: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 25,
    top: 25,
  },
});
