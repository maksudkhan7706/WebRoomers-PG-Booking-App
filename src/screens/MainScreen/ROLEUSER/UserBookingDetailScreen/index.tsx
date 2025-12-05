import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AppImage from '../../../../ui/AppImage';
import AppButton from '../../../../ui/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAV_KEYS, RootStackParamList } from '../../../../navigation/NavKeys';
import Typography from '../../../../ui/Typography';
import { appLog } from '../../../../utils/appLog';

type BookingDetailNavProp = NativeStackNavigationProp<RootStackParamList>;

const UserBookingDetailScreen = () => {
  const route = useRoute();
  const { BookingData }: any = route.params;
  const navigation = useNavigation<BookingDetailNavProp>();
  const { loading } = useSelector((state: any) => state.main);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const roomData = BookingData.room;
  const [region, setRegion] = useState({
    latitude: 26.9124, // Jaipur default
    longitude: 75.7873,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  useEffect(() => {
    setRegion({
      latitude: Number(BookingData?.property?.property_latitude) || 26.9124,
      longitude: Number(BookingData?.property?.property_longitude) || 75.7873,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }, []);

  const renderPaymentStatusBadge = (status: string) => {
    const bgColor =
      status === 'Pending'
        ? '#FFD54F'
        : status === 'Active'
          ? '#4CAF50'
          : '#E57373';

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Typography variant="caption" weight="medium" style={styles.statusText}>
          {status}
        </Typography>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.mainColor} />
        <Typography style={styles.loadingText} weight="medium">
          Loading details...
        </Typography>
      </View>
    );
  }

  const securityCharges =
    BookingData?.room?.security_deposit ??
    BookingData?.property?.property_security_charges ??
    0;
  const maintainanceCharges =
    BookingData?.room?.mantinance_deposit ??
    BookingData?.property?.property_maintainance_charges ??
    0;

  const isRoom = !!BookingData?.room;

  const landlordId = isRoom
    ? BookingData?.room?.landlord_id
    : BookingData?.property?.landlord_id;

  const pgId = isRoom
    ? BookingData?.room?.pg_id
    : BookingData?.property?.property_id;

  const totalAmount = BookingData?.amount ?? 0;

  const RoomRent = isRoom
    ? BookingData?.room?.room_rent ?? 0
    : BookingData?.property?.room_rent ?? 0;

  return (
    <View style={styles.container}>
      <AppHeader title="Booking Details" showBack />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Status */}
        <View style={[styles.card, styles.rowBetween]}>
          <Typography variant="body" weight="medium">
            Booking Status
          </Typography>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  BookingData?.status === 'Pending'
                    ? colors.pending
                    : BookingData?.status === 'Accepted'
                      ? colors.accepted
                      : colors.rejected,
              },
            ]}
          >
            <Typography variant="label" weight="medium" color={colors.white}>
              {BookingData?.status === 'Pending'
                ? 'Pending'
                : BookingData?.status === 'Accepted'
                  ? 'Accepted'
                  : 'Rejected'}
            </Typography>
          </View>
        </View>

        {/* PG Address */}
        <View style={styles.card}>
          <Typography variant="body" weight="medium">
            PG Address
          </Typography>
          {[
            ['PG Name', BookingData?.property?.property_title],
            [
              'City',
              BookingData?.property?.city_location_name,
              BookingData?.property?.city_name,
            ],
            ['Address', BookingData?.property?.property_address],
          ].map(([label, value1, value2], i) => (
            <View key={i} style={styles.row}>
              <Typography variant="label" weight="medium">
                {label}
              </Typography>
              <Typography variant="label" weight="regular" style={styles.value}>
                {label === 'City'
                  ? `${value1 || '-'}, ${value2 || '-'}`
                  : value1 || '-'}
              </Typography>
            </View>
          ))}

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
            >
              <Marker coordinate={region} title="PG Location" />
            </MapView>
          </View>
        </View>

        {/* Room Details */}
        {roomData && Object.keys(roomData).length > 0 && (
          <View style={styles.card}>
            <Typography variant="body" weight="medium">
              Room Details
            </Typography>

            {[
              ['Room Number', roomData?.room_number || '-'],
              ['Price', `₹${roomData?.price || '0'}`],
              ['Security Deposit', `₹${roomData?.security_deposit || '0'}`],
              ['Room Type', roomData?.room_type || '-'],
              ['Description', roomData?.description || '-'],
            ].map(([label, value], i) => (
              <View key={i} style={styles.row}>
                <Typography variant="label" weight="medium">
                  {label}
                </Typography>
                <Typography
                  variant="label"
                  weight="regular"
                  style={styles.value}
                >
                  {value || '-'}
                </Typography>
              </View>
            ))}

            {/* Room Images */}
            {Array.isArray(roomData?.images) && roomData.images.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Typography variant="body" weight="medium" style={styles.mb8}>
                  Room Images
                </Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {roomData.images.map((imgUrl: string, index: number) => (
                    <View key={index} style={{ marginRight: 8 }}>
                      <AppImage
                        source={{ uri: imgUrl }}
                        style={{
                          width: 100,
                          height: 80,
                          borderRadius: 8,
                          backgroundColor: '#f2f2f2',
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Room Facilities */}
            {Array.isArray(roomData?.facilities) &&
              roomData.facilities.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Typography variant="body" weight="medium" style={styles.mb8}>
                    Room Facilities
                  </Typography>
                  <View style={styles.featuresWrap}>
                    {roomData.facilities.map((item: string, index: number) => (
                      <View key={index} style={styles.featureTag}>
                        <Typography variant="label" weight="regular">
                          {item}
                        </Typography>
                      </View>
                    ))}
                  </View>
                </View>
              )}
          </View>
        )}

        {/* Pricing & Details */}
        <View style={styles.card}>
          <Typography variant="body" weight="medium">
            Pricing & Details
          </Typography>
          {[
            ['PG For', BookingData?.property?.pg_for],
            ['Price (per room)', `₹${BookingData?.property?.property_price}`],
            [
              'Security Deposit',
              `₹${BookingData?.property?.property_security_charges}`,
            ],
            [
              'Maintenance',
              `₹${BookingData?.property?.property_maintainance_charges}`,
            ],
            ['Total Rooms', BookingData?.property?.total_rooms],
            [
              'Area',
              `${BookingData?.property?.property_area_sqft || ''} ${BookingData?.property?.property_area_type || ''
              }`,
            ],
            ['Furniture', BookingData?.property?.property_furnished],
            ['Parking', BookingData?.property?.property_parking],

            ['Lock In Period', BookingData?.property?.lock_in_period],
            ['Notice Period', BookingData?.property?.notice_period],
          ].map(([label, value], i) => (
            <View key={i} style={styles.row}>
              <Typography variant="label" weight="medium">
                {label}
              </Typography>
              <Typography variant="label" weight="regular" style={styles.value}>
                {value || '-'}
              </Typography>
            </View>
          ))}
        </View>

        {/* PG  Features */}
        {BookingData?.property?.property_features?.length > 0 && (
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.mb8}>
              PG Features
            </Typography>
            <View style={styles.featuresWrap}>
              {BookingData.property.property_features.map(
                (feature: any, index: number) => (
                  <View key={index} style={styles.featureTag}>
                    <Typography variant="label" weight="regular">
                      {feature.property_features_title}
                    </Typography>
                  </View>
                ),
              )}
            </View>
          </View>
        )}

        {/* Property Description */}
        {BookingData?.property?.property_description && (
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.mb8}>
              Description
            </Typography>
            <Typography variant="label" weight="regular">
              {BookingData.property.property_description
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .trim()}
            </Typography>
          </View>
        )}

        {/* Payment Details */}
        {/* <View style={styles.card}>
          <Typography variant="body" weight="medium">
            Payment Details
          </Typography>

          {[
            ['Amount', `₹${BookingData?.property?.property_price}`],
            ['Start Date', formatDate(BookingData?.payment_start_date)],
            ['End Date', formatDate(BookingData?.payment_end_date)],
          ].map(([label, value], i) => (
            <View key={i} style={styles.row}>
              <Typography variant="label" weight="medium">
                {label}
              </Typography>
              <Typography variant="label" weight="regular" style={styles.value}>
                {value || '-'}
              </Typography>
            </View>
          ))}

          <View style={styles.row}>
            <Typography variant="label" weight="medium">
              Status
            </Typography>
            {renderPaymentStatusBadge(BookingData?.payment_status_text)}
          </View>

          <View style={styles.screenshotContainer}>
            <Typography weight="medium" variant="label" style={styles.label}>
              Screenshot:
            </Typography>
            <TouchableOpacity
              onPress={() => {
                setPreviewImage(BookingData?.property?.property_featured_image);
                setPreviewVisible(true);
              }}
              activeOpacity={0.8}
            >
              <AppImage
                source={{
                  uri: BookingData?.property?.property_featured_image,
                }}
                style={styles.screenshotImg}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Property Photos */}
        <View style={styles.card}>
          <Typography variant="body" weight="medium">
            Property Photos
          </Typography>
          <AppImage
            source={{
              uri: BookingData?.property?.property_featured_image,
            }}
            style={styles.photoImg}
            resizeMode="stretch"
          />
        </View>
      </ScrollView>
      {BookingData?.pay_action && (
        <View
          style={{
            padding: 10,
            marginBottom: 20,
          }}
        >
          <AppButton
            title="Pay"
            titleSize="label"
            onPress={() =>
              navigation.navigate(NAV_KEYS.UserPaymentScreen, {
                LandlordId: landlordId,
                PgId: pgId,
                Amount: totalAmount,
                EnquiryId: BookingData?.enquiry_id,
                PaymentStartDate: BookingData?.check_in_date,
                PaymentStartEnd: BookingData?.check_out_date,
                SecurityCharges: securityCharges,
                MaintainanceCharges: maintainanceCharges,
                RoomRent: RoomRent,
                LandlordName: BookingData?.property?.property_user_name,
                LandlordEmail: BookingData?.property?.property_user_email,
                LandlordMobile: BookingData?.property?.property_user_mobile,
              })
            }
            style={{ backgroundColor: colors.succes }}
          />
        </View>
      )}
      {/* Screenshot Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={() => setPreviewVisible(false)}
            hitSlop={20}
            style={styles.modalCloseBtn}
          >
            <Typography variant="caption" style={styles.modalCloseText}>
              ✕
            </Typography>
          </TouchableOpacity>

          {previewImage && (
            <AppImage
              source={{ uri: previewImage }}
              style={styles.modalImage}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default UserBookingDetailScreen;
