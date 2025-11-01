import React, { useEffect, useState, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  addEditPg,
  fetchMyPgList,
  fetchPgCategories,
  fetchPgCities,
  fetchPgCityLocation,
  fetchPgExtraFeatures,
  fetchPgFloorings,
  fetchPgFloors,
  fetchPgWashrooms,
} from '../../../store/mainSlice';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { checkLocationPermission } from '../../../utils/permissions';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/NavKeys';
import { showErrorMsg, showSuccessMsg } from '../../../utils/appMessages';

Geocoder.init('AIzaSyBZrmzANmT_V2heVloY7S7ASKniWrLAtQs', { language: 'en' });
// Dropdown options
const pgForOptions = [
  { label: 'Boys', value: 'Boys' },
  { label: 'Girls', value: 'Girls' },
  { label: 'Both', value: 'Both' },
];
const availabilityOptions = [
  { label: 'Ready to Move', value: 'Ready to Move' },
  { label: 'Under Construction', value: 'Under Construction' },
];
const furnitureOptions = [
  { label: 'Fully Furnished', value: 'Full Furnished' },
  { label: 'Semi Furnished', value: 'Semi Furnished' },
  { label: 'Unfurnished', value: 'Unfurnished' },
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
type LandlordAddPGNavProp = NativeStackNavigationProp<RootStackParamList>;
const LandlordAddPG = () => {
  const route = useRoute<any>();
  const { type, propertyData } = route.params || {};
  const navigation = useNavigation<LandlordAddPGNavProp>();
  const {
    pgCategories,
    pgCities,
    pgFloors,
    pgFloorings,
    pgWashrooms,
    pgExtraFeatures,
    pgCityLocation,
  } = useSelector((state: any) => state.main);
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: any) => state.auth);
  const [form, setForm] = useState<any>({
    pgTitle: '',
    pgFor: '',
    pgType: '',
    pgCity: '',
    pgCityLocation: '',
    pgFloor: '',
    flooring: '',
    washroom: '',
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
  const [loading, setLoading] = useState(false);
  const isActive = isAgreed;
  const [pgAddress, setPgAddress] = useState<string>('');
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 26.9124, // Jaipur default
    longitude: 75.7873,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [lastCoords, setLastCoords] = useState({
    lat: 26.9124,
    lng: 75.7873,
  });
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); //to detect first load

  //Get Address from Coordinates (Using OpenStreetMap - Nominatim)
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsFetchingAddress(true);
      console.log('📍 Fetching address for:', lat, lng);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            'User-Agent': 'MeharPGApp/1.0 (contact: support@meharpg.com)',
            'Accept-Language': 'en',
          },
        },
      );

      if (!response.ok) {
        console.log('HTTP Error:', response.status);
        throw new Error(`HTTP Error ${response.status}`);
      }
      const data = await response.json();
      console.log('Full Nominatim Response:', data);
      if (data && data.address) {
        const { road, neighbourhood, city, state, postcode, country } =
          data.address;
        //If first load → only show city/state/postcode/country
        let formattedAddress = '';
        if (isInitialLoad) {
          formattedAddress = [city, state, postcode, country]
            .filter(Boolean)
            .join(', ');
          setIsInitialLoad(false); //next time full address allowed
        } else {
          //After map drag → show detailed address
          formattedAddress = [
            road,
            neighbourhood,
            city,
            state,
            postcode,
            country,
          ]
            .filter(Boolean)
            .join(', ');
        }

        setPgAddress(formattedAddress);
        console.log('Formatted Address:', formattedAddress);
      } else {
        setPgAddress('Address not found');
        console.log('No address found for coordinates');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setPgAddress('Error fetching address');
    } finally {
      setIsFetchingAddress(false);
    }
  };

  //Fetch default Jaipur address when screen opens
  useEffect(() => {
    const timeout = setTimeout(() => {
      getAddressFromCoordinates(region.latitude, region.longitude);
    }, 800); // Slight delay to allow map load
    return () => clearTimeout(timeout);
  }, []);

  //Update address on map drag
  const onRegionChangeComplete = async (newRegion: Region) => {
    //Check permission before fetching address
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow location access to update address on map.',
      );
      return;
    }
    //User granted permission → proceed with address update
    const latChanged = Math.abs(newRegion.latitude - lastCoords.lat) > 0.0005;
    const lngChanged = Math.abs(newRegion.longitude - lastCoords.lng) > 0.0005;
    if (latChanged || lngChanged) {
      setRegion(newRegion);
      setLastCoords({
        lat: newRegion.latitude,
        lng: newRegion.longitude,
      });
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }
  };
  // Drop-down Apis
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

  useEffect(() => {
    if (type === 'editPG' && propertyData) {
      setForm({
        pgTitle: propertyData.title || '',
        pgFor: propertyData.pg_for || '',
        pgType: propertyData.category_id || '',
        pgCity: propertyData.city_id || '',
        pgCityLocation: propertyData?.city_location_id || '',
        pgFloor: propertyData.floor || '',
        flooring: propertyData.flooring || '',
        washroom: propertyData.washroom || '',
        totalRooms: propertyData.total_rooms || '',
        price: propertyData.price || '',
        security: propertyData.security_charges || '',
        maintenance: propertyData.maintainance_charges || '',
        area: propertyData.area_sqft || '',
        description: propertyData.description || '',
      });
      setPgAddress(propertyData.address || '');
      setAvailability(propertyData.availability || null);
      setFurniture(propertyData.furnished || null);
      setParking(propertyData.parking ? propertyData.parking.split(',') : []);
      setExtraFeatures(
        Array.isArray(propertyData.features)
          ? propertyData.features.map((item: any) => item.features_id)
          : [],
      );
      // Gallery setup
      setImages({
        mainPicture: propertyData.featured_image
          ? [propertyData.featured_image]
          : [],
        livingRoom: propertyData.gallery?.living_room || [],
        bedroom: propertyData.gallery?.bedroom || [],
        kitchen: propertyData.gallery?.kitchen || [],
        bathroom: propertyData.gallery?.bathroom || [],
        floorplan: propertyData.gallery?.floorplan || [],
        extraImages: propertyData.gallery?.extra || [],
      });
      // Map setup
      setRegion({
        latitude: Number(propertyData.latitude) || 26.9124,
        longitude: Number(propertyData.longitude) || 75.7873,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [type, propertyData]);

  console.log('propertyData =======>>>', propertyData);

  // Submit handler
  const handleSubmit = async () => {
    if (!isAgreed) {
      Alert.alert('⚠️ Terms', 'Please agree to Terms & Conditions.');
      return;
    }

    type ImageItem = { uri: string; name?: string; type?: string } | string;

    // 🧩 Helper to send only local file images (skip URLs)
    const formatImages = (arr: ImageItem[]) =>
      arr
        .filter(
          img =>
            typeof img !== 'string' && img.uri && img.uri.startsWith('file'),
        )
        .map((img: any, index) => ({
          uri: img.uri,
          name: img.fileName || `image_${index}.jpg`,
          type: img.type || 'image/jpeg',
        }));

    // 🧾 Make FormData
    const formData = new FormData();
    formData.append('company_id', userData?.company_id);
    formData.append('landlord_id', userData?.user_id);
    formData.append('property_type', 'PG');
    formData.append('title', form.pgTitle);
    formData.append('category',Array.isArray(form.pgType) ? form.pgType[0] : form.pgType);
    formData.append('city',Array.isArray(form.pgCity) ? form.pgCity[0] : form.pgCity);
    formData.append('city_location',
      Array.isArray(form.pgCityLocation)
        ? form.pgCityLocation[0]
        : form.pgCityLocation || '',
    );
    formData.append('latitude', region.latitude.toString());
    formData.append('longitude', region.longitude.toString());
    formData.append('address', pgAddress);
    formData.append('price', form.price);
    formData.append('security_charges', form.security);
    formData.append('maintainance_charges', form.maintenance);
    formData.append('area_sqft', form.area);
    formData.append('availability', availability);
    formData.append('furnished', furniture);
    formData.append('parking', Array.isArray(parking) ? parking[0] : parking);
    formData.append('floor',Array.isArray(form.pgFloor) ? form.pgFloor[0] : form.pgFloor);
    formData.append('flooring',Array.isArray(form.flooring) ? form.flooring[0] : form.flooring);
    formData.append('balconies', '1');
    formData.append('washroom', Array.isArray(form.washroom) ? form.washroom[0] : form.washroom,);
    formData.append('features',Array.isArray(extraFeatures) ? extraFeatures.join(',') : extraFeatures,);
    formData.append('description', form.description);
    formData.append('total_rooms', form.totalRooms);
    formData.append('pg_for', Array.isArray(form.pgFor) ? form.pgFor[0] : form.pgFor);

    // 🖼 Featured Image (only append if it's a new local image)
    if (images.mainPicture?.[0]) {
      const mainPic = images.mainPicture[0];
      if (mainPic.uri && mainPic.uri.startsWith('file')) {
        formData.append('featured_pic', {
          uri: mainPic.uri,
          name: mainPic.fileName || 'featured.jpg',
          type: mainPic.type || 'image/jpeg',
        });
      }
    }

    // 🖼 Multiple gallery image fields
    const imageKeys = [
      'living_room',
      'bedroom',
      'kitchen',
      'bathroom',
      'floorplan',
      'extra',
    ];
    imageKeys.forEach(key => {
      const imgs = formatImages(images[key] || []);
      imgs.forEach(img => formData.append(`${key}[]`, img));
    });

    //Add pg_id if editing
    if (type === 'editPG' && propertyData?.property_id) {
      formData.append('pg_id', propertyData.property_id);
    }
    //Debug log
    console.log('🧾 Final FormData (debug):');
    (formData as any)._parts?.forEach((part: any) => {
      console.log(part[0], ':', part[1]);
    });
    // API call
    try {
      setLoading(true);
      const resultAction = await dispatch(addEditPg(formData)).unwrap();
      setLoading(false);
      console.log('resultAction:', resultAction);
      if (type === 'editPG') {
        showSuccessMsg('Property updated successfully.');
      } else {
        showSuccessMsg(
          'PG listed successfully. Please wait for admin approval.',
        );
      }
      navigation.goBack();
      dispatch(
        fetchMyPgList({
          company_id: userData?.company_id || '35',
          landlord_id: userData?.user_id || '197',
        }),
      );
    } catch (error) {
      setLoading(false);
      console.log('handleSubmit error =========>>>>', error);
      showErrorMsg('Something went wrong');
    }
  };

  //Dropdown Select Handlers (useCallback with stable reference)
  const handlePgForSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, pgFor: value })),
    [],
  );
  const handlePgTypeSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, pgType: value })),
    [],
  );

  const handlePgCitySelect = React.useCallback(
    (value: string[]) => {
      console.log('Selected city:', value);
      dispatch(
        fetchPgCityLocation({
          city_id: Array.isArray(value) ? value[0] : value,
        }),
      );
      setForm((prev: any) => ({ ...prev, pgCity: value }));
    },
    [dispatch],
  );

  const handlePgCityLocationSelect = React.useCallback(
    (value: string[]) =>
      setForm((prev: any) => ({ ...prev, pgCityLocation: value })),
    [],
  );

  const handlePgFloorSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, pgFloor: value })),
    [],
  );

  const handleFlooringSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, flooring: value })),
    [],
  );

  const handleWashroomSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, washroom: value })),
    [],
  );

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
          onSelect={handlePgForSelect}
        />
        <AppCustomDropdown
          label="PG Type *"
          data={pgCategories}
          selectedValues={form.pgType}
          onSelect={handlePgTypeSelect}
        />
        <AppCustomDropdown
          label="PG City *"
          data={pgCities}
          selectedValues={form.pgCity}
          onSelect={handlePgCitySelect}
        />
        {form.pgCity && (
          <AppCustomDropdown
            label="Select Locality"
            data={pgCityLocation}
            selectedValues={form.pgCityLocation}
            onSelect={handlePgCityLocationSelect}
          />
        )}

        <View>
          <Typography color={colors.gray} style={{ textAlign: 'center' }}>
            Drag or zoom to set location
          </Typography>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={onRegionChangeComplete}
            >
              <Marker coordinate={region} title="PG Location" />
            </MapView>
          </View>
        </View>
        {/* 📍 Address field */}
        <AppTextInput
          label="PG Address *"
          placeholder={
            isFetchingAddress ? 'Fetching address...' : 'Enter Address'
          }
          value={pgAddress}
          editable={!isFetchingAddress}
          onChangeText={text => setPgAddress(text)}
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
          onSelect={handlePgFloorSelect}
        />

        <AppCustomDropdown
          label="Flooring"
          data={pgFloorings}
          selectedValues={form.flooring}
          onSelect={handleFlooringSelect}
        />

        <AppCustomDropdown
          label="Washroom"
          data={pgWashrooms}
          selectedValues={form.washroom}
          onSelect={handleWashroomSelect}
        />
        {/* Extra Features */}
        <View style={{ marginBottom: 10 }}>
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
          // containerStyle={styles.descContainer}
        />
        {/* Upload Section in 2 Columns */}
        <Typography
          variant="body"
          weight="medium"
          style={[styles.sectionTitle, { marginTop: 55 }]}
        >
          Upload Property Photos
        </Typography>
        <View style={styles.uploadGrid}>
          {uploadItems.map((item, index) => {
            //Check if label includes "(Multiple)"
            const isMultiple = item.label.toLowerCase().includes('multiple');
            return (
              <View key={index} style={styles.uploadItem}>
                <ImagePickerInput
                  label={item.label}
                  value={images[item.key]}
                  onSelect={file => handleImageSelect(item.key, file)}
                  multiple={isMultiple} //Dynamically set
                />
              </View>
            );
          })}
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
