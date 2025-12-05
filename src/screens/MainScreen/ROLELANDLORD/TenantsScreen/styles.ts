import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.logoBg,
  },
  filterScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.mainColor,
    borderColor: colors.mainColor,
  },
  filterText: {
    color: colors.textDark,
    fontSize: 13,
  },
  filterTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardName: {
    color: colors.textDark,
    marginBottom: 4,
  },
  cardEmail: {
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e8ecf0',
    marginVertical: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetailText: {
    color: colors.textDark,
    marginLeft: 6,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  seeDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f4f8',
    flex: 1,
  },
  seeDetailsText: {
    color: colors.mainColor,
    marginRight: 6,
  },
  depositPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    flex: 1,
  },
  depositPaymentText: {
    color: colors.succes,
    marginRight: 6,
  },
  rupeeSign: {
    color: colors.succes,
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
  },
  modalTitle: {
    color: colors.textDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    padding: 15,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalAvatarText: {
    color: colors.white,
    fontSize: 32,
  },
  modalName: {
    color: colors.textDark,
    marginBottom: 8,
  },
  modalStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalStatusText: {
    fontSize: 12,
  },
  modalDetailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    color: colors.gray,
    width: '40%',
  },
  detailValue: {
    color: colors.textDark,
    width: '58%',
    textAlign: 'right',
  },
  // Legacy styles (keeping for compatibility)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    width: '45%',
  },
  value: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '600',
    width: '55%',
    textAlign: 'right',
  },
  deleteButton: {
    flex: 1,
    height: 40,
    marginTop: 30,
    backgroundColor: colors.error,
  },
  headerActionWrapper: {
    marginLeft: 12,
  },
  headerActionBtn: {
    width: 110,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
