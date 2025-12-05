import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../../constants/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flex: 1,
  },

  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#0a1f44',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 4,
  },
  pgName: {
    fontSize: 16,
    color: colors.mainColor,
  },
  pgAddress: {
    color: '#5c6b8a',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: width * 0.24,
    marginLeft: 12,
  },
  statusPillExpired: {
    backgroundColor: '#ffebed',
  },
  statusPillActive: {
    backgroundColor: '#e7f7ef',
  },
  statusText: {
    fontSize: 11,
  },
  statusTextExpired: {
    color: colors.error,
  },
  statusTextActive: {
    color: '#1b8f4d',
  },
  statusDays: {
    color: colors.black,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e7f0',
    marginVertical: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e6f5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f8fbff',
    marginRight: 12,
  },
  scheduleCardLast: {
    marginRight: 0,
  },
  scheduleLabel: {
    color: '#7f8ca3',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f0f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    color: '#8fa1b9',
  },
  detailValue: {
    fontSize: 15,
    marginTop: 2,
  },
  callButton: {
    marginTop: 20,
    backgroundColor: colors.mainColor,
  },
});
