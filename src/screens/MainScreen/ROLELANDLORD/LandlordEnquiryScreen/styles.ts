import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#F8F8F8',
  },
  listContent: {
    padding: 10,
    paddingBottom: 200,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontWeight: '500',
  },
  value: {
    width: '70%',
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#fff',
  },

  // ✅ Action section right side layout
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    gap: 8,
  },

  // ✅ Buttons
  viewBtn: {
    width: 80,
    height: 30,
    backgroundColor: '#1976D2',
  },
  paymentBtn: {
    width: 130,
    height: 30,
    backgroundColor: '#19a2b8',
  },
});
