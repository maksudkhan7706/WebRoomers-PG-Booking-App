import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '../../../ui/Typography';
import AppHeader from '../../../ui/AppHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../constants/colors';
import AppImageSlider from '../../../ui/AppImageSlider';
import AppButton from '../../../ui/AppButton';
import styles from './styles';
import { fetchMyPgList } from '../../../store/mainSlice';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type MyPGScreenProp = NativeStackNavigationProp<RootStackParamList>;

const MyPGScreen = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<MyPGScreenProp>();
  const { loading, myPgList } = useSelector((state: any) => state.main);
  const { userData } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(
      fetchMyPgList({
        company_id: userData?.company_id || '35',
        landlord_id: userData?.user_id || '197',
      }),
    );
  }, [dispatch]);

  const renderItem = ({ item }: any) => {
    let statusLabel = '';
    let bgColor = '';
    let textColor = '';

    switch (item.property_status) {
      case '0':
        statusLabel = 'Pending';
        bgColor = '#FFF3CD';
        textColor = '#856404';
        break;
      case '1':
        statusLabel = 'Activate';
        bgColor = '#D4EDDA';
        textColor = '#155724';
        break;
      case '2':
        statusLabel = 'Deactive';
        bgColor = '#F8D7DA';
        textColor = '#721C24';
        break;
      case '3':
        statusLabel = 'Deleted';
        bgColor = '#E2E3E5';
        textColor = '#383D41';
        break;
      default:
        statusLabel = '-';
        bgColor = '#CCE5FF';
        textColor = '#004085';
    }

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.headerLeft}
            onPress={() =>
              navigation.navigate(NAV_KEYS.LandlordAddPG, {
                type: 'editPG',
                propertyId: item.property_id,
              })
            }
          >
            <Feather name="edit-3" size={18} color={colors.mainColor} />
            <Typography variant="label" style={{ marginLeft: 6 }}>
              {item.property_code}
            </Typography>
          </TouchableOpacity>

          <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
            <Typography variant="label" color={textColor}>
              {statusLabel}
            </Typography>
          </View>
        </View>

        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          {item?.gallery?.living_room?.length > 0 ? (
            <AppImageSlider
              data={item.gallery.living_room.map(
                (img: string, index: number) => ({
                  id: index.toString(),
                  image: { uri: img },
                }),
              )}
              bannerImageStyle={{ marginRight: 10 }}
              showThumbnails={false}
            />
          ) : (
            //if no images return skeleton box
            <View style={styles.skeletonBox} />
          )}
        </View>

        {/* Details */}
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <Typography variant="body" weight="medium">
              City
            </Typography>
            <Typography variant="label">{item.city_name || '-'}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="body" weight="medium">
              Type
            </Typography>
            <Typography variant="label">{item.property_type}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="body" weight="medium">
              Category
            </Typography>
            <Typography variant="label">{item.property_category}</Typography>
          </View>
          <View style={styles.rowBetween}>
            <Typography variant="body" weight="medium">
              Price
            </Typography>
            <Typography variant="label">₹{item.price}</Typography>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Typography variant="body" weight="medium">
              Rooms
            </Typography>
            <AppButton
              style={{ width: 100, height: 35 }}
              title={'Add Rooms'}
              onPress={() => console.log('press')}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.mainColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <AppHeader
        title="My PG"
        rightIcon={
          <FontAwesome
            name="user-circle-o"
            size={25}
            color={colors.mainColor}
          />
        }
      />
      <FlatList
        data={myPgList?.data || []}
        renderItem={renderItem}
        keyExtractor={item => item.property_id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyPGScreen;
