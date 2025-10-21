import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import AppTextInput from '../../../ui/AppTextInput';
import AppCustomDropdown from '../../../ui/AppCustomDropdown';
import colors from '../../../constants/colors';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePickerInput from '../../../ui/ImagePickerInput';
import AppButton from '../../../ui/AppButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

// Dropdown options
const pgForOptions = [
  { label: 'Boys', value: 'boys' },
  { label: 'Girls', value: 'girls' },
  { label: 'Both', value: 'both' },
];

const pgTypeOptions = [
  { label: 'Single Room', value: 'single' },
  { label: 'Shared Room', value: 'shared' },
  { label: 'Apartment', value: 'apartment' },
];

const pgCityOptions = [
  { label: 'Jaipur', value: 'jaipur' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Mumbai', value: 'mumbai' },
];

const floorOptions = [
  { label: 'Ground Floor', value: 'ground' },
  { label: '1st Floor', value: '1' },
  { label: '2nd Floor', value: '2' },
  { label: '3rd Floor', value: '3' },
];

const flooringOptions = [
  { label: 'Marble', value: 'marble' },
  { label: 'Tiles', value: 'tiles' },
  { label: 'Wooden', value: 'wooden' },
];

const washroomOptions = [
  { label: 'Attached', value: 'attached' },
  { label: 'Common', value: 'common' },
];

const availabilityOptions = [
  { label: 'Ready to Move', value: 'readytomove' },
  { label: 'Under Construction', value: 'underconstruction' },
];

const furnitureOptions = [
  { label: 'Fully Furnished', value: 'fully' },
  { label: 'Semi Furnished', value: 'semi' },
  { label: 'Unfurnished', value: 'unfurnished' },
];

const parkingOptions = ['2 Wheeler', '4 Wheeler', 'No Parking'];

const extraFeaturesList = [
  'Power Backup',
  'CCTV Surveillance',
  'Security / Fire Alarm',
  'Access to High Speed Internet',
  'Lift',
  'Reserved Parking',
  'Service / Goods Lift',
  'Intercom Facility',
  '24hr Water Supply Available',
  'Cafeteria / Food Court',
  'Park nearby',
  'Hospital Nearby',
  'Bank/ATM nearby',
  'Approach Road Available',
  'Proper Boundary Wall',
  'Electricity Available',
  'Washing Machine',
  'Maintanence Staff',
];

const uploadItems = [
  { key: 'mainPicture', label: 'Main Picture (Single)' },
  { key: 'livingRoom', label: 'Living Room (Multiple)' },
  { key: 'bedroom', label: 'Bedroom (Multiple)' },
  { key: 'kitchen', label: 'Kitchen (Multiple)' },
  { key: 'bathroom', label: 'Bathroom (Multiple)' },
  { key: 'floorplan', label: 'Floorplan (Multiple)' },
  { key: 'extraImages', label: 'Extra Images (Multiple)' },
  { key: 'video', label: 'Video (Single)' },
];

const LandlordAddPG = () => {
  const [form, setForm] = useState<any>({
    pgTitle: '',
    pgFor: '',
    pgType: '',
    pgCity: '',
    pgAddress: '',
    totalRooms: '',
    price: '',
    security: '',
    maintenance: '',
    area: '',
    description: '',
  });

  const [availability, setAvailability] = useState<string | null>(null);
  const [furniture, setFurniture] = useState<string | null>(null);
  const [parking, setParking] = useState<string[]>([]);
  const [extraFeatures, setExtraFeatures] = useState<string[]>([]);

  const [images, setImages] = useState<any>({});

  const handleImageSelect = (key: string, file: any) => {
    setImages((prev: any) => ({ ...prev, [key]: file }));
  };

  const toggleMultiSelect = (array: string[], setter: any, label: string) => {
    setter((prev: string[]) =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label],
    );
  };

  const toggleSingleSelect = (
    value: string,
    setter: any,
    current: string | null,
  ) => {
    setter(current === value ? null : value);
  };
  const [isAgreed, setIsAgreed] = useState(false);
  const isActive = isAgreed;

  return (
    <View style={styles.container}>
      <AppHeader title="Add PG" showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 16,
          paddingTop: 15,
        }}
      >
        <AppTextInput
          label="PG Title *"
          placeholder="Enter Title"
          value={form.pgTitle}
          onChangeText={text => setForm({ ...form, pgTitle: text })}
        />

        <AppCustomDropdown
          label="PG For *"
          data={pgForOptions}
          selectedValues={form.pgFor}
          onSelect={value => setForm({ ...form, pgFor: value })}
        />

        <AppCustomDropdown
          label="PG Type *"
          data={pgTypeOptions}
          selectedValues={form.pgType}
          onSelect={value => setForm({ ...form, pgType: value })}
        />

        <AppCustomDropdown
          label="PG City *"
          data={pgCityOptions}
          selectedValues={form.pgCity}
          onSelect={value => setForm({ ...form, pgCity: value })}
        />

        {/* Google Map Placeholder */}
        <View style={styles.mapContainer}>
          <Icon name="map" size={50} color={colors.gray} />
          <Typography color={colors.gray}>Google Map (Coming Soon)</Typography>
        </View>
        <AppTextInput
          label="PG Address *"
          placeholder="Enter Address"
          value={form.pgAddress}
          onChangeText={text => setForm({ ...form, pgAddress: text })}
        />
        {/* Room & Pricing */}
        <AppTextInput
          label="Total Rooms *"
          placeholder="Total Rooms"
          keyboardType="numeric"
          value={form.totalRooms}
          onChangeText={text => setForm({ ...form, totalRooms: text })}
        />

        <AppTextInput
          label="Price (per room) *"
          placeholder="Enter Price"
          keyboardType="numeric"
          value={form.price}
          onChangeText={text => setForm({ ...form, price: text })}
        />

        <AppTextInput
          label="Security Charges (₹)"
          placeholder="Enter Security Charges"
          keyboardType="numeric"
          value={form.security}
          onChangeText={text => setForm({ ...form, security: text })}
        />

        <AppTextInput
          label="Maintenance Charges (₹)"
          placeholder="Enter Maintenance Charges"
          keyboardType="numeric"
          value={form.maintenance}
          onChangeText={text => setForm({ ...form, maintenance: text })}
        />

        <AppTextInput
          label="PG Area (sqft)"
          placeholder="Enter Property Area in SqFt"
          keyboardType="numeric"
          value={form.area}
          onChangeText={text => setForm({ ...form, area: text })}
        />

        {/* Availability */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Availability
        </Typography>
        <View style={styles.rowWrap}>
          {availabilityOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              onPress={() =>
                toggleSingleSelect(opt.value, setAvailability, availability)
              }
              style={styles.optionItem}
            >
              <Icon
                name={
                  availability === opt.value
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={20}
                color={
                  availability === opt.value ? colors.mainColor : colors.gray
                }
              />
              <Typography
                variant="label"
                weight="medium"
                style={[
                  styles.optionLabel,
                  {
                    color:
                      availability === opt.value
                        ? colors.mainColor
                        : colors.gray,
                  },
                ]}
              >
                {opt.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Furniture */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Furniture
        </Typography>
        <View style={styles.rowWrap}>
          {furnitureOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              onPress={() =>
                toggleSingleSelect(opt.value, setFurniture, furniture)
              }
              style={styles.optionItem}
            >
              <Icon
                name={
                  furniture === opt.value
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={20}
                color={furniture === opt.value ? colors.mainColor : colors.gray}
              />
              <Typography
                variant="label"
                weight="medium"
                style={[
                  styles.optionLabel,
                  {
                    color:
                      furniture === opt.value ? colors.mainColor : colors.gray,
                  },
                ]}
              >
                {opt.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Parking */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Parking
        </Typography>
        <View style={styles.rowWrap}>
          {parkingOptions.map((label, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleMultiSelect(parking, setParking, label)}
              style={styles.optionItem}
            >
              <Icon
                name={
                  parking.includes(label)
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={20}
                color={parking.includes(label) ? colors.mainColor : colors.gray}
              />
              <Typography
                variant="label"
                weight="medium"
                style={[
                  styles.optionLabel,
                  {
                    color: parking.includes(label)
                      ? colors.mainColor
                      : colors.gray,
                  },
                ]}
              >
                {label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
        {/* Additional Details */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Additional Details
        </Typography>
        <AppCustomDropdown label="PG on Floor" data={floorOptions} />
        <AppCustomDropdown label="Flooring" data={flooringOptions} />
        <AppCustomDropdown label="Washroom" data={washroomOptions} />
        {/* Extra Features */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Extra Features
        </Typography>
        <View style={styles.rowWrap}>
          {extraFeaturesList.map((label, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                toggleMultiSelect(extraFeatures, setExtraFeatures, label)
              }
              activeOpacity={0.7}
              style={styles.optionItem}
            >
              <Icon
                name={
                  extraFeatures.includes(label)
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={20}
                color={
                  extraFeatures.includes(label) ? colors.mainColor : colors.gray
                }
              />
              <Typography
                variant="label"
                weight="medium"
                style={[
                  styles.optionLabel,
                  {
                    color: extraFeatures.includes(label)
                      ? colors.mainColor
                      : colors.gray,
                  },
                ]}
              >
                {label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <AppTextInput
          label="Description"
          placeholder="Enter property description"
          value={form.description}
          onChangeText={text => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
          containerStyle={styles.descContainer}
        />

        {/* Upload Section in 2 Columns */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Upload Property Photos
        </Typography>
        <View style={styles.uploadGrid}>
          {uploadItems.map((item, index) => (
            <View key={index} style={styles.uploadItem}>
              <ImagePickerInput
                label={item.label}
                value={images[item.key]}
                onSelect={file => handleImageSelect(item.key, file)}
              />
            </View>
          ))}
        </View>

        {/* Checkbox Section */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsAgreed(prev => !prev)}
          activeOpacity={0.8}
        >
          <FontAwesome
            name={isAgreed ? 'check-square' : 'square-o'}
            size={20}
            color={isAgreed ? colors.mainColor : '#888'}
          />
          <Typography variant="label" style={styles.checkboxText}>
            I agree to the Terms of Services and Privacy Policy
          </Typography>
        </TouchableOpacity>

        <AppButton
          title="Post PG"
          onPress={() => Alert.alert('PG Posted!', 'UI looking perfect 💪')}
          style={styles.postButton}
          disabled={!isActive}
        />
      </ScrollView>
    </View>
  );
};

export default LandlordAddPG;