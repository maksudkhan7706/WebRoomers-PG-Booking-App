import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 80,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginVertical: 6,
  },
  optionLabel: {
    marginLeft: 8,
  },
  mapContainer: {
    height: 200, // thoda zyada visible area
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    backgroundColor: '#f0f0f0', // optional fallback background
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  descContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadItem: {
    width: '48%',
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  checkboxText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    flexShrink: 1,
  },
  postButton: {
    marginVertical: 40,
  },

  extraFeaturesColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  extraFeaturesIconTitle: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
});
