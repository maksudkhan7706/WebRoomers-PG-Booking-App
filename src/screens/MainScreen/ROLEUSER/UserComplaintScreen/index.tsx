import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
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
  fetchComplaintPurposes,
  fetchLandlordProperty,
  fetchUsersComplaintList,
  submitUserComplaint,
} from '../../../../store/mainSlice';
import { useIsFocused } from '@react-navigation/native';
import AppImagePlaceholder from '../../../../ui/AppImagePlaceholder';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import AppButton from '../../../../ui/AppButton';
import DeleteModal from '../../../../ui/DeleteModal';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import Feather from 'react-native-vector-icons/Feather';

const UserComplaintScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const {
    apiUserData,
    usersComplaintList,
    complaintPurposes,
    landlordProperties,
    loading,
  } = useSelector((state: RootState) => state.main);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<{
    property?: string;
    purpose: string;
    roomNumber: string;
    description: string;
    image: any[] | null;
  }>({
    property: '',
    purpose: '',
    roomNumber: '',
    description: '',
    image: null,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (apiUserData?.data?.property_title && !form.property) {
      setForm(prev => ({ ...prev, property: apiUserData.data.property_title }));
    }
  }, [apiUserData]);

  const fetchData = useCallback(async () => {
    try {
      const payload: any = {
        company_id: userData?.company_id,
        id: userData?.user_id,
        user_type: userData?.user_type,
      };
      await dispatch(fetchUsersComplaintList(payload));
    } catch (error) {
      appLog('UserComplaintScreen', 'Error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    dispatch(
      fetchComplaintPurposes({ company_id: userData?.company_id }),
    );
    dispatch(
      fetchLandlordProperty({
        company_id: userData?.company_id,
        landlord_id: apiUserData?.data?.landlord_id,
      }),
    );
  }, [isFocused]);

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
      const status = item?.status?.toLowerCase() || '';
      const description = item?.description?.toLowerCase() || '';
      return (
        property.includes(query) ||
        purpose.includes(query) ||
        status.includes(query) ||
        description.includes(query)
      );
    });
  }, [listData, searchQuery]);

  const validateForm = () => {
    let temp: any = {};
    if (!form.property) temp.property = 'Please select a property';
    if (!form.purpose) temp.purpose = 'Please select a purpose';
    if (!form.roomNumber) temp.roomNumber = 'Room number is required';
    if (!form.description) temp.description = 'Description is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const payload: any = {
      company_id: userData?.company_id,
      user_id: userData?.user_id,
      landlord_id: apiUserData?.data?.landlord_id,
      purpose_id: form.purpose,
      room_number: form.roomNumber,
      description: form.description,
    };
    // Agar image hai to file attach karo
    if (form.image && form.image[0]?.uri) {
      payload.complaint_pic = {
        uri: form.image[0].uri,
        type: form.image[0].type || 'image/jpeg',
        name: form.image[0].fileName || 'complaint.jpg',
      };
    }
    try {
      const res = await dispatch(submitUserComplaint(payload)).unwrap();
      if (res?.success) {
        setShowModal(false);
        showSuccessMsg(res.message);
        fetchData(); // list refresh
        setForm({
          property: '',
          purpose: '',
          roomNumber: '',
          description: '',
          image: null,
        });
      } else {
        setShowModal(false);
        showErrorMsg(res?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', String(error));
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
    const status = item.status || 'Pending';
    const statusColor =
      status === 'Resolved'
        ? colors.succes
        : status === 'Rejected'
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
              {item.property_title || 'My Property'}
            </Typography>
            <Typography variant="caption" style={styles.cardSubtitle}>
              Purpose: {item.purpose_name || '-'}
            </Typography>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}25` },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={[styles.statusText, { color: statusColor }]}
            >
              {status}
            </Typography>
          </View>
        </View>

        <Typography variant="caption" style={styles.descriptionLabel}>
          Description
        </Typography>
        <Typography variant="body" style={styles.descriptionText}>
          {item.description || '-'}
        </Typography>

        <View style={styles.metaRow}>
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
          <View style={styles.metaItem}>
            <Typography variant="caption" style={styles.metaLabel}>
              Ticket ID
            </Typography>
            <Typography
              variant="label"
              weight="medium"
              style={styles.metaValue}
            >
              #{item.complaint_id || '--'}
            </Typography>
          </View>
        </View>

        <View style={styles.imageContainer}>
          {item?.complaint_image ? (
            <AppImage
              source={{ uri: item.complaint_image }}
              style={styles.complaintImg}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={24} color={colors.gray} />
              <Typography variant="caption" style={styles.placeholderText}>
                No Image
              </Typography>
            </View>
          )}
        </View>

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
              }}
              colors={[colors.mainColor]}
              tintColor={colors.mainColor}
            />
          }
        />
      )}
      {/*Add Complaint Button */}
      <AppButton
        style={styles.addButton}
        title={'+ Add Complaint'}
        onPress={() => {
          setForm(prev => ({
            ...prev,
            purpose: '',
            roomNumber: '',
            description: '',
            image: null,
          }));
          setErrors({});
          setShowModal(true);
        }}
      />
      {/*Add Complaint Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Typography
                variant="body"
                weight="medium"
                style={styles.modalTitle}
              >
                Add Complaint
              </Typography>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                hitSlop={22}
              >
                <Typography variant="body" weight="medium">
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <AppTextInput
                label="Property"
                placeholder="Enter Property Name"
                value={form.property}
                onChangeText={text => setForm({ ...form, property: text })}
                editable={false}
              />
              <AppCustomDropdown
                label="Releted to *"
                data={complaintPurposes}
                selectedValues={form.purpose ? [form.purpose] : []}
                onSelect={value =>
                  setForm({
                    ...form,
                    purpose: Array.isArray(value)
                      ? value[0]
                      : (value as string),
                  })
                }
                dropdownContainerStyle={{
                  height: '40%',
                }}
                error={errors.purpose}
              />

              <AppTextInput
                label="Room Number *"
                placeholder="Enter room number"
                value={form.roomNumber}
                onChangeText={text => setForm({ ...form, roomNumber: text })}
                error={errors.roomNumber}
              />

              <AppTextInput
                label="Description *"
                placeholder="Enter complaint details"
                value={form.description}
                multiline
                onChangeText={text => setForm({ ...form, description: text })}
                error={errors.description}
                inputHeight={80}
                containerStyle={{
                  marginTop: -5,
                  height: 110,
                  marginBottom: 15,
                }}
              />
              <ImagePickerInput
                label="Attach Image (optional)"
                value={form.image}
                onSelect={file => setForm({ ...form, image: file })}
              />
              <AppButton
                title="Submit Complaint"
                onPress={handleSubmit}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

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

export default UserComplaintScreen;
