import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#F8F8F8',
  },
  listContent: {
    padding: 10,
    paddingBottom: 200,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
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
    width: '30%',
    fontWeight: '500',
  },
  value: {
    width: '70%',
    textAlign: 'right',
  },
  pendingText: {
    width: '70%',
    textAlign: 'right',
    color: '#FFA500',
    fontWeight: '500',
  },
  paymentBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal:10,
    paddingVertical:8,
    maxWidth: '70%',
  },
  leftText: {
    textAlign: 'left',
  },
  statusBadge: {
    paddingHorizontal: 5,
    borderRadius: 5,
    height:20,
    justifyContent:'center',
    alignSelf: 'center',
  },
  statusText: {
    color: '#fff',
  },
  statusRow: {
    marginTop: 5,
  },
  actionRow: {
    marginTop: 5,
    alignItems: 'center',
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    gap: 8,
  },
  viewBtn: {
    width: 50,
    height: 26,
    backgroundColor: '#1976D2',
  },
  paymentBtn: {
    width: 50,
    height: 26,
    backgroundColor: '#4CAF50',
  },
});
