import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from '../constants/colors';
import AppTextInput from '../ui/AppTextInput';
import Typography from '../ui/Typography';
import { checkLocationPermission } from '../utils/permissions';
import { appLog } from '../utils/appLog';

type LocationPickerCardProps = {
  coordinates: LatLng;
  onCoordinatesChange: (coords: LatLng) => void;
  address: string;
  onAddressChange: (address: string) => void;
  onAddressFetchingChange?: (fetching: boolean) => void;
  style?: object;
};

const DELTA = 0.05;

const LocationPickerCard: React.FC<LocationPickerCardProps> = ({
  coordinates,
  onCoordinatesChange,
  address,
  onAddressChange,
  onAddressFetchingChange,
  style,
}) => {
  const mapRef = useRef<MapView>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadRef = useRef(true);
  const prevCoordsRef = useRef({
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  });

  const [region, setRegion] = useState<Region>({
    ...coordinates,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  });
  const [lastCoords, setLastCoords] = useState({
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      try {
        onAddressFetchingChange?.(true);
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
          throw new Error(`HTTP Error ${response.status}`);
        }
        const data = await response.json();
        const { road, neighbourhood, city, state, postcode, country } =
          data?.address || {};
        let formattedAddress = '';
        if (initialLoadRef.current) {
          formattedAddress = [city, state, postcode, country]
            .filter(Boolean)
            .join(', ');
          initialLoadRef.current = false;
        } else {
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
        onAddressChange(
          formattedAddress ||
            data?.display_name ||
            city ||
            state ||
            address ||
            '',
        );
      } catch (error) {
        appLog('LocationPickerCard', 'reverse geocode error', error);
      } finally {
        onAddressFetchingChange?.(false);
      }
    },
    [address, onAddressChange, onAddressFetchingChange],
  );

  useEffect(() => {
    const latDiff = Math.abs(coordinates.latitude - prevCoordsRef.current.lat);
    const lngDiff = Math.abs(coordinates.longitude - prevCoordsRef.current.lng);
    // If coordinates changed significantly (more than 0.001), animate to new location
    if (latDiff > 0.001 || lngDiff > 0.001) {
      const updatedRegion: Region = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA,
      };
      setRegion(updatedRegion);
      setLastCoords({ lat: coordinates.latitude, lng: coordinates.longitude });
      prevCoordsRef.current = { lat: coordinates.latitude, lng: coordinates.longitude };
      mapRef.current?.animateToRegion(updatedRegion, 500);
      // Fetch address for the new coordinates
      fetchAddress(coordinates.latitude, coordinates.longitude);
    } else {
      setRegion(prev => ({
        ...prev,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));
      setLastCoords({ lat: coordinates.latitude, lng: coordinates.longitude });
      prevCoordsRef.current = { lat: coordinates.latitude, lng: coordinates.longitude };
    }
  }, [coordinates.latitude, coordinates.longitude, fetchAddress]);

  useEffect(() => {
    if (!address) {
      fetchAddress(coordinates.latitude, coordinates.longitude);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const encoded = encodeURIComponent(query.trim());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MeharPGApp/1.0 (contact: support@meharpg.com)',
            'Accept-Language': 'en',
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      appLog('LocationPickerCard', 'search error', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchSearchResults(text);
      }, 400);
    },
    [fetchSearchResults],
  );

  const handleSelectSearchResult = useCallback(
    (item: any) => {
      const latitude = parseFloat(item?.lat);
      const longitude = parseFloat(item?.lon);
      if (isNaN(latitude) || isNaN(longitude)) {
        return;
      }
      setSearchQuery(item?.display_name || '');
      setSearchResults([]);
      const updatedRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(updatedRegion);
      setLastCoords({ lat: latitude, lng: longitude });
      mapRef.current?.animateToRegion(updatedRegion, 350);
      onCoordinatesChange({ latitude, longitude });
      onAddressChange(item?.display_name || '');
      fetchAddress(latitude, longitude);
    },
    [fetchAddress, onAddressChange, onCoordinatesChange],
  );

  const handleLocateMe = useCallback(async () => {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow location access to fetch your current location.',
      );
      return;
    }
    setIsFetchingLocation(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const updatedRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(updatedRegion);
        setLastCoords({ lat: latitude, lng: longitude });
        mapRef.current?.animateToRegion(updatedRegion, 350);
        setSearchQuery('');
        onCoordinatesChange({ latitude, longitude });
        fetchAddress(latitude, longitude);
        setIsFetchingLocation(false);
      },
      error => {
        setIsFetchingLocation(false);
        appLog('LocationPickerCard', 'current location error', error);
        Alert.alert(
          'Location',
          'Unable to fetch your current location. Please try again.',
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [fetchAddress, onCoordinatesChange]);

  const handleRegionChangeComplete = useCallback(
    async (newRegion: Region) => {
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please allow location access to update address on map.',
        );
        return;
      }
      const latChanged = Math.abs(newRegion.latitude - lastCoords.lat) > 0.0005;
      const lngChanged =
        Math.abs(newRegion.longitude - lastCoords.lng) > 0.0005;
      if (latChanged || lngChanged) {
        setRegion(newRegion);
        setLastCoords({
          lat: newRegion.latitude,
          lng: newRegion.longitude,
        });
        setSearchQuery('');
        onCoordinatesChange({
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
        });
        fetchAddress(newRegion.latitude, newRegion.longitude);
      }
    },
    [fetchAddress, lastCoords.lat, lastCoords.lng, onCoordinatesChange],
  );

  return (
    <View style={[styles.wrapper, style]}>
      <Typography color={colors.gray} style={styles.hint}>
        Drag or zoom to set location
      </Typography>

      <AppTextInput
        label="Search location"
        placeholder="Type area, landmark or address"
        value={searchQuery}
        onChangeText={handleSearchChange}
        leftIcon={<Icon name="search" size={18} color={colors.gray} />}
        rightIcon={
          searchQuery ? (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <Icon name="close" size={18} color={colors.gray} />
            </TouchableOpacity>
          ) : isSearching ? (
            <ActivityIndicator size="small" />
          ) : undefined
        }
      />

      {searchResults.length > 0 && (
        <View style={styles.suggestionWrapper}>
          <ScrollView
            style={styles.suggestionContainer}
            contentContainerStyle={styles.suggestionContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {searchResults.map(item => (
              <TouchableOpacity
                key={item?.place_id}
                style={styles.suggestionItem}
                activeOpacity={0.7}
                onPress={() => handleSelectSearchResult(item)}
              >
                <Typography numberOfLines={2} color={colors.gray}>
                  {item?.display_name}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          <Marker coordinate={region} title="Selected Location" />
        </MapView>

        <TouchableOpacity
          style={styles.locateButton}
          onPress={handleLocateMe}
          activeOpacity={0.85}
        >
          {isFetchingLocation ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Icon name="my-location" size={22} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  hint: {
    textAlign: 'center',
    marginBottom: 12,
  },
  suggestionWrapper: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  suggestionContainer: {
    maxHeight: 200,
  },
  suggestionContent: {
    paddingVertical: 4,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGary,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  locateButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default memo(LocationPickerCard);
