import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8ecf0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderInfo: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    color: colors.textDark,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
  },
  descriptionLabel: {
    color: colors.gray,
    marginBottom: 4,
  },
  descriptionText: {
    color: colors.textDark,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: colors.gray,
    marginBottom: 4,
  },
  metaValue: {
    color: colors.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  descriptionWrapper: {
    marginTop: 8,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  imageWrapper: {
    height: 120,
  },
  complaintImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.logoBg,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.gray,
    marginTop: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(255,77,77,0.2)',
    backgroundColor: 'rgba(255,77,77,0.05)',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    borderWidth: 1,
  },
  deleteText: {
    marginLeft: 8,
    color: colors.error,
  },
  addButton: {
    position: 'absolute',
    bottom: 135,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    elevation: 3,
    width: 180,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchInput: {
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  modalTitle: {
    color: colors.black,
  },

  submitBtn: {
    marginTop: 20,
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
});
