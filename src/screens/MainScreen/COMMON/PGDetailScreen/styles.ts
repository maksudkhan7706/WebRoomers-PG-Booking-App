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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
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
  detailItemCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f5f7fb',
    borderWidth: 0.6,
    borderColor: '#e0e6ef',
  },
  detailIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7eef9',
    marginRight: 10,
  },
  detailLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    marginTop: 2,
  },

  featuresWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  featureCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f5f7fb',
    borderWidth: 0.6,
    borderColor: '#e0e6ef',
  },
  featureIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7eef9',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
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
