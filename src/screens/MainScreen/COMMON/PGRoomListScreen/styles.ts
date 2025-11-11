import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
const { width } = Dimensions.get('window');

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
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    // shadow for Android
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.mainColor,
    marginBottom:16
  },
  slider: {
    width: '100%',
    height: width * 0.45,
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
  button: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.mainColor,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
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
});
