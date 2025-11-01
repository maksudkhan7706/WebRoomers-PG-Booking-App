import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import styles from './styles';
import AppButton from '../../../ui/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLandlordEnquiryDetails } from '../../../store/mainSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppImage from '../../../ui/AppImage';
import { formatDate } from '../../../utils/formatDate';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateEnquiryStatus } from '../../../store/mainSlice';
import { Linking, Alert } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { showSuccessMsg } from '../../../utils/appMessages';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/NavKeys';
import AppImagePlaceholder from '../../../ui/AppImagePlaceholder';

type EnquiryDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

const LandlordViewEnquiryDetails = () => {
  const navigation = useNavigation<EnquiryDetailsNavProp>();
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const { landlordEnquiryDetails, loading } = useSelector(
    (state: any) => state.main,
  );
  const route = useRoute();
  const { EnquiryId, companyId }: any = route.params;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<'accept' | 'reject' | null>(
    null,
  );

  useEffect(() => {
    if (userData?.user_type === 'landlord') {
      dispatch(
        fetchLandlordEnquiryDetails({
          company_id: companyId || userData?.company_id,
          enquiry_id: EnquiryId || '',
        }),
      );
    }
  }, [userData]);

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

  const handleImagePreview = (uri: string | null) => {
    if (uri) {
      setPreviewImage(uri);
      setPreviewVisible(true);
    }
  };

  //Contact User function
  const handleContactUser = () => {
    const phone = landlordEnquiryDetails?.user?.mobile;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Error', 'User mobile number not available.');
    }
  };

  // Accept / Reject handler
  const handleConfirmAction = async () => {
    if (!confirmType) return;

    const payload = {
      company_id: companyId || userData?.company_id,
      enquiry_id: EnquiryId,
      status: confirmType === 'accept' ? 2 : 0,
    };
    try {
      const res = await dispatch(updateEnquiryStatus(payload)).unwrap();
      setConfirmModalVisible(false);
      console.log('updateEnquiryStatus Success:', res);
      showSuccessMsg(res?.message || 'Status updated successfully.');
      navigation.goBack();
    } catch (error: any) {
      console.log('updateEnquiryStatus Error:', error);
      showSuccessMsg(error?.message || 'Something went wrong.');
      setConfirmModalVisible(false);
    } finally {
      setConfirmModalVisible(false);
      setConfirmType(null);
    }
  };

  console.log('landlordEnquiryDetails?.property ', landlordEnquiryDetails);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Enquiry Details"
        showBack
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />

      {loading ? (
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.mainColor} />
          <Typography style={styles.loadingText} weight="medium">
            Loading details...
          </Typography>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enquiry Header */}
          <View style={[styles.card, styles.rowBetween]}>
            <Typography variant="body" weight="medium">
              Enquiry Details
            </Typography>
            <Typography variant="label" weight="medium">
              ID: #{landlordEnquiryDetails?.enquiry?.enquiry_id || '--'}
            </Typography>
          </View>

          {/* User Verification Details */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium">
              User Verification Details
            </Typography>
            {[
              ['Full Name', landlordEnquiryDetails?.user?.full_name],
              ['Mobile Number', landlordEnquiryDetails?.user?.mobile],
              ['Email Address', landlordEnquiryDetails?.user?.email],
              ['City', landlordEnquiryDetails?.user?.city],
              ['Aadhar Number', landlordEnquiryDetails?.user?.aadhar_number],
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

            {/* ID Proof Images */}
            <View style={styles.idProofRow}>
              {[
                {
                  title: 'Aadhar Front',
                  uri: landlordEnquiryDetails?.documents?.aadhar_front,
                },
                {
                  title: 'Aadhar Back',
                  uri: landlordEnquiryDetails?.documents?.aadhar_back,
                },
                {
                  title: 'Police Verification',
                  uri: landlordEnquiryDetails?.documents?.police_verification,
                },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={styles.idProofContainer}
                  onPress={() => handleImagePreview(item.uri)}
                >
                  <Typography variant="caption" weight="medium">
                    {item.title}
                  </Typography>
                  <AppImage
                    source={{ uri: item.uri }}
                    style={styles.screenshotImg}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reference Details */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium">
              Reference Details
            </Typography>
            {[
              ['Reference 1', landlordEnquiryDetails?.references?.reference_1],
              ['Reference 2', landlordEnquiryDetails?.references?.reference_2],
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
                  {value
                    ? `${value.name || '-'} (${value.mobile || '-'})`
                    : '-'}
                </Typography>
              </View>
            ))}
          </View>
          {/* Booking Details */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium">
              Booking Details
            </Typography>
            {[
              [
                'Check-in Date',
                formatDate(landlordEnquiryDetails?.enquiry?.check_in_date),
              ],
              [
                'Check-out Date',
                formatDate(landlordEnquiryDetails?.enquiry?.check_out_date),
              ],
              ['Stay Duration', landlordEnquiryDetails?.enquiry?.stay_duration],
              [
                'Number of Persons',
                landlordEnquiryDetails?.enquiry?.no_of_persons,
              ],
              [
                'Food Preference',
                landlordEnquiryDetails?.enquiry?.food_preference,
              ],
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

            <View style={styles.row}>
              <Typography variant="label" weight="medium">
                Enquiry Status
              </Typography>
              {renderPaymentStatusBadge(
                landlordEnquiryDetails?.enquiry?.status === '1'
                  ? 'Pending'
                  : landlordEnquiryDetails?.enquiry?.status === '2'
                  ? 'Accepted'
                  : 'Rejected',
              )}
            </View>
          </View>
          {/* PG Information */}
          {landlordEnquiryDetails?.property == null ? null : (
            <View style={styles.card}>
              <Typography variant="body" weight="medium">
                PG Information
              </Typography>

              {landlordEnquiryDetails?.property?.property_featured_image ==
              null ? (
                <AppImagePlaceholder />
              ) : (
                <AppImage
                  source={{
                    uri: landlordEnquiryDetails?.property
                      ?.property_featured_image,
                  }}
                  style={styles.photoImg}
                  resizeMode="stretch"
                />
              )}

              <Typography variant="body" weight="medium" style={styles.pgTitle}>
                {landlordEnquiryDetails?.property?.property_title}
              </Typography>

              <Typography variant="caption" weight="regular">
                📍 {landlordEnquiryDetails?.property?.property_address}
              </Typography>

              <Typography variant="label" weight="regular">
                {landlordEnquiryDetails?.property?.property_description || '-'}
              </Typography>

              {landlordEnquiryDetails?.property?.features?.length > 0 && (
                <View style={styles.featuresWrap}>
                  {landlordEnquiryDetails.property.features.map(
                    (feature: string, index: number) => (
                      <View key={index} style={styles.featureTag}>
                        <Typography variant="label" weight="regular">
                          {feature}
                        </Typography>
                      </View>
                    ),
                  )}
                </View>
              )}
            </View>
          )}
          {/* Additional Message */}
          <View style={styles.card}>
            <Typography variant="body" weight="medium" style={styles.mb8}>
              Additional Message from User:
            </Typography>
            <Typography variant="label" weight="regular">
              {landlordEnquiryDetails.enquiry?.message || '-'}
            </Typography>
          </View>
        </ScrollView>
      )}

      {/* Footer Buttons */}
      <View style={styles.footerBtns}>
        <AppButton
          title="Contact User"
          titleSize="label"
          onPress={handleContactUser}
          style={[styles.footerBtn, { backgroundColor: '#5cc0de' }]}
        />
        <AppButton
          title="Accept Booking"
          titleSize="label"
          onPress={() => {
            setConfirmType('accept');
            setConfirmModalVisible(true);
          }}
          style={[styles.footerBtn, { backgroundColor: colors.succes }]}
        />
        <AppButton
          title="Reject Booking"
          titleSize="label"
          onPress={() => {
            setConfirmType('reject');
            setConfirmModalVisible(true);
          }}
          style={[styles.footerBtn, { backgroundColor: colors.rejected }]}
        />
      </View>

      {/* Booking Confirm Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <SimpleLineIcons name="question" size={50} color="#f5a623" />
            <Typography
              variant="heading"
              weight="medium"
              style={{ marginTop: 10 }}
            >
              Are you sure?
            </Typography>
            <Typography
              variant="label"
              weight="regular"
              style={{ textAlign: 'center', marginVertical: 6 }}
            >
              {confirmType === 'accept'
                ? 'You are about to accept this booking!'
                : 'You are about to reject this booking!'}
            </Typography>

            <View style={styles.confirmBtns}>
              <AppButton
                title={
                  confirmType === 'accept' ? 'Yes, Accept It' : 'Yes, Reject It'
                }
                onPress={handleConfirmAction}
                style={[
                  styles.footerBtn,
                  {
                    backgroundColor:
                      confirmType === 'accept'
                        ? colors.succes
                        : colors.rejected,
                    width: '48%',
                    height: 40,
                  },
                ]}
              />
              <AppButton
                title="Cancel"
                onPress={() => setConfirmModalVisible(false)}
                style={[
                  styles.footerBtn,
                  { backgroundColor: '#aaa', width: '48%', height: 40 },
                ]}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Screenshot Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
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

          <View style={styles.imageContainer}>
            {previewImage && (
              <AppImage
                source={{ uri: previewImage }}
                style={styles.modalImage}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LandlordViewEnquiryDetails;
