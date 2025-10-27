import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRef } from 'react';
import {
  fetchPgCategories,
  fetchPgCities,
  fetchPgExtraFeatures,
  fetchPgFloorings,
  fetchPgFloors,
  fetchPgWashrooms,
} from '../../../store/mainSlice';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Dropdown options
const pgForOptions = [
  { label: 'Boys', value: 'boys' },
  { label: 'Girls', value: 'girls' },
  { label: 'Both', value: 'both' },
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
  const route = useRoute<any>();
  const { type, propertyId } = route.params || {};
  const {
    pgCategories,
    pgCities,
    pgFloors,
    pgFloorings,
    pgWashrooms,
    pgExtraFeatures,
  } = useSelector((state: any) => state.main);
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState<any>({
    pgTitle: '',
    pgFor: '',
    pgType: '',
    pgCity: '',
    pgFloor: '',
    flooring: '',
    washroom: '',
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
  const [isAgreed, setIsAgreed] = useState(false);
  const isActive = isAgreed;
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (key: string, file: any) => {
    setImages((prev: any) => ({ ...prev, [key]: file }));
  };

  const toggleMultiSelect = (array: string[], setter: any, label: string) => {
    setter((prev: string[] = []) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(label)
        ? safePrev.filter(f => f !== label)
        : [...safePrev, label];
    });
  };

  const toggleSingleSelect = (
    value: string,
    setter: any,
    current: string | null,
  ) => {
    setter(current === value ? null : value);
  };
  //If editing, fetch existing PG details once
  useEffect(() => {
    if (type === 'editPG' && propertyId) {
      fetchPGDetails(propertyId);
    }
  }, [type, propertyId]);

  const fetchPGDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`https://yourapi.com/pg/${id}`);
      const data = await res.json();

      // Fill form fields with existing data
      setForm({
        pgTitle: data.pgTitle,
        pgFor: data.pgFor,
        pgType: data.pgType,
        pgCity: data.pgCity,
        pgAddress: data.pgAddress,
        totalRooms: data.totalRooms,
        price: data.price,
        security: data.security,
        maintenance: data.maintenance,
        area: data.area,
        description: data.description,
      });
    } catch (err) {
      console.log('Error loading PG details:', err);
    } finally {
      setLoading(false);
    }
  };

  //Submit handler
  const handleSubmit = () => {
    if (type === 'addPG') {
      Alert.alert('✅ Added', 'PG added successfully!');
      // call POST API
    } else if (type === 'editPG') {
      Alert.alert('✏️ Updated', 'PG updated successfully!');
      // call PUT/PATCH API with propertyId
    }
  };
  //Drop-down Apis
  useEffect(() => {
    dispatch(fetchPgCategories({ company_id: userData?.company_id || '35' }));
    dispatch(fetchPgCities({ company_id: userData?.company_id || '35' }));
    dispatch(fetchPgFloors({ company_id: userData?.company_id || '35' }));
    dispatch(fetchPgFloorings({ company_id: userData?.company_id || '35' }));
    dispatch(fetchPgWashrooms({ company_id: userData?.company_id || '35' }));
    dispatch(
      fetchPgExtraFeatures({ company_id: userData?.company_id || '35' }),
    );
  }, []);

  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 26.9124,
    longitude: 75.7873,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      <AppHeader title={type === 'editPG' ? 'Edit PG' : 'Add PG'} showBack />
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
          data={pgCategories}
          selectedValues={form.pgType}
          onSelect={value => setForm({ ...form, pgType: value })}
        />
        <AppCustomDropdown
          label="PG City *"
          data={pgCities}
          selectedValues={form.pgCity}
          onSelect={value => setForm({ ...form, pgCity: value })}
        />
        <View style={{ marginTop: 10 }}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
            >
              <Marker coordinate={region} title="PG Location" />
            </MapView>
          </View>
          <Typography
            color={colors.gray}
            style={{ marginTop: 8, textAlign: 'center' }}
          >
            Drag or zoom to set location
          </Typography>
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
        <AppCustomDropdown
          label="PG on Floor"
          data={pgFloors}
          selectedValues={form.pgFloor}
          onSelect={value => setForm({ ...form, pgFloor: value })}
        />
        <AppCustomDropdown
          label="Flooring"
          data={pgFloorings}
          selectedValues={form.flooring}
          onSelect={value => setForm({ ...form, flooring: value })}
        />
        <AppCustomDropdown
          label="Washroom"
          data={pgWashrooms}
          selectedValues={form.washroom}
          onSelect={value => setForm({ ...form, washroom: value })}
        />
        {/* Extra Features */}
        <View>
          <Typography
            variant="body"
            weight="medium"
            style={styles.sectionTitle}
          >
            Extra Features
          </Typography>
          <View style={styles.extraFeaturesColumn}>
            {pgExtraFeatures.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  toggleMultiSelect(extraFeatures, setExtraFeatures, item.value)
                }
                activeOpacity={0.7}
                style={styles.extraFeaturesIconTitle}
              >
                <Icon
                  name={
                    extraFeatures.includes(item.value)
                      ? 'check-box'
                      : 'check-box-outline-blank'
                  }
                  size={20}
                  color={
                    extraFeatures.includes(item.value)
                      ? colors.mainColor
                      : colors.gray
                  }
                />
                <Typography
                  variant="label"
                  weight="medium"
                  style={{
                    marginLeft: 6,
                    color: extraFeatures.includes(item.value)
                      ? colors.mainColor
                      : colors.gray,
                  }}
                >
                  {item.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
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
          title={type === 'editPG' ? 'Update PG' : 'Post PG'}
          onPress={handleSubmit}
          disabled={!isActive}
          loading={loading}
          style={styles.postButton}
        />
      </ScrollView>
    </View>
  );
};

export default LandlordAddPG; 
