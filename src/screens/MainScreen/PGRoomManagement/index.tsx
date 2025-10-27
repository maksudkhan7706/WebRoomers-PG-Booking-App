import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import styles from './styles';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppButton from '../../../ui/AppButton';
import AppCustomDropdown from '../../../ui/AppCustomDropdown';
import AppTextInput from '../../../ui/AppTextInput';
import ImagePickerInput from '../../../ui/ImagePickerInput';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  fetchPgRooms,
  addEditPgRoom,
  fetchAllRoomFeatures,
  deletePgRoom,
} from '../../../store/mainSlice';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatDate } from '../../../utils/formatDate';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';

const PGRoomManagement = () => {
  const route = useRoute();
  const { roomId, companyId }: any = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { pgRooms, loading, allRoomFeatures } = useSelector(
    (state: RootState) => state.main,
  );
  const { userData } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<string[]>([]);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [extraFeatures, setExtraFeatures] = useState<any[]>([]);
  const [images, setImages] = useState<any>({});
  const [editRoomData, setEditRoomData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const rooms = pgRooms?.data || [];
  //Fetch rooms when component mounts
  useEffect(() => {
    if (roomId && companyId) {
      dispatch(fetchPgRooms({ pg_id: roomId, company_id: companyId }));
      dispatch(fetchAllRoomFeatures({ company_id: companyId }));
    }
  }, [dispatch, roomId, companyId]);
  //Dropdown options (memoized)
  const roomTypeOptions = useMemo(
    () => [
      { label: 'Single Occupancy', value: 'single' },
      { label: 'Double Occupancy', value: 'double' },
      { label: 'Triple Occupancy', value: 'triple' },
      { label: 'Dormitory', value: 'dormitory' },
    ],
    [],
  );
  //Toggle Facilities
  const toggleMultiSelect = useCallback((feature: any) => {
    setExtraFeatures(prev =>
      prev.some(item => item?.id === feature.id)
        ? prev.filter(item => item?.id !== feature.id)
        : [...prev, feature],
    );
  }, []);

  const handleImageSelect = useCallback((key: string, file: any) => {
    setImages((prev: any) => ({ ...prev, [key]: file }));
  }, []);

  //Handle Add/Edit Room
  const handleSaveRoom = useCallback(async () => {
    const facilityIds = extraFeatures.map(item => item?.id).join(','); // comma-separated IDs
    if (!roomName || !roomType.length || !monthlyRent) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company_id: companyId,
        pg_id: roomId,
        landlord_id: userData?.user_id,
        room_number: roomName,
        room_type: roomType[0],
        room_price: monthlyRent,
        security_deposit: securityDeposit,
        room_description: roomDescription,
        facilities: facilityIds,
        room_images: images?.roomImage ? [images.roomImage] : [],
        ...(editRoomData?.id ? { room_id: editRoomData.id } : {}), // Only for edit
      };

      const resultAction = await dispatch(addEditPgRoom(payload));

      if (addEditPgRoom.fulfilled.match(resultAction)) {
        showSuccessMsg(
          editRoomData
            ? 'Room updated successfully.'
            : 'Room added successfully.',
          resultAction.payload?.message || 'Room saved successfully.',
        );

        //Refresh room list
        dispatch(fetchPgRooms({ pg_id: roomId, company_id: companyId }));

        //Reset if new add
        if (!editRoomData) {
          setRoomName('');
          setRoomType([]);
          setMonthlyRent('');
          setSecurityDeposit('');
          setRoomDescription('');
          setExtraFeatures([]);
          setImages({});
        }
        // ✅ Go back to manage tab
        setActiveTab('manage');
        setEditRoomData(null);
      } else {
        showErrorMsg('Something went wrong.');
      }
    } catch (error: any) {
      showErrorMsg('Error', error.message || 'Failed to save room.');
    } finally {
      setSaving(false);
    }
  }, [
    roomName,
    roomType,
    monthlyRent,
    securityDeposit,
    roomDescription,
    extraFeatures,
    images,
    editRoomData,
    companyId,
    roomId,
    dispatch,
    userData,
  ]);
  //Render Room Item
  const renderRoom = useCallback(({ item: room }: any) => {
    console.log('room =====', room);
    return (
      <View style={styles.roomCard}>
        <View style={styles.roomHeader}>
          <Typography variant="body" weight="bold" style={styles.roomTitle}>
            {room?.room_number} (
            {room?.room_type
              ? room.room_type.charAt(0).toUpperCase() +
                room.room_type.slice(1).toLowerCase()
              : ''}
            )
          </Typography>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Typography
              variant="body"
              weight="medium"
              style={{ color: colors.succes }}
            >
              Available
            </Typography>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Typography variant="label" color={colors.gray}>
              Monthly Rent:
            </Typography>
            <Typography variant="label">{room?.price}</Typography>
          </View>
          <View style={styles.infoCol}>
            <Typography variant="label" color={colors.gray}>
              Security Deposit:
            </Typography>
            <Typography variant="label">{room?.security_deposit}</Typography>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Typography variant="label" color={colors.gray}>
              Room Type:
            </Typography>
            <Typography variant="label">
              {room?.room_type
                ? room.room_type.charAt(0).toUpperCase() +
                  room.room_type.slice(1).toLowerCase()
                : ''}
            </Typography>
          </View>
          <View style={styles.infoCol}>
            <Typography variant="label" color={colors.gray}>
              Added On:
            </Typography>
            <Typography variant="label">
              {formatDate(room?.created_at)}
            </Typography>
          </View>
        </View>
        <Typography style={{ marginTop: 10 }} color={colors.gray}>
          Description:
        </Typography>
        <Typography variant="label">{room?.description}</Typography>
        <Typography color={colors.gray} style={{ marginTop: 10 }}>
          Facilities:
        </Typography>
        <View style={styles.facilityWrap}>
          {(room?.facilities || []).map((item: any, index: number) => (
            <View key={index} style={styles.facilityItem}>
              <Icon name="check" size={16} color={colors.mainColor} />
              <Typography
                variant="label"
                style={{ color: colors.mainColor, marginLeft: 4 }}
              >
                {item}
              </Typography>
            </View>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            title="Edit"
            onPress={() => {
              setEditRoomData(room);
              setRoomName(room?.room_number || '');
              setRoomType(room?.room_type ? [room.room_type] : []);
              setMonthlyRent(room.price || '');
              setSecurityDeposit(room.security_deposit || '');
              setRoomDescription(room.description || '');
              //Match facilities correctly
              const matchedFeatures = (allRoomFeatures || []).filter((f: any) =>
                room.facilities?.includes(f.name),
              );
              setExtraFeatures(matchedFeatures);
              setImages({ roomImage: room.images || [] }); // agar multiple images hai
              setActiveTab('add');
            }}
            style={{ flex: 1, height: 40 }}
          />
          <AppButton
            title="Delete"
            onPress={() => {
              Alert.alert(
                'Confirm Delete',
                `Are you sure you want to delete "${room?.room_number}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        const payload = {
                          room_id: room.id,
                          company_id: companyId,
                        };
                        const result = await dispatch(deletePgRoom(payload));
                        if (deletePgRoom.fulfilled.match(result)) {
                          showSuccessMsg('Room deleted successfully.');
                          // Refresh room list
                          dispatch(
                            fetchPgRooms({
                              pg_id: roomId,
                              company_id: companyId,
                            }),
                          );
                        } else {
                          showErrorMsg('Unable to delete room.');
                        }
                      } catch (err: any) {
                        showErrorMsg(
                          'Error',
                          err.message || 'Something went wrong.',
                        );
                      }
                    },
                  },
                ],
              );
            }}
            style={{ flex: 1, height: 40, backgroundColor: colors.error }}
          />
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="PG Room Management" showBack />
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['manage', 'add'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab as 'manage' | 'add');
              if (tab === 'add' && !editRoomData) {
                // reset fields only for new add
                setRoomName('');
                setRoomType([]);
                setMonthlyRent('');
                setSecurityDeposit('');
                setRoomDescription('');
                setExtraFeatures([]);
                setImages({});
              }
              if (tab === 'manage') setEditRoomData(null);
            }}
          >
            <Typography
              variant="body"
              weight="medium"
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === 'manage'
                ? 'Manage Rooms'
                : editRoomData
                ? 'Edit Room'
                : 'Add New Room'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
      {/* Loader or Content */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={{ marginTop: 10 }} color={colors.gray}>
            Loading rooms...
          </Typography>
        </View>
      ) : activeTab === 'manage' ? (
        <FlatList
          data={rooms}
          keyExtractor={item => String(item.id || item.room_number)}
          style={styles.contentConainter}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Typography
              variant="body"
              weight="bold"
              style={styles.sectionHeader}
            >
              Current Rooms
            </Typography>
          }
          ListEmptyComponent={() => (
            <View style={styles.listEmpty}>
              <FontAwesome name="inbox" size={48} color={colors.gray} />
              <Typography
                variant="body"
                weight="bold"
                style={{ marginTop: 12 }}
              >
                No data found
              </Typography>
              <Typography
                variant="label"
                color={colors.gray}
                style={{ marginTop: 6 }}
              >
                There are no rooms available right now. Please add a new room.
              </Typography>
            </View>
          )}
          renderItem={renderRoom}
        />
      ) : (
        <ScrollView
          style={styles.contentConainter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <Typography variant="body" weight="bold" style={styles.sectionHeader}>
            {editRoomData ? 'Edit Room' : 'Add New Room'}
          </Typography>
          {/* Room Name + Type */}
          <View style={[styles.formRow, { marginBottom: 0 }]}>
            <AppTextInput
              label="Room Number/Name"
              placeholder="e.g., Room 101"
              value={roomName}
              onChangeText={setRoomName}
              containerStyle={{ width: '48%' }}
            />
            <View style={{ flex: 1 }}>
              <Typography
                variant="caption"
                weight="medium"
                color={colors.textDark}
                style={{ marginBottom: 6 }}
              >
                Room Type
              </Typography>
              <AppCustomDropdown
                label="Select Room Type"
                data={roomTypeOptions}
                selectedValues={roomType}
                onSelect={setRoomType}
                inputWrapperStyle={{ flex: 1 }}
              />
            </View>
          </View>
          {/* Rent & Deposit */}
          <View style={styles.formRow}>
            <AppTextInput
              label="Monthly Rent (₹)"
              placeholder="e.g., 8000"
              value={monthlyRent}
              onChangeText={setMonthlyRent}
              keyboardType="numeric"
              containerStyle={{ width: '48%' }}
            />
            <AppTextInput
              label="Security Deposit (₹)"
              placeholder="e.g., 10000"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              keyboardType="numeric"
              containerStyle={{ width: '48%' }}
            />
          </View>
          {/* Facilities */}
          <Typography weight="medium" style={{ marginTop: 10 }}>
            Room Facilities
          </Typography>
          <View style={[styles.facilityRow, { flexWrap: 'wrap' }]}>
            {(allRoomFeatures || []).map((feature: any) => {
              const isSelected = extraFeatures.some(
                item => item?.id === feature.id,
              );
              return (
                <TouchableOpacity
                  key={feature.id}
                  onPress={() => toggleMultiSelect(feature)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 30,
                    marginBottom: 10,
                  }}
                >
                  <Icon
                    name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                    size={20}
                    color={isSelected ? colors.mainColor : colors.gray}
                  />
                  <Typography
                    style={{
                      marginLeft: 6,
                      color: isSelected ? colors.mainColor : colors.gray,
                    }}
                  >
                    {feature.name}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Description */}
          <Typography weight="medium" style={{ marginTop: 10 }}>
            Room Description
          </Typography>
          <AppTextInput
            placeholder="Describe the room..."
            value={roomDescription}
            onChangeText={setRoomDescription}
            multiline
            numberOfLines={4}
            containerStyle={styles.descContainer}
          />
          {/* Images */}
          <Typography weight="medium" style={{ marginTop: 20 }}>
            Room Images
          </Typography>
          <ImagePickerInput
            label=""
            value={images.roomImage}
            onSelect={file => handleImageSelect('roomImage', file)}
            multiple={true}
          />
          <AppButton
            title={editRoomData ? 'Update Room' : 'Save Room'}
            style={{
              backgroundColor: editRoomData ? colors.mainColor : 'green',
              marginTop: 20,
            }}
            onPress={handleSaveRoom}
            loading={saving}
            disabled={saving}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default PGRoomManagement;