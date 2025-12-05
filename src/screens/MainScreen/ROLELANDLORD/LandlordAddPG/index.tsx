import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown from '../../../../ui/AppCustomDropdown';
import colors from '../../../../constants/colors';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePickerInput from '../../../../ui/ImagePickerInput';
import AppButton from '../../../../ui/AppButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store';
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
} from '../../../../store/mainSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/NavKeys';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { appLog } from '../../../../utils/appLog';
import { dropdownOptions, uploadItems } from '../../../../constants/dummyData';
import LocationPickerCard from '../../../../components/LocationPickerCard';

type LandlordAddPGNavProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_COORDS = {
  latitude: 26.9123975,
  longitude: 75.7872966,
};

const LandlordAddPG = () => {
  const route = useRoute<any>();
  const { type, propertyData } = route.params || {};
  const navigation = useNavigation<LandlordAddPGNavProp>();
  const {
    pgCategories,
    pgCities,
    pgFloors,
    pgWashrooms,
    pgExtraFeatures,
    pgCityLocation,
  } = useSelector((state: any) => state.main);
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: any) => state.auth);
  const [furniture, setFurniture] = useState<string | null>(null);
  const [parking, setParking] = useState<string[]>([]);
  const [extraFeatures, setExtraFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<any>({});
  const [isAgreed, setIsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const isActive = isAgreed;
  const [pgAddress, setPgAddress] = useState<string>('');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDS);

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
    noticePeriod: [],
    lockInPeriod: [],
  });

  useEffect(() => {
    dispatch(fetchPgCategories({ company_id: userData?.company_id }));
    dispatch(fetchPgCities({ company_id: userData?.company_id }));
    dispatch(fetchPgFloors({ company_id: userData?.company_id }));
    dispatch(fetchPgFloorings({ company_id: userData?.company_id }));
    dispatch(fetchPgWashrooms({ company_id: userData?.company_id }));
    dispatch(
      fetchPgExtraFeatures({ company_id: userData?.company_id }),
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
      // Extract category IDs from categories array
      const categoryIds = Array.isArray(propertyData.categories)
        ? propertyData.categories.map((cat: any) =>
          String(cat?.category_id || cat?.id || ''),
        )
        : propertyData.category_id
          ? Array.isArray(propertyData.category_id)
            ? propertyData.category_id.map((id: any) => String(id))
            : typeof propertyData.category_id === 'string' &&
              propertyData.category_id.includes(',')
              ? propertyData.category_id.split(',').map((id: string) => id.trim())
              : [String(propertyData.category_id)]
          : [];

      setForm({
        pgTitle: propertyData.title || '',
        pgFor: propertyData.pg_for || '',
        pgType: categoryIds,
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
        noticePeriod: propertyData.notice_period
          ? [String(propertyData.notice_period)]
          : [],
        lockInPeriod: propertyData.lock_in_period
          ? [String(propertyData.lock_in_period)]
          : [],
      });
      setPgAddress(propertyData.address || '');
      setFurniture(propertyData.furnished || null);
      setParking(propertyData.parking ? propertyData.parking.split(',') : []);
      setExtraFeatures(
        Array.isArray(propertyData.features)
          ? propertyData.features.map((item: any) => item?.property_features_id)
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
        video: propertyData.property_video ? [propertyData.property_video] : [],
      });
      setCoordinates({
        latitude: Number(propertyData.latitude) || DEFAULT_COORDS.latitude,
        longitude: Number(propertyData.longitude) || DEFAULT_COORDS.longitude,
      });
    }
  }, [type, propertyData]);


  // Submit handler
  const handleSubmit = async () => {
    if (!isAgreed) {
      Alert.alert('⚠️ Terms', 'Please agree to Terms & Conditions.');
      return;
    }
    type ImageItem = { uri: string; name?: string; type?: string } | string;
    //Helper to send only local file images (skip URLs)
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
    //Make FormData
    const formData = new FormData();
    formData.append('company_id', userData?.company_id);
    formData.append('landlord_id', userData?.user_id);
    formData.append('user_type', userData?.user_type || 'landlord');
    formData.append('property_type', 'PG');
    formData.append('title', form.pgTitle);
    formData.append(
      'category',
      Array.isArray(form.pgType) ? form.pgType.join(',') : form.pgType,
    );
    formData.append(
      'city',
      Array.isArray(form.pgCity) ? form.pgCity[0] : form.pgCity,
    );
    formData.append(
      'city_location',
      Array.isArray(form.pgCityLocation)
        ? form.pgCityLocation[0]
        : form.pgCityLocation || '',
    );
    formData.append('latitude', coordinates.latitude.toString());
    formData.append('longitude', coordinates.longitude.toString());
    formData.append('address', pgAddress);
    formData.append('price', form.price);
    // Convert notice period and lock-in period to numeric values
    const noticePeriodValue =
      Array.isArray(form.noticePeriod) && form.noticePeriod.length > 0
        ? form.noticePeriod[0]
        : form.noticePeriod || '0';
    const lockInPeriodValue =
      Array.isArray(form.lockInPeriod) && form.lockInPeriod.length > 0
        ? form.lockInPeriod[0]
        : form.lockInPeriod || '0';
    formData.append('notice_period', noticePeriodValue);
    formData.append('lock_in_period', lockInPeriodValue);
    formData.append('security_charges', form.security);
    formData.append('maintainance_charges', form.maintenance);
    formData.append('area_sqft', form.area);
    formData.append('furnished', furniture);
    formData.append(
      'parking',
      Array.isArray(parking)
        ? parking[0] === 'No Parking'
          ? 'No'
          : parking[0]
        : parking === 'No Parking'
          ? 'No'
          : parking,
    );
    formData.append(
      'floor',
      Array.isArray(form.pgFloor) ? form.pgFloor[0] : form.pgFloor,
    );
    formData.append('balconies', '1');
    formData.append(
      'washroom',
      Array.isArray(form.washroom) ? form.washroom[0] : form.washroom,
    );
    formData.append(
      'features',
      Array.isArray(extraFeatures) ? extraFeatures.join(',') : extraFeatures,
    );
    formData.append('description', form.description);
    formData.append('total_rooms', form.totalRooms);
    formData.append(
      'pg_for',
      Array.isArray(form.pgFor) ? form.pgFor[0] : form.pgFor,
    );
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
    const imageKeysMap = {
      living_room: 'livingRoom',
      bedroom: 'bedroom',
      kitchen: 'kitchen',
      bathroom: 'bathroom',
      floorplan: 'floorplan',
      extra: 'extraImages',
    };

    Object.entries(imageKeysMap).forEach(([apiKey, stateKey]) => {
      const imgs = formatImages(images[stateKey] || []);
      imgs.forEach(img => formData.append(`${apiKey}[]`, img));
    });

    if (images.video?.[0] && typeof images.video[0] !== 'string') {
      const vid = images.video[0];
      formData.append('video', {
        uri: vid.uri,
        name: vid.fileName || 'video.mp4',
        type: vid.type || 'video/mp4',
      });
    }
    if (type === 'editPG' && propertyData?.property_id) {
      formData.append('pg_id', propertyData.property_id);
    }
    (formData as any)._parts?.forEach((part: any) => {
      appLog(part[0], ':', part[1]);
    });
    try {
      setLoading(true);
      const resultAction = await dispatch(addEditPg(formData)).unwrap();
      setLoading(false);
      //Check API success status
      if (resultAction?.success) {
        showSuccessMsg(
          resultAction?.message || 'Property updated successfully.',
        );
        navigation.goBack();
        dispatch(
          fetchMyPgList({
            company_id: userData?.company_id,
            landlord_id: userData?.user_id,
            user_type: userData?.user_type,
            property_id: userData?.assigned_pg_ids,
          }),
        );
      } else {
        showErrorMsg(resultAction?.message || 'Something went wrong');
      }
    } catch (error: any) {
      setLoading(false);
      appLog('LandlordAddPG', 'handleSubmit error:', error);
      showErrorMsg(error?.message || 'Something went wrong');
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
  const handleWashroomSelect = React.useCallback(
    (value: string[]) => setForm((prev: any) => ({ ...prev, washroom: value })),
    [],
  );

  const handleNoticePeriodSelect = React.useCallback(
    (value: string[]) =>
      setForm((prev: any) => ({ ...prev, noticePeriod: value })),
    [],
  );

  const handleLockInPeriodSelect = React.useCallback(
    (value: string[]) =>
      setForm((prev: any) => ({ ...prev, lockInPeriod: value })),
    [],
  );


  return (
    <View style={styles.container}>
      <AppHeader title={type === 'editPG' ? 'Edit PG' : 'Add PG'} showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
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
          data={dropdownOptions.pgForOptions}
          selectedValues={form.pgFor}
          onSelect={handlePgForSelect}
        />
        <AppCustomDropdown
          label="PG Type *"
          data={pgCategories}
          selectedValues={form.pgType}
          onSelect={handlePgTypeSelect}
          multiSelect={true}
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

        <LocationPickerCard
          coordinates={coordinates}
          onCoordinatesChange={setCoordinates}
          address={pgAddress}
          onAddressChange={setPgAddress}
          onAddressFetchingChange={setIsFetchingAddress}
        />
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
        <AppCustomDropdown
          label="Notice Period *"
          placeholder="Select Notice Period"
          data={dropdownOptions.noticePeriodOptions}
          selectedValues={form.noticePeriod}
          onSelect={handleNoticePeriodSelect}
        />
        <AppCustomDropdown
          label="Lock-in Period *"
          placeholder="Select Lock-in Period"
          data={dropdownOptions.lockInPeriodOptions}
          selectedValues={form.lockInPeriod}
          onSelect={handleLockInPeriodSelect}
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
        {/* Furniture */}
        <Typography variant="body" weight="medium" style={styles.sectionTitle}>
          Furniture
        </Typography>
        <View style={styles.rowWrap}>
          {dropdownOptions.furnitureOptions.map(opt => (
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
          {dropdownOptions?.parkingOptions.map((label, index) => (
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
          label="Total Floor in PG"
          data={pgFloors}
          selectedValues={form.pgFloor}
          onSelect={handlePgFloorSelect}
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
                  multiple={isMultiple}
                  pickerPlachholer={
                    item.key == 'video'
                      ? 'Upload / Capture Video'
                      : 'Upload / Capture Photo'
                  }
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