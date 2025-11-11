import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    paddingBottom:150,
  },
  profileIconWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  menuContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.black,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mainColor,
    borderRadius: 12,
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
});
