import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import styles from './styles';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppButton from '../../../ui/AppButton';
import AppCustomDropdown from '../../../ui/AppCustomDropdown';
import AppTextInput from '../../../ui/AppTextInput';
import ImagePickerInput from '../../../ui/ImagePickerInput';

// 🔹 Helper for MultiSelect toggle
const toggleMultiSelect = (
  selected: any[],
  setSelected: any,
  value: string,
) => {
  if (selected.includes(value)) {
    setSelected(selected.filter(item => item !== value));
  } else {
    setSelected([...selected, value]);
  }
};

const PGRoomManagement = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');

  // Dummy rooms data
  const rooms = [
    {
      id: 1,
      name: 'new room - Double',
      rent: '₹9,000',
      deposit: '₹1,000',
      type: 'Double',
      date: '17-10-2025',
      facilities: [
        'Back Room',
        'Cooler',
        'Ducting',
        'Front Room',
        'Washing Machine',
      ],
    },
    {
      id: 2,
      name: 'new room - Double',
      rent: '₹9,000',
      deposit: '₹1,000',
      type: 'Double',
      date: '17-10-2025',
      facilities: [
        'Back Room',
        'Cooler',
        'Ducting',
        'Front Room',
        'Washing Machine',
      ],
    },
    {
      id: 3,
      name: 'new room - Double',
      rent: '₹9,000',
      deposit: '₹1,000',
      type: 'Double',
      date: '17-10-2025',
      facilities: [
        'Back Room',
        'Cooler',
        'Ducting',
        'Front Room',
        'Washing Machine',
      ],
    },
  ];

  const roomTypeOptions = [
    { label: 'Single Occupancy', value: 'singleOccupancy' },
    { label: 'Double Occupancy', value: 'doubleOccupancy' },
    { label: 'Triple Occupancy', value: 'tripleOccupancy' },
    { label: 'Dormitory', value: 'dormitory' },
  ];

  // 🔹 Form States
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<string[]>([]);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [extraFeatures, setExtraFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<any>({});

  const handleImageSelect = (key: string, file: any) => {
    setImages((prev: any) => ({ ...prev, [key]: file }));
  };

  // 🔹 Facility Options
  const pgExtraFeatures = [
    'Back Room',
    'Cooler',
    'Ducting',
    'Front Room',
    'Washing Machine',
  ];

  return (
    <View style={styles.container}>
      <AppHeader title={'PG Room Management'} showBack />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manage' && styles.activeTab]}
          onPress={() => setActiveTab('manage')}
        >
          <Typography
            variant="body"
            weight="medium"
            style={[
              styles.tabText,
              activeTab === 'manage' && styles.activeTabText,
            ]}
          >
            Manage Rooms
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
        >
          <Typography
            variant="body"
            weight="medium"
            style={[
              styles.tabText,
              activeTab === 'add' && styles.activeTabText,
            ]}
          >
            Add New Room
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Manage Rooms Tab */}
      {activeTab === 'manage' && (
        <ScrollView
          style={styles.contentConainter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Typography variant="body" weight="bold" style={styles.sectionHeader}>
            Current Rooms
          </Typography>
          {rooms.map(room => (
            <View key={room.id} style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.roomTitle}
                >
                  {room.name}
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
                  <Typography
                    variant="label"
                    weight="medium"
                    color={colors.gray}
                  >
                    Monthly Rent:
                  </Typography>
                  <Typography variant="label" weight="medium">
                    {room.rent}
                  </Typography>
                </View>
                <View style={styles.infoCol}>
                  <Typography
                    variant="label"
                    weight="medium"
                    color={colors.gray}
                  >
                    Security Deposit:
                  </Typography>
                  <Typography variant="label" weight="medium">
                    {room.deposit}
                  </Typography>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Typography
                    variant="label"
                    weight="medium"
                    color={colors.gray}
                  >
                    Room Type:
                  </Typography>
                  <Typography variant="label" weight="medium">
                    {room.type}
                  </Typography>
                </View>
                <View style={styles.infoCol}>
                  <Typography
                    variant="label"
                    weight="medium"
                    color={colors.gray}
                  >
                    Added On:
                  </Typography>
                  <Typography variant="label" weight="medium">
                    {room.date}
                  </Typography>
                </View>
              </View>

              <Typography
                style={{ marginTop: 10 }}
                variant="label"
                weight="medium"
                color={colors.gray}
              >
                Description:
              </Typography>
              <Typography variant="label" weight="medium">
                jghjghjg
              </Typography>

              <Typography
                variant="label"
                weight="medium"
                color={colors.gray}
                style={{ marginTop: 10 }}
              >
                Facilities:
              </Typography>
              <View style={styles.facilityWrap}>
                {room.facilities.map((item, index) => (
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
                  onPress={() => console.log('room Edit')}
                  style={{ flex: 1, height: 40 }}
                />
                <AppButton
                  title="Delete"
                  onPress={() => console.log('room Delete')}
                  style={{ backgroundColor: colors.error, flex: 1, height: 40 }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add New Room Tab */}
      {activeTab === 'add' && (
        <ScrollView
          style={styles.contentConainter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Typography variant="body" weight="bold" style={styles.sectionHeader}>
            Add New Room
          </Typography>

          {/* Room Name & Type */}
          <View style={[styles.formRow, { marginBottom: 0 }]}>
            <AppTextInput
              label="Room Number/Name"
              placeholder="e.g., Room 101, Deluxe Room"
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

          {/* Room Facilities MultiSelect */}
          <Typography weight="medium" style={{ marginTop: 10 }}>
            Room Facilities
          </Typography>
          <View style={[styles.facilityRow, { flexWrap: 'wrap' }]}>
            {pgExtraFeatures.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  toggleMultiSelect(extraFeatures, setExtraFeatures, item)
                }
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 30,
                }}
              >
                <Icon
                  name={
                    extraFeatures.includes(item)
                      ? 'check-box'
                      : 'check-box-outline-blank'
                  }
                  size={20}
                  color={
                    extraFeatures.includes(item)
                      ? colors.mainColor
                      : colors.gray
                  }
                />
                <Typography
                  style={{
                    marginLeft: 6,
                    color: extraFeatures.includes(item)
                      ? colors.mainColor
                      : colors.gray,
                  }}
                >
                  {item}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Typography weight="medium" style={{ marginTop: 10 }}>
            Room Description
          </Typography>
          <AppTextInput
            placeholder="Describe the room, its features, view, etc."
            value={roomDescription}
            onChangeText={setRoomDescription}
            multiline
            numberOfLines={4}
            containerStyle={styles.descContainer}
          />

          {/* Room Images */}
          <Typography weight="medium" style={{ marginTop: 20 }}>
            Room Images
          </Typography>
          <View style={{ top: -10 }}>
            <ImagePickerInput
              label=""
              value={images.roomImage}
              onSelect={file => handleImageSelect('roomImage', file)}
            />
          </View>

          <AppButton
            title="Save Room"
            style={{ backgroundColor: 'green', marginTop: 20 }}
            onPress={() =>
              console.log({
                roomName,
                roomType,
                monthlyRent,
                securityDeposit,
                roomDescription,
                extraFeatures,
                images,
              })
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

export default PGRoomManagement;
