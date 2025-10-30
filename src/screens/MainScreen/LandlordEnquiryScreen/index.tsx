import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constants/colors';
import styles from './styles';
import AppButton from '../../../ui/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLandlordEnquiries } from '../../../store/mainSlice';

const LandlordEnquiryScreen = () => {
  const dispatch = useDispatch<any>();
  const { userData } = useSelector((state: any) => state.auth);
  const { pgEnquiries, loading } = useSelector((state: any) => state.main);

  useEffect(() => {
    if (userData?.user_type === 'landlord') {
      dispatch(
        fetchLandlordEnquiries({
          company_id: userData?.company_id,
          landlord_id: userData?.user_id,
        }),
      );
    }
  }, [userData]);

  const enquiriesList = pgEnquiries ? Object.values(pgEnquiries) : [];

  const renderStatusBadge = (status: string) => {
    const bgColor =
      status === 'Pending'
        ? '#FFD54F'
        : status === 'Accepted'
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

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {[
        { label: 'Name', value: item.name },
        { label: 'Mobile', value: item.mobile },
        { label: 'Check In', value: item.check_in_date },
        { label: 'Check Out', value: item.check_out_date },
        { label: 'Stay Duration', value: item.stay_duration },
        { label: 'No. of Persons', value: item.no_of_persons },
        { label: 'Food Preference', value: item.food_preference },
      ].map((field, index) => (
        <View key={index} style={styles.row}>
          <Typography weight="medium" variant="label" style={styles.label}>
            {field.label}:
          </Typography>
          <Typography weight="regular" variant="label" style={styles.value}>
            {field.value}
          </Typography>
        </View>
      ))}

      <View style={[styles.row, { marginTop: 5 }]}>
        <Typography weight="medium" variant="label" style={styles.label}>
          Status:
        </Typography>
        {renderStatusBadge('Pending')}
      </View>

      <View style={[styles.row, { marginTop: 5 }]}>
        <Typography style={styles.label}>Action:</Typography>
        <TouchableOpacity style={styles.paymentButton}>
          <AppButton
            title="View"
            onPress={() => console.log('View')}
            style={{ marginRight: 5, width: 70, height: 30 }}
          />
          <AppButton
            title="Payment Detail"
            onPress={() => console.log('Payment')}
            style={{
              marginTop: 0,
              width: 125,
              height: 30,
              backgroundColor: '#19a2b8',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.mainColor} />
        <Typography
          style={{ textAlign: 'center', marginTop: 10 }}
          weight="medium"
        >
          Loading enquiries...
        </Typography>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <AppHeader
        title="Enquiries"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      <FlatList
        data={enquiriesList}
        keyExtractor={(item: any, i) =>
          item.enquiry_id?.toString() || i.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Typography
            style={{ textAlign: 'center', marginTop: 50 }}
            weight="medium"
          >
            No Enquiries Found
          </Typography>
        }
      />
    </View>
  );
};

export default LandlordEnquiryScreen;
