import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 50,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffecb5',
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
  },
  warningTitle: {
    color: '#856404',
    marginBottom: 8,
  },
  warningDesc: {
    marginBottom: 15,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  updateButton: {
    marginTop: 30,
    backgroundColor: '#efad4e',
  },

  verifiedCard: {
    backgroundColor: '#e9f9f0',
    borderColor: '#c6f0d4',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  verifiedTitle: {
    color: '#0b8a34',
  },
  verifiedDesc: {
    marginBottom: 15,
    color: '#333',
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  paymentFormCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 30,
  },
});
