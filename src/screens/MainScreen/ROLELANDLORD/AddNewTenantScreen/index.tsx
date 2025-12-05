import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown, {
  DropdownItem,
} from '../../../../ui/AppCustomDropdown';
import AppDatePicker from '../../../../ui/AppDatePicker';
import AppButton from '../../../../ui/AppButton';
import styles from './styles';
import colors from '../../../../constants/colors';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchMyPgList,
  addTenant,
  fetchTenants,
  fetchPgRooms,
} from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';

const genderOptions: DropdownItem[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const AddNewTenantScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { myPgList, loading, pgRooms } = useSelector(
    (state: RootState) => state.main,
  );

  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    gender: '',
    password: '',
    confirmPassword: '',
    pg_id: '',
    room_id: '',
    room_number: '',
    roomNo: '',
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomDropdownVisible, setRoomDropdownVisible] = useState(false);
  const [roomSearchText, setRoomSearchText] = useState('');
  const [roomFadeAnim] = useState(new Animated.Value(0));
  const [roomSlideAnim] = useState(new Animated.Value(20));

  // Fetch PG list on mount
  useEffect(() => {
    if (userData?.company_id && userData?.user_id) {
      dispatch(
        fetchMyPgList({
          company_id: userData.company_id,
          landlord_id: userData.user_id,
          user_type: userData?.user_type,
          property_id: userData?.assigned_pg_ids,
        }),
      );
    }
  }, [dispatch, userData]);

  // PG Options for dropdown
  const pgOptions = useMemo<DropdownItem[]>(() => {
    const pgListData = (myPgList as any)?.data;
    if (Array.isArray(pgListData) && pgListData.length > 0) {
      return pgListData.map((item: any) => ({
        label: `${item?.property_code || ''} - ${item?.title || ''}`.trim(),
        value: item?.property_id?.toString() || '',
      }));
    }
    return [];
  }, [myPgList]);

  // All rooms (including booked) for dropdown
  const allRooms = useMemo(() => {
    const roomsData = pgRooms?.data;
    if (Array.isArray(roomsData) && roomsData.length > 0) {
      return roomsData;
    }
    return [];
  }, [pgRooms]);

  // Room Options for dropdown - all rooms
  const roomOptions = useMemo<DropdownItem[]>(() => {
    if (allRooms.length > 0) {
      return allRooms.map((room: any) => ({
        label: `${room?.room_number || ''} - ${room?.room_type || ''}`.trim(),
        value: room?.id?.toString() || '',
      }));
    }
    return [];
  }, [allRooms]);

  // Check if rooms are available
  const hasRooms = useMemo(() => {
    return Array.isArray(pgRooms?.data) && pgRooms.data.length > 0;
  }, [pgRooms]);

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    if (field === 'pg_id') {
      // Clear room fields when PG changes
      setFormData(prev => ({
        ...prev,
        [field]: value,
        room_id: '',
        room_number: '',
        roomNo: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle room selection - only allow available rooms
  const handleRoomSelect = (roomId: string) => {
    const selectedRoom = allRooms.find(
      (room: any) => room?.id?.toString() === roomId,
    );
    if (selectedRoom) {
      // Only allow selection if room is available
      if (selectedRoom.room_availability === 'available') {
        handleInputChange('room_id', roomId);
        handleInputChange('room_number', selectedRoom.room_number || '');
        handleInputChange('roomNo', ''); // Clear manual room number
        closeRoomDropdown();
        setFormErrors(prev => ({ ...prev, room_id: '' }));
      } else {
        // Show error for booked rooms
        setFormErrors(prev => ({
          ...prev,
          room_id: 'This room is already booked and cannot be selected',
        }));
      }
    }
  };

  const openRoomDropdown = () => {
    setRoomDropdownVisible(true);
    Animated.parallel([
      Animated.timing(roomFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(roomSlideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeRoomDropdown = () => {
    Animated.parallel([
      Animated.timing(roomFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(roomSlideAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRoomDropdownVisible(false);
      setRoomSearchText('');
    });
  };

  const filteredRoomOptions = roomOptions.filter(room =>
    room.label.toLowerCase().includes(roomSearchText.toLowerCase()),
  );

  const selectedRoomLabel = useMemo(() => {
    if (formData.room_id) {
      const selectedRoom = allRooms.find(
        (room: any) => room?.id?.toString() === formData.room_id,
      );
      if (selectedRoom) {
        return `${selectedRoom.room_number} - ${selectedRoom.room_type}`;
      }
    }
    return '';
  }, [formData.room_id, allRooms]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Registration Info validation
    if (!formData.fullname.trim()) {
      errors.fullname = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = 'Enter a valid email';
    }
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Stay Info validation
    if (!formData.pg_id) {
      errors.pg_id = 'PG Name is required';
    }
    // Validate room based on availability
    if (hasRooms) {
      if (!formData.room_id) {
        errors.room_id = 'Room selection is required';
      }
    } else {
      if (!formData.roomNo.trim()) {
        errors.roomNo = 'Room number is required';
      }
    }
    if (!formData.checkInDate) {
      errors.checkInDate = 'Check-in date is required';
    }
    if (!formData.checkOutDate) {
      errors.checkOutDate = 'Check-out date is required';
    } else if (
      formData.checkInDate &&
      formData.checkOutDate &&
      formData.checkOutDate < formData.checkInDate
    ) {
      errors.checkOutDate = 'Check-out date must be after check-in date';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        gender: formData.gender,
        password: formData.password.trim(),
        pg_id: formData.pg_id,
        message: formData.message.trim(),
        check_in_date: formatDateForAPI(formData.checkInDate),
        check_out_date: formatDateForAPI(formData.checkOutDate),
        company_id: userData?.company_id || '',
        landlord_id: userData?.user_id || '',
      };

      // Add room_id or room_number based on availability
      if (hasRooms) {
        payload.room_id = formData.room_id || null;
        payload.room_number = formData.room_number || null;
      } else {
        payload.room_id = null;
        payload.room_number = formData.roomNo.trim() || null;
      }

      const resultAction = await dispatch(addTenant(payload));
      const response = resultAction?.payload;

      if (response?.success) {
        showSuccessMsg(response?.message || 'Tenant added successfully');
        // Refresh tenant list
        if (userData?.company_id && userData?.user_id) {
          dispatch(
            fetchTenants({
              user_id: userData.user_id,
              user_type: userData?.user_type || 'landlord',
              company_id: userData.company_id,
            }),
          );
        }
        navigation.goBack();
      } else {
        showErrorMsg(
          response?.message || 'Failed to add tenant. Please try again.',
        );
      }
    } catch (error: any) {
      appLog('AddNewTenantScreen', 'Error:', error);
      showErrorMsg('Unable to add tenant right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formData.pg_id && userData?.company_id) {
      dispatch(
        fetchPgRooms({
          pg_id: formData.pg_id,
          company_id: userData?.company_id,
        }),
      );
      // Reset room selection when PG changes
      setFormData(prev => ({
        ...prev,
        room_id: '',
        room_number: '',
        roomNo: '',
      }));
    }
  }, [dispatch, formData.pg_id, userData?.company_id]);

  return (
    <View style={styles.container}>
      <AppHeader title="Add New Tenant" showBack rightIcon={false} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Registration Info Section */}
          <View style={styles.section}>
            <Typography
              variant="body"
              weight="bold"
              style={styles.sectionTitle}
            >
              Registration Info
            </Typography>

            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <AppTextInput
                  label="Full Name *"
                  placeholder="Enter full name"
                  value={formData.fullname}
                  onChangeText={text => handleInputChange('fullname', text)}
                  error={formErrors.fullname}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.column}>
                <AppTextInput
                  label="Mobile Number *"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChangeText={text => handleInputChange('mobile', text)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={formErrors.mobile}
                />
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <AppTextInput
                  label="Email *"
                  placeholder="Enter email"
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formErrors.email}
                />
              </View>
              <View style={styles.column}>
                <AppCustomDropdown
                  label="Gender *"
                  placeholder="Select Gender"
                  data={genderOptions}
                  selectedValues={formData.gender ? [formData.gender] : []}
                  onSelect={values =>
                    handleInputChange('gender', values[0] || '')
                  }
                  error={formErrors.gender}
                />
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <AppTextInput
                  label="Password *"
                  placeholder="Enter password"
                  value={formData.password}
                  onChangeText={text => handleInputChange('password', text)}
                  secureTextEntry
                  error={formErrors.password}
                />
              </View>
              <View style={styles.column}>
                <AppTextInput
                  label="Confirm Password *"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChangeText={text =>
                    handleInputChange('confirmPassword', text)
                  }
                  secureTextEntry
                  error={formErrors.confirmPassword}
                />
              </View>
            </View>
          </View>

          {/* Stay Info Section */}
          <View style={styles.section}>
            <Typography
              variant="body"
              weight="bold"
              style={styles.sectionTitle}
            >
              Stay Info
            </Typography>

            <AppCustomDropdown
              label="PG Name *"
              placeholder="Select PG"
              data={pgOptions}
              selectedValues={formData.pg_id ? [formData.pg_id] : []}
              onSelect={values => handleInputChange('pg_id', values[0] || '')}
              showSearch
              error={formErrors.pg_id}
            />

            {/* Show room dropdown/input only after PG is selected */}
            {formData.pg_id && hasRooms ? (
              <View>
                {/* Custom Room Dropdown */}
                <View style={styles.roomDropdownContainer}>
                  <Typography
                    variant="caption"
                    weight="medium"
                    color={colors.textDark}
                    style={styles.roomDropdownLabel}
                  >
                    Room *
                  </Typography>
                  <TouchableOpacity
                    onPress={openRoomDropdown}
                    style={[
                      styles.roomDropdownInputWrapper,
                      formErrors.room_id
                        ? styles.roomDropdownInputWrapperError
                        : styles.roomDropdownInputWrapperNormal,
                    ]}
                  >
                    <Typography
                      variant="body"
                      style={[
                        styles.roomDropdownText,
                        selectedRoomLabel
                          ? styles.roomDropdownTextSelected
                          : styles.roomDropdownTextPlaceholder,
                      ]}
                    >
                      {selectedRoomLabel || 'Select Room'}
                    </Typography>
                    <FontAwesome
                      name="angle-down"
                      size={18}
                      color={colors.lightGary}
                    />
                  </TouchableOpacity>
                  {formErrors.room_id && (
                    <Typography
                      variant="caption"
                      color={colors.error}
                      style={styles.roomDropdownError}
                    >
                      {formErrors.room_id}
                    </Typography>
                  )}
                </View>

                {/* Room Dropdown Modal */}
                <Modal
                  visible={roomDropdownVisible}
                  transparent
                  animationType="none"
                  onRequestClose={closeRoomDropdown}
                  statusBarTranslucent
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={closeRoomDropdown}
                    style={styles.roomModalOverlay}
                  >
                    <Animated.View
                      style={[
                        styles.roomModalContainer,
                        {
                          opacity: roomFadeAnim,
                          transform: [{ translateY: roomSlideAnim }],
                        },
                      ]}
                    >
                      <Typography
                        variant="body"
                        weight="bold"
                        style={styles.roomModalTitle}
                      >
                        Select Room
                      </Typography>
                      <TextInput
                        value={roomSearchText}
                        onChangeText={setRoomSearchText}
                        placeholder="Search..."
                        placeholderTextColor={colors.gray}
                        style={styles.roomModalSearchInput}
                      />
                      {filteredRoomOptions.length > 0 ? (
                        <FlatList
                          data={filteredRoomOptions}
                          keyExtractor={(item, index) => item.value + index}
                          showsVerticalScrollIndicator={false}
                          renderItem={({ item }) => {
                            const room = allRooms.find(
                              (r: any) => r?.id?.toString() === item.value,
                            );
                            const isBooked =
                              room?.room_availability === 'booked';
                            const isSelected = formData.room_id === item.value;
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.roomModalItem,
                                  isBooked && styles.roomModalItemBooked,
                                ]}
                                onPress={() => {
                                  if (!isBooked) {
                                    handleRoomSelect(item.value);
                                  }
                                }}
                                disabled={isBooked}
                              >
                                <Typography
                                  variant="body"
                                  style={[
                                    isBooked
                                      ? styles.roomModalItemTextBooked
                                      : isSelected
                                      ? styles.roomModalItemTextSelected
                                      : styles.roomModalItemText,
                                  ]}
                                >
                                  {item.label}
                                  {isBooked && ' (Booked)'}
                                </Typography>
                                {isSelected && !isBooked && (
                                  <FontAwesome
                                    name="check"
                                    size={16}
                                    color={colors.mainColor}
                                  />
                                )}
                              </TouchableOpacity>
                            );
                          }}
                          keyboardShouldPersistTaps="handled"
                        />
                      ) : (
                        <View style={styles.roomModalNoResults}>
                          <Typography variant="body" color={colors.gray}>
                            No rooms found
                          </Typography>
                        </View>
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ) : formData.pg_id && !hasRooms ? (
              <AppTextInput
                label="Room No *"
                placeholder="Enter room number"
                value={formData.roomNo}
                onChangeText={text => handleInputChange('roomNo', text)}
                error={formErrors.roomNo}
              />
            ) : null}

            <View style={styles.dateRow}>
              <View style={styles.dateColumn}>
                <AppDatePicker
                  label="Check-In Date *"
                  placeholder="dd/mm/yyyy"
                  date={formData.checkInDate}
                  onDateChange={date => {
                    handleInputChange('checkInDate', date);
                    // Auto-set check-out date if not set or if earlier than check-in
                    if (
                      !formData.checkOutDate ||
                      formData.checkOutDate < date
                    ) {
                      const nextDate = new Date(date);
                      nextDate.setDate(nextDate.getDate() + 30);
                      handleInputChange('checkOutDate', nextDate);
                    }
                  }}
                  // minimumDate={new Date()}
                  error={formErrors.checkInDate}
                  containerStyle={{ flex: 1 }}
                />
              </View>
              <View style={styles.dateSpacer} />
              <View style={styles.dateColumn}>
                <AppDatePicker
                  label="Check-Out Date *"
                  placeholder="dd/mm/yyyy"
                  date={formData.checkOutDate}
                  onDateChange={date => handleInputChange('checkOutDate', date)}
                  minimumDate={formData.checkInDate || new Date()}
                  error={formErrors.checkOutDate}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            </View>

            <AppTextInput
              label="Message Note"
              placeholder="Enter message"
              value={formData.message}
              onChangeText={text => handleInputChange('message', text)}
              multiline
              numberOfLines={4}
              // error={formErrors.message}
            />
          </View>

          {/* Submit Button */}
          <AppButton
            title="Submit"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddNewTenantScreen;
