import { StyleSheet, Platform } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 140,
    rowGap: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  },
  cardHeaderInfo: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    color: colors.textDark,
    marginBottom: 4,
  },
  cardSubTitle: {
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
  descriptionWrapper: {
    marginTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
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
    marginTop: 10,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
    paddingBottom: 10,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 25,
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(255,77,77,0.2)',
    backgroundColor: 'rgba(255,77,77,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 185,
    justifyContent: 'center',
    marginTop: 3,
    borderWidth: 1,
  },
  deleteText: {
    marginLeft: 8,
    color: colors.error,
  },
  dropdownWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dropdownLabel: {
    marginBottom: 6,
    color: colors.gray,
  },
  dropdownInput: {
    width: '100%',
    borderRadius: 10,
    borderColor: '#d6d9de',
    height: 44,
    paddingHorizontal: 12,
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
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
  dropdownConatiner: {
    borderColor: '#d6d9de',
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
