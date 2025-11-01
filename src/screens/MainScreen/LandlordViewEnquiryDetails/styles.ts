import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
  listContent: {
    padding: 10,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    width: '30%',
    fontWeight: '500',
  },
  value: {
    width: '60%',
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#fff',
  },
  screenshotContainer: {
    marginTop: 5,
  },
  screenshotImg: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.logoBg,
    marginTop: 10,
  },
  photoImg: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.logoBg,
    marginTop: 10,
  },
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    backgroundColor: '#f0f0f0',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mb8: {
    marginBottom: 8,
  },
  featuresWrap: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 20,
  },

  imageContainer: {
    backgroundColor: '#fff',
    width: '95%',
    height: '50%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'center',
  },

  idProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  idProofContainer: {
    width: '32%',
  },
  pgTitle: {
    marginTop: 10,
    marginBottom: 5,
  },
  footerBtns: {
    padding: 10,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  footerBtn: {
    width: '32%',
  },

  confirmBox: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
  },

});
