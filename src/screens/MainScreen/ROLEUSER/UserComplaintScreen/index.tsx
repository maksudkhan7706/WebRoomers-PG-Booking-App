import React, { useCallback, useEffect, useState } from 'react';
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
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';

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
      appLog('UserComplaintScreen', 'Payload', payload);
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
    dispatch(fetchComplaintPurposes({ company_id: userData?.company_id }));
    dispatch(
      fetchLandlordProperty({
        company_id: userData?.company_id,
        landlord_id: apiUserData?.data?.landlord_id,
      }),
    );
  }, [isFocused]);

  const listData = Array.isArray(usersComplaintList)
    ? usersComplaintList
    : Object.values(usersComplaintList || {});

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
    appLog('UserComplaintScreen', 'submitUserComplaint payload', payload);
    try {
      const res = await dispatch(submitUserComplaint(payload)).unwrap();
      appLog('UserComplaintScreen', 'submitUserComplaint res', res);
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

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Typography variant="body" weight="medium">
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
          {item.status}
        </Typography>
      </View>

      <View style={styles.infoRow}>
        <Typography variant="label" weight="medium">
          Date:
        </Typography>
        <Typography variant="label" weight="regular" color={colors.gray}>
          {' '}
          {item.created_at}
        </Typography>
      </View>

      <View style={styles.imageContainer}>
        <Typography weight="medium" variant="label">
          Image:
        </Typography>
        <View style={styles.imageWrapper}>
          {item?.complaint_image ? (
            <AppImage
              source={{ uri: item.complaint_image }}
              style={styles.complaintImg}
              resizeMode="stretch"
            />
          ) : (
            <AppImagePlaceholder style={styles.complaintImg} />
          )}
        </View>
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
    </View>
  );

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
    </View>
  );
};

export default UserComplaintScreen;
