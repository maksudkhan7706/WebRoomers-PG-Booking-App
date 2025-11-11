import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../../constants/colors';

const { width } = Dimensions.get('window');

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

  title: {
    marginBottom: 10,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 6,
    flexShrink: 1,
  },

  detailWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: width / 2 - 30,
    marginBottom: 10,
  },

  featuresWrapper: {
    flexDirection: 'column',
    marginTop: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  forPgButton: {
    backgroundColor: colors.mainColor,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    top: -15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
