import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.mainColor,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mainColor,
    paddingBottom: 8,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    gap: 10,
  },
  column: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  dateColumn: {
    flex: 1,
  },
  dateSpacer: {
    width: 10,
  },
  submitButton: {
    marginTop: 80,
    marginBottom: 20,
  },
  // Room Dropdown Styles
  roomDropdownContainer: {
    marginBottom: 16,
  },
  roomDropdownLabel: {
    marginBottom: 6,
  },
  roomDropdownInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
    justifyContent: 'space-between',
  },
  roomDropdownInputWrapperError: {
    borderColor: colors.error,
  },
  roomDropdownInputWrapperNormal: {
    borderColor: colors.mainColor,
  },
  roomDropdownText: {
    flex: 1,
  },
  roomDropdownTextPlaceholder: {
    color: colors.gray,
  },
  roomDropdownTextSelected: {
    color: colors.textDark,
  },
  roomDropdownError: {
    marginTop: 4,
  },
  roomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomModalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    maxHeight: '70%',
  },
  roomModalTitle: {
    marginBottom: 10,
  },
  roomModalSearchInput: {
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  roomModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  roomModalItemBooked: {
    opacity: 0.6,
  },
  roomModalItemText: {
    color: '#333',
  },
  roomModalItemTextBooked: {
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  roomModalItemTextSelected: {
    color: colors.mainColor,
  },
  roomModalNoResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
