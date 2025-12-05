import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import styles from './styles';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { appLog } from '../../../../utils/appLog';
import {
  deleteComplaint,
  fetchUsersComplaintList,
  updateComplaintStatus,
} from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import AppButton from '../../../../ui/AppButton';
import DeleteModal from '../../../../ui/DeleteModal';
import { statusList } from '../../../../constants/dummyData';
import AppTextInput from '../../../../ui/AppTextInput';
import Feather from 'react-native-vector-icons/Feather';

const LandlordComplaintScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { usersComplaintList, loading } = useSelector(
    (state: RootState) => state.main,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  //Fetch complaints
  const fetchData = async () => {
    try {
      const payload: any = {
        company_id: userData?.company_id,
        id: userData?.user_id,
        user_type: userData?.user_type,
        property_id: userData?.assigned_pg_ids,
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

  const listData = useMemo(
    () =>
      Array.isArray(usersComplaintList)
        ? usersComplaintList
        : Object.values(usersComplaintList || {}),
    [usersComplaintList],
  );

  const filteredComplaints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return listData;
    }
    return listData.filter((item: any) => {
      const property = item?.property_title?.toLowerCase() || '';
      const purpose = item?.purpose_name?.toLowerCase() || '';
      const description = item?.description?.toLowerCase() || '';
      const status = item?.status?.toLowerCase() || '';
      return (
        property.includes(query) ||
        purpose.includes(query) ||
        description.includes(query) ||
        status.includes(query)
      );
    });
  }, [listData, searchQuery]);

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
      return;
    }
    try {
      const payload = {
        company_id: userData?.company_id,
        complaint_id: complaintId,
        status: newStatus,
      };
      const res = await dispatch(updateComplaintStatus(payload)).unwrap();
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

  const openDeleteModal = (complaint: any) => {
    setSelectedComplaint(complaint);
    setDeleteModalVisible(true);
  };

  const confirmDeleteComplaint = async () => {
    if (!selectedComplaint?.complaint_id) {
      setDeleteModalVisible(false);
      return;
    }
    try {
      setDeleting(true);
      const payload = {
        company_id: userData?.company_id,
        complaint_id: selectedComplaint.complaint_id,
      };
      const res = await dispatch(deleteComplaint(payload)).unwrap();
      if (res?.success) {
        showSuccessMsg(res?.message || 'Complaint deleted successfully');
        setDeleteModalVisible(false);
        fetchData();
      } else {
        showErrorMsg(res?.message || 'Failed to delete complaint');
      }
    } catch (error) {
      showErrorMsg('Something went wrong while deleting complaint.');
    } finally {
      setDeleting(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const currentStatus =
      selectedStatuses[item.complaint_id] ?? item.status ?? 'Pending';
    const statusColor =
      currentStatus === 'Resolved'
        ? colors.succes
        : currentStatus === 'Rejected'
        ? colors.red
        : colors.pending;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderInfo}>
            <Typography
              variant="subheading"
              weight="bold"
              style={styles.cardTitle}
              numberOfLines={2}
            >
              {item.property_title || 'Unnamed Property'}
            </Typography>
            <Typography
              variant="caption"
              weight="medium"
              style={styles.cardSubTitle}
            >
              Purpose: {item.purpose_name || '-'}
            </Typography>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}30` },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={[styles.statusText, { color: statusColor }]}
            >
              {currentStatus}
            </Typography>
          </View>
        </View>

        <View style={styles.descriptionWrapper}>
          <Typography variant="caption" style={styles.descriptionLabel}>
            Description
          </Typography>
          <Typography variant="body" style={styles.descriptionText}>
            {item.description || 'No description provided.'}
          </Typography>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Typography variant="caption" style={styles.metaLabel}>
              Submitted By
            </Typography>
            <Typography
              variant="label"
              weight="medium"
              style={styles.metaValue}
            >
              {item.user_name || 'Tenant'}
            </Typography>
          </View>
          <View style={styles.metaItem}>
            <Typography variant="caption" style={styles.metaLabel}>
              Date
            </Typography>
            <Typography
              variant="label"
              weight="medium"
              style={styles.metaValue}
            >
              {item.created_at || '--'}
            </Typography>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => openDeleteModal(item)}
            style={styles.deleteButton}
            activeOpacity={0.8}
          >
            <Feather name="trash-2" size={16} color={colors.error} />
            <Typography
              color={colors.white}
              weight="medium"
              style={styles.deleteText}
            >
              Delete Complaint
            </Typography>
          </TouchableOpacity>
          <View style={styles.dropdownWrapper}>
            <Typography variant="caption" style={styles.dropdownLabel}>
              Update Status
            </Typography>
            <AppCustomDropdown
              data={statusList}
              selectedValues={[currentStatus]}
              onSelect={value => {
                const newVal = Array.isArray(value) ? value[0] : value;
                if (newVal !== currentStatus) {
                  handleStatusChange(item.complaint_id, newVal);
                }
              }}
              inputWrapperStyle={styles.dropdownInput}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Complaint" showBack rightIcon={false} />

      <View style={styles.searchContainer}>
        <AppTextInput
          placeholder="Search by property, purpose, status, or description"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInputContainer}
          style={styles.searchInput}
          leftIcon={<Feather name="search" size={20} color={colors.gray} />}
          rightIcon={
            searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={10}
                activeOpacity={0.7}
              >
                <Feather name="x" size={20} color={colors.gray} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loaderText} color={colors.gray}>
            Loading complaints...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          renderItem={renderItem}
          keyExtractor={(item: any) => String(item?.complaint_id ?? '')}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            filteredComplaints.length === 0 && styles.emptyContentContainer,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography color={colors.gray} weight="medium">
                {searchQuery
                  ? 'No complaints match your search.'
                  : 'No complaints found.'}
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
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Complaint?"
        subtitle="Are you sure you want to delete this complaint?"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteComplaint}
        loading={deleting}
      />
    </View>
  );
};

export default LandlordComplaintScreen;
