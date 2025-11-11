import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import AppImage from '../../../../ui/AppImage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { appLog } from '../../../../utils/appLog';
import {
  deleteComplaint,
  fetchUsersComplaintList,
  updateComplaintStatus,
} from '../../../../store/mainSlice';
import { useIsFocused } from '@react-navigation/native';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';

const LandlordComplaintScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { usersComplaintList, loading } = useSelector(
    (state: RootState) => state.main,
  );
  const [refreshing, setRefreshing] = useState(false);

  //Fetch complaints
  const fetchData = async () => {
    try {
      const payload: any = {
        company_id: userData?.company_id,
        id: userData?.user_id,
        user_type: userData?.user_type,
      };
      await dispatch(fetchUsersComplaintList(payload));
    } catch (error) {
      appLog('LandlordComplaintScreen', 'Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const listData = Array.isArray(usersComplaintList)
    ? usersComplaintList
    : Object.values(usersComplaintList || {});

  const statusList = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  //Ye har card ke liye individual dropdown value store karega
  const [selectedStatuses, setSelectedStatuses] = useState<{
    [key: string]: string;
  }>({});

  //Handle Status Update API
  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    const currentStatus =
      selectedStatuses[complaintId] ??
      (listData as any[]).find((i: any) => i.complaint_id === complaintId)
        ?.status;
    //Agar status same hai to API call mat karo
    if (currentStatus === newStatus) {
      appLog(
        'updateComplaintStatus',
        'Skipped duplicate call for',
        complaintId,
      );
      return;
    }
    try {
      const payload = {
        company_id: userData?.company_id,
        complaint_id: complaintId,
        status: newStatus,
      };
      appLog('updateComplaintStatus', 'payload', payload);
      const res = await dispatch(updateComplaintStatus(payload)).unwrap();
      appLog('updateComplaintStatus', 'response', res);
      if (res?.success) {
        showSuccessMsg(res?.message || 'Status updated successfully');
        setSelectedStatuses(prev => ({
          ...prev,
          [complaintId]: newStatus,
        }));
      } else {
        showErrorMsg(res?.message || 'Failed to update status');
      }
    } catch (error) {
      showErrorMsg('Something went wrong while updating status.');
    }
  };

  const handleDeleteComplaint = (complaintId: string) => {
    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const payload = {
                company_id: userData?.company_id,
                complaint_id: complaintId,
              };
              const res = await dispatch(deleteComplaint(payload)).unwrap();
              if (res?.success) {
                showSuccessMsg(
                  res?.message || 'Complaint deleted successfully',
                );
                fetchData(); // refresh list
              } else {
                showErrorMsg(res?.message || 'Failed to delete complaint');
              }
            } catch (error) {
              showErrorMsg('Something went wrong while deleting complaint.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: any) => {
    const currentStatus =
      selectedStatuses[item.complaint_id] ?? item.status ?? 'Pending';

    return (
      <View style={styles.card}>
        <Typography
          variant="body"
          weight="medium"
          numberOfLines={2}
          style={{ width: '60%' }}
        >
          {item.property_title}
        </Typography>

        <View style={styles.infoRow}>
          <Typography variant="label" weight="medium">
            Purpose:
          </Typography>
          <Typography variant="label" weight="regular" color={colors.gray}>
            {' '}
            {item.purpose_name}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="label" weight="medium">
            Description:
          </Typography>
          <Typography variant="label" weight="regular" color={colors.gray}>
            {' '}
            {item.description}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="label" weight="medium">
            Status:
          </Typography>
          <Typography variant="label" weight="regular" color={colors.gray}>
            {' '}
            {currentStatus}
          </Typography>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteComplaint(item.complaint_id)}
          style={{
            marginTop: 22,
            backgroundColor: colors.red,
            paddingVertical: 6,
            borderRadius: 5,
            alignItems: 'center',
          }}
        >
          <Typography color={colors.white} weight="medium">
            Delete Complaint
          </Typography>
        </TouchableOpacity>
        
        <AppCustomDropdown
          label="Update Status"
          data={statusList}
          selectedValues={[currentStatus]} //directly pass array
          onSelect={value => {
            const newVal = Array.isArray(value) ? value[0] : value;
            // prevent same value API call
            if (newVal !== currentStatus) {
              handleStatusChange(item.complaint_id, newVal);
            }
          }}
          inputWrapperStyle={styles.dropdownConatiner}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Complaint" showBack />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loaderText} color={colors.gray}>
            Loading complaints...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item: any) => String(item?.complaint_id ?? '')}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            listData.length === 0 && styles.emptyContentContainer,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography color={colors.gray} weight="medium">
                No complaints found.
              </Typography>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchData();
                setRefreshing(false);
              }}
              colors={[colors.mainColor]}
              tintColor={colors.mainColor}
            />
          }
        />
      )}
    </View>
  );
};

export default LandlordComplaintScreen;
