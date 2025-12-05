import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  dropdownWrapper: {
    marginBottom: 0,
  },
  dropdownLabel: {
    marginBottom: 6,
  },
  permissionsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  permissionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionsTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
  },
  permissionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  permissionItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    minHeight: 50,
  },
  permissionLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  permissionLabelSelected: {
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  footerButton: {
    flex: 1,
    height: 45,
  },
  cancelButton: {
    backgroundColor: colors.gray,
    marginRight: 12,
  },
});

