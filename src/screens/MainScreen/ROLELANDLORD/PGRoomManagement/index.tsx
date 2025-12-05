import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import styles from './styles';
import colors from '../../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppButton from '../../../../ui/AppButton';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import AppTextInput from '../../../../ui/AppTextInput';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchPgRooms,
  addEditPgRoom,
  fetchAllRoomFeatures,
  deletePgRoom,
} from '../../../../store/mainSlice';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { formatDate } from '../../../../utils/formatDate';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

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
  const [images, setImages] = useState<any>({
    roomImage: [],
    roomVideo: [],
  });
  const [editRoomData, setEditRoomData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [videoPreviewUri, setVideoPreviewUri] = useState<string | null>(null);
  const rooms = pgRooms?.data || [];

  //Fetch rooms when component mounts
  useEffect(() => {
    if (roomId && companyId) {
      dispatch(fetchPgRooms({ pg_id: roomId, company_id: companyId }));
      dispatch(fetchAllRoomFeatures({ company_id: companyId }));
    }
  }, [dispatch, roomId, companyId]);

  useEffect(() => {
    if (editRoomData && allRoomFeatures?.length > 0) {
      const matchedFeatures = (allRoomFeatures || []).filter((f: any) =>
        (editRoomData.facilities || [])
          .map((fac: string) => fac.trim().toLowerCase())
          .includes(f.name.trim().toLowerCase()),
      );
      setExtraFeatures(matchedFeatures);
    }
  }, [editRoomData, allRoomFeatures]);

  //Dropdown options (memoized)
  const roomTypeOptions = useMemo(
    () => [
      { label: 'Single Occupancy', value: '1' },
      { label: 'Double Occupancy', value: '2' },
      { label: 'Triple Occupancy', value: '3' },
      { label: 'Dormitory', value: '50' },
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

  const handleVideoPreview = useCallback((uri?: string) => {
    if (!uri) return;
    setVideoPreviewUri(uri);
    setShowVideoPreview(true);
  }, []);

  //Handle Add/Edit Room
  const handleSaveRoom = useCallback(async () => {
    const facilityIds = extraFeatures.map(item => item?.id).join(',');

    if (!roomName || !roomType.length || !monthlyRent) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('company_id', companyId.toString());
      formData.append('pg_id', roomId.toString());
      formData.append('landlord_id', userData?.user_id?.toString() || '');
      formData.append('user_type', userData?.user_type || 'landlord');
      formData.append('room_number', roomName);
      formData.append('room_type', roomType[0]);
      formData.append('room_price', monthlyRent.toString());
      formData.append('security_deposit', securityDeposit.toString());
      formData.append('room_description', roomDescription);
      formData.append('facilities', facilityIds);
      //Flatten room images and append each
      if (Array.isArray(images?.roomImage)) {
        images.roomImage.forEach(
          (img: { uri: any; fileName: any; type: any }, index: any) => {
            if (img?.uri) {
              formData.append('room_images[]', {
                uri: img.uri,
                name: img.fileName || `image_${index}.jpg`,
                type: img.type || 'image/jpeg',
              });
            }
          },
        );
      }

      const selectedVideo =
        Array.isArray(images?.roomVideo) && images.roomVideo.length > 0
          ? images.roomVideo[0]
          : null;
      if (
        selectedVideo &&
        typeof selectedVideo === 'object' &&
        selectedVideo?.uri &&
        !selectedVideo.uri.startsWith('http')
      ) {
        formData.append('video', {
          uri: selectedVideo.uri,
          name:
            selectedVideo.fileName || selectedVideo.name || 'room_video.mp4',
          type: selectedVideo.type || 'video/mp4',
        });
      }

      if (editRoomData?.id) {
        formData.append('room_id', editRoomData.id.toString());
      }

      const resultAction = await dispatch(addEditPgRoom(formData));
      const response = resultAction?.payload;

      if (response?.success) {
        showSuccessMsg(response?.message);
        dispatch(fetchPgRooms({ pg_id: roomId, company_id: companyId }));

        if (!editRoomData) {
          setRoomName('');
          setRoomType([]);
          setMonthlyRent('');
          setSecurityDeposit('');
          setRoomDescription('');
          setExtraFeatures([]);
          setImages({ roomImage: [], roomVideo: [] });
        }

        setActiveTab('manage');
        setEditRoomData(null);
      } else {
        showErrorMsg(response?.message || 'Something went wrong.');
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
  const renderRoom = useCallback(
    ({ item: room }: any) => {
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
              <Typography variant="label">₹{room?.price}</Typography>
            </View>
            <View style={styles.infoCol}>
              <Typography variant="label" color={colors.gray}>
                Security Deposit:
              </Typography>
              <Typography variant="label">
                {' '}
                ₹{room?.security_deposit}
              </Typography>
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
                setRoomType(() => {
                  if (!room?.room_type) {
                    return [];
                  }
                  const normalizedType = room.room_type.trim().toLowerCase();
                  const matchedOption = roomTypeOptions.find(
                    option =>
                      option.value === room.room_type ||
                      option.label.trim().toLowerCase() === normalizedType,
                  );
                  return matchedOption ? [matchedOption.value] : [];
                });
                setMonthlyRent(room.price || '');
                setSecurityDeposit(room.security_deposit || '');
                setRoomDescription(room.description || '');
                const existingVideo =
                  room?.video ||
                  room?.room_video ||
                  room?.video_url ||
                  (Array.isArray(room?.videos) ? room.videos[0] : null);
                setImages({
                  roomImage: room.images || [],
                  roomVideo: existingVideo
                    ? Array.isArray(existingVideo)
                      ? existingVideo
                      : [existingVideo]
                    : [],
                });
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
    },
    [roomTypeOptions],
  );

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
                setImages({ roomImage: [], roomVideo: [] });
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
          <View style={styles.facilityHeader}>
            <Typography weight="medium">Room Facilities</Typography>
            <Typography variant="caption" color={colors.gray}>
              Tap to select the amenities available in this room
            </Typography>
          </View>
          <View style={styles.facilityGrid}>
            {(allRoomFeatures || []).map((feature: any) => {
              const isSelected = extraFeatures.some(
                item => item?.id === feature.id,
              );
              return (
                <TouchableOpacity
                  key={feature.id}
                  onPress={() => toggleMultiSelect(feature)}
                  activeOpacity={0.85}
                  style={[
                    styles.facilityOption,
                    isSelected && styles.facilityOptionSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.facilityIconWrap,
                      isSelected && styles.facilityIconWrapSelected,
                    ]}
                  >
                    <Icon
                      name={isSelected ? 'check' : 'add'}
                      size={16}
                      color={isSelected ? colors.white : colors.mainColor}
                    />
                  </View>
                  <Typography
                    variant="label"
                    weight="medium"
                    style={[
                      styles.facilityLabel,
                      isSelected && styles.facilityLabelSelected,
                    ]}
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
          <ImagePickerInput
            label="Room Images"
            labelStyle={{ fontSize: 16, marginTop: 5 }}
            value={images.roomImage}
            onSelect={file => handleImageSelect('roomImage', file)}
            multiple={true}
          />
          <ImagePickerInput
            label="Room Video"
            labelStyle={{ fontSize: 16 }}
            pickerPlachholer="Upload / Capture Video"
            value={images.roomVideo}
            onSelect={file => handleImageSelect('roomVideo', file)}
            mediaType="video"
            onPreview={handleVideoPreview}
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
      <Modal
        visible={showVideoPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideoPreview(false)}
        statusBarTranslucent
      >
        <View style={styles.videoPreviewOverlay}>
          <View style={styles.videoPreviewCard}>
            <TouchableOpacity
              style={styles.videoPreviewClose}
              onPress={() => setShowVideoPreview(false)}
            >
              <Icon name="close" size={22} color="#fff" />
            </TouchableOpacity>
            {videoPreviewUri ? (
              <Video
                source={{ uri: videoPreviewUri }}
                style={styles.videoPlayer}
                controls
                resizeMode="contain"
                paused={!showVideoPreview}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PGRoomManagement;
