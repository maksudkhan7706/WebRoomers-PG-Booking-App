import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import colors from '../../../../constants/colors';

interface Styles {
  container: ViewStyle;
  listContent: ViewStyle;
  card: ViewStyle;
  cardHeader: ViewStyle;
  cardMetaLabel: TextStyle;
  cardMetaValue: TextStyle;
  infoGrid: ViewStyle;
  infoItem: ViewStyle;
  infoLabelRow: ViewStyle;
  infoIconWrap: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
  divider: ViewStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  screenshotWrapper: ViewStyle;
  screenshotInner: ViewStyle;
  screenshotImg: ImageStyle;
  screenshotPlaceholder: ViewStyle;
  loaderContainer: ViewStyle;
  loaderText: TextStyle;
  emptyState: ViewStyle;
  modalOverlay: ViewStyle;
  modalCloseBtn: ViewStyle;
  modalCloseText: TextStyle;
  imageContainer: ViewStyle;
  modalImage: ImageStyle;
  screenshotHeader: ViewStyle;
  viewFullLink: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e8f2',
    shadowColor: '#18274b',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardMetaLabel: {
    color: colors.gray,
    marginBottom: 4,
  },
  cardMetaValue: {
    color: colors.textDark,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoItem: {
    width: '40%',
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#eef3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  infoLabel: {
    color: '#8c8fa6',
  },
  infoValue: {
    color: colors.textDark,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#eceff5',
    marginVertical: 18,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  screenshotWrapper: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
    height: 160,
    borderWidth: 1,
    borderColor: '#e3e7f2',
    backgroundColor: '#f5f7fb',
    width: 120,
  },
  screenshotInner: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e3e7f2',
  },
  screenshotImg: {
    width: '100%',
    height: '100%',
  },
  screenshotPlaceholder: {
    marginTop: 10,
    height: 120,
    width: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8ecf0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fb',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: colors.gray,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  modalCloseText: {
    color: colors.white,
  },
  imageContainer: {
    width: '100%',
    height: '75%',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  screenshotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewFullLink: {
    color: colors.mainColor,
    textDecorationLine: 'underline',
  },
} as const);

export default styles;
