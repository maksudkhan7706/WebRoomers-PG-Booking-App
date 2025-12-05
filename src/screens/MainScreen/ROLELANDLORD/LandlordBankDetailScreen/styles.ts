import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerActionWrapper: {
    marginLeft: 12,
  },
  headerActionBtn: {
    width: 120,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyState: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#e3e6ec',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  listContent: {
    paddingBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    color: colors.gray,
  },
  cardTitle: {
    color: colors.textDark,
  },
  cardSubtitle: {
    color: colors.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  statusText: {
    fontSize: 12,
  },
  infoGrid: {
    borderBottomWidth: 1,
    borderColor: '#eef1f6',
    gap: 12,
    marginBottom: 5,
    paddingBottom: 12,
  },
  infoRowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCellSpacer: {
    flex: 1,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(17,74,130,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoLabel: {
    color: colors.gray,
  },
  infoValue: {
    color: colors.textDark,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  softButton: {
    flex: 0.3,
    borderRadius: 5,
    paddingVertical: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  softButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    borderColor: 'rgba(17,74,130,0.25)',
    backgroundColor: 'rgba(17,74,130,0.06)',
  },
  editButtonText: {
    color: colors.mainColor,
  },
  deleteButton: {
    borderColor: 'rgba(255,77,77,0.2)',
    backgroundColor: 'rgba(255,77,77,0.05)',
  },
  deleteButtonText: {
    color: colors.error,
  },
  qrPreviewBox: {
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    padding: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e7fb',
  },
  qrImage: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  qrLabel: {
    color: colors.mainColor,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 12,
    height: 48,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '95%',
    alignItems: 'center',
    maxHeight: '80%',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewCloseButton: {
    width: '100%',
  },
  confirmModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmModalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  confirmIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    color: colors.textDark,
    marginBottom: 6,
  },
  confirmSubtitle: {
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  confirmCancelBtn: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  confirmDeleteBtn: {
    flex: 1,
  },
  seeMoreText: {
    color: colors.mainColor,
    textDecorationLine: 'underline',
  },
});
