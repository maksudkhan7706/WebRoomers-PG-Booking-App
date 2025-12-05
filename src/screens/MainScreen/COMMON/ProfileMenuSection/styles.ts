import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  // Profile Section Styles
  profileSection: {
    width: '100%',
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    ...Platform.select({
      ios: {
        shadowColor: '#132B4C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#EEF3FB',
    overflow: 'hidden',
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  profileInitials: {
    color: colors.white,
    fontSize: 28,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: colors.textDark,
  },
  profileEmail: {
    marginTop: 4,
    color: colors.lightGary,
  },
  // Menu Container Styles
  menuContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },
  // Logout Button Styles
  logoutContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  logoutButton: {
    borderRadius: 16,
    height: 56,
    ...Platform.select({
      ios: {
        shadowColor: colors.mainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoutModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoutModalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  logoutIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    color: colors.textDark,
    marginBottom: 6,
  },
  logoutModalSubtitle: {
    color: colors.lightGary,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutModalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  logoutCancelBtn: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  logoutConfirmBtn: {
    flex: 1,
  },
});
