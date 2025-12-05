import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  bankDetailsCard: {
    backgroundColor: '#f1fbf5',
    borderColor: '#cfeedd',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bankCardTitle: {
    color: '#0b8a34',
    marginBottom: 12,
    fontSize: 16,
  },
  bankRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#e0f2e9',
    borderBottomWidth: 1,
  },
  bankRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankRowIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0b8a34',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bankRowLabel: {
    color: '#4c4c4c',
    fontSize: 13,
  },
  bankRowValue: {
    color: '#0b8a34',
    fontSize: 13,
    textAlign: 'right',
  },
  bankRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  qrSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
    gap: 8,
  },
  qrSectionTitle: {
    color: '#0b8a34',
  },
  downloadIconButton: {
    padding: 4,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cfeedd',
    backgroundColor: '#fff',
  },
  qrCaption: {
    marginTop: 8,
    color: '#4c4c4c',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 160,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
  },
  paymentFormCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    elevation: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  noBankDetailsCard: {
    backgroundColor: '#fff',
    borderColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningTextWrap: {
    flex: 1,
  },
  warningText: {
    color: '#c62828',
    fontSize: 16,
  },
  warningSubText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  ownerDetailsCard: {
    backgroundColor: '#fffaf0',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    width: '100%',
  },
  ownerDetailsTitle: {
    color: '#8a6d1d',
    marginBottom: 12,
    fontSize: 15,
  },
  ownerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  ownerDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerDetailIcon: {
    marginRight: 6,
  },
  ownerDetailValue: {
    color: '#0b8a34',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  linkText: {
    color: '#0b8a34',
    textDecorationLine: 'underline',
  },
  paymentModeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  paymentModeTitle: {
    color: colors.textDark,
    marginBottom: 12,
    fontSize: 16,
  },
  paymentModeOptions: {
    gap: 10,
  },
  paymentModeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  paymentModeOptionActive: {
    borderColor: colors.mainColor || '#0b8a34',
    backgroundColor: '#f0f9f4',
  },
  paymentModeIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  paymentModeLabel: {
    color: colors.textDark,
    fontSize: 14,
  },
  paymentModeLabelActive: {
    color: colors.mainColor || '#0b8a34',
  },
  errorText: {
    color: colors.error || '#dc3545',
    fontSize: 12,
    marginBottom: 8,
  },
  cashPaymentCard: {
    backgroundColor: '#fff9e6',
    borderColor: '#ffe082',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  cashPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cashPaymentTitle: {
    color: colors.mainColor || '#0b8a34',
    marginLeft: 10,
    fontSize: 16,
  },
  cashPaymentDesc: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
});
