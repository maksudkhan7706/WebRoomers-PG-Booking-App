import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 14,
    paddingBottom: 100,
  },
  // Card Styles
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  // Room Statistics Header
  roomStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#F8FAFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E6EF',
  },
  roomStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    marginHorizontal: 10,
    paddingLeft: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
    color: '#7A869A',
  },
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  pgTitle: {
    fontSize: 15,
    marginBottom: 6,
    color: colors.textDark,
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#F0F7FF',
  },
  propertyCode: {
    marginLeft: 4,
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    // alignSelf: 'flex-start',
  },
  // Slider Container
  sliderContainer: {
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 6,
  },
  // Card Content
  cardContent: {
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  categoryRow: {
    alignItems: 'flex-start',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    marginLeft: 6,
    color: colors.textDark,
    fontSize: 13,
  },
  categoryContainer: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  roomsActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    height: 65,
  },
  addRoomsButton: {
    minWidth: 110,
    height: 40,
    marginTop: 6,
    marginBottom: 0,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Legacy styles (keeping for compatibility)
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  roomCommon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    width: '100%',
  },
});
