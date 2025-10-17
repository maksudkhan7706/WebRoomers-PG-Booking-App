import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../constants/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sliderContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },

  loaderContainer:{
    flex: 1, justifyContent: 'center', alignItems: 'center' 
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 16,
    resizeMode: 'stretch',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.mainColor,
    width: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  //PG
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  pgCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative', // absolute FOR button ke liye
  },

  pgInfoRow: {
    flexDirection: 'column', // title + address vertically
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },

  pgTextContainer: {
    width: '100%',
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  addressText: {
    marginLeft: 4,
    flexShrink: 1,
  },

  forPgContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.mainColor,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120, // agar text bahut lamba ho to truncate ho jaye
  },

  pgImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 8,
    resizeMode: 'cover',
  },

  rentText: {
    marginTop: 8,
  },
  viewAllButton: {
    backgroundColor: colors.mainColor,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  categoryCard: {
    width: width / 1.7,
    marginRight: 10,
    alignItems: 'center',
    margin: 10,
    backgroundColor: colors.white,
    padding: 10,
    elevation: 3,
    shadowColor: colors.mainColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: colors.lightGary,
  },
  categoryImage: {
    width: width / 2.5,
    height: width / 2.5,
    borderRadius: width / 2.5,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: colors.mainColor,
  },
});
