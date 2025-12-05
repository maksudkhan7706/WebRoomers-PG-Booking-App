import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 12,
    paddingBottom: 140,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    textAlign: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2FF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  pgTitle: {
    color: colors.textDark || '#0F172A',
    marginBottom: 4,
    fontSize: 16,
    textTransform: 'capitalize',
    textDecorationLine: 'underline',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: '#475467',
    flex: 1,
  },
  statusColumn: {
    minWidth: 120,
    alignItems: 'flex-end',
    gap: 10,
  },
  statusEntry: {
    width: '100%',
    alignItems: 'flex-end',
    flexDirection: 'column',
    gap: 4,
  },
  statusLabel: {
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#0F172A',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
  },
  infoTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    color: '#94A3B8',
  },
  paymentDetails: {
    borderWidth: 1,
    borderColor: '#EEF2FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  paymentColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  paymentIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    marginVertical: 6,
    marginHorizontal: 2,
    backgroundColor: '#E2E8F0',
  },
  paymentText: {
    flex: 1,
  },
  paymentLabel: {
    color: '#94A3B8',
    textAlign: 'center',
    minHeight: 32,
    lineHeight: 15,
    paddingHorizontal: 4,
  },
  paymentValue: {
    color: '#0F172A',
    marginTop: 2,
    textAlign: 'center',
  },
  actionFooter: {
    marginTop: 4,
  },
  actionFooterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  actionFooterColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  footerButton: {
    flex: 1,
    minWidth: 100,
    maxWidth: '100%',
    flexShrink: 1,
    flexGrow: 1,
    width: undefined,
  },
  footerButtonFullWidth: {
    width: '100%',
    minWidth: '100%',
    maxWidth: '100%',
  },
  viewBtn: {
    height: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.mainColor,
  },
  paymentDetailsBtn: {
    height: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  paymentBtn: {
    height: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0E9F6E',
  },
  checkoutCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 12,
  },
  checkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkoutHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkoutTitle: {
    color: colors.textDark,
    fontSize: 15,
  },
  checkoutContent: {
    gap: 12,
  },
  checkoutRow: {
    gap: 6,
  },
  checkoutLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  checkoutValue: {
    color: colors.textDark,
    marginLeft: 22,
  },
  checkoutReason: {
    color: colors.textDark,
    marginLeft: 22,
    lineHeight: 20,
  },
});
