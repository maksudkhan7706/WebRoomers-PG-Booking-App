import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import AppImage from '../../../../../ui/AppImage';
import styles from '../styles';
import { NAV_KEYS } from '../../../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../navigation/NavKeys';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PGItem {
  property_id: string;
  property_title: string;
  property_price: string | number;
  property_address: string;
  property_featured_image: string;
  room_available?: string;
  company_id: string;
  pg_for?: string;
}

interface RecentPGSectionProps {
  recentPGs: PGItem[];
  isLandlord: boolean;
  navigation: NavigationProp;
  onLayout?: (event: any) => void;
}

const RecentPGSection: React.FC<RecentPGSectionProps> = ({
  recentPGs,
  isLandlord,
  navigation,
  onLayout,
}) => {
  const handlePGPress = (item: PGItem) => {
    const { room_available, property_id, company_id } = item;
    if (room_available?.toLowerCase() === 'available') {
      navigation.navigate(NAV_KEYS.PGRoomListScreen, {
        propertyId: property_id,
        companyId: company_id,
      });
    } else {
      navigation.navigate(NAV_KEYS.PGDetailScreen, {
        propertyId: property_id,
        companyId: company_id,
      });
    }
  };

  const renderPGItem = ({ item }: { item: PGItem }) => (
    <TouchableOpacity
      style={styles.pgCard}
      activeOpacity={0.8}
      onPress={() => handlePGPress(item)}
    >
      <View style={styles.pgInfoRow}>
        <View style={styles.pgTextContainer}>
          <Typography
            variant="body"
            weight="medium"
            numberOfLines={2}
            ellipsizeMode="tail"
            color={colors.mainColor}
            style={{ width: '75%' }}
          >
            {item.property_title}
          </Typography>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Typography variant="label" weight="bold">
              Price: ₹{item.property_price}
            </Typography>
          </View> */}
        </View>
      </View>

      {item?.pg_for && (
        <View
          style={[
            styles.forPgContainer,
            {
              backgroundColor:
                item.pg_for !== 'Girls' ? colors.mainColor : '#e83f8b',
            },
          ]}
        >
          <Typography
            variant="caption"
            weight="medium"
            color={colors.white}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            FOR {item.pg_for}
          </Typography>
        </View>
      )}

      <View
        style={{
          height: 300,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AppImage
          source={{ uri: item.property_featured_image }}
          style={styles.pgImage}
          resizeMode="center"
        />
      </View>

      <View style={styles.addressRow}>
        <Feather name="map-pin" size={14} color={colors.gray} />
        <Typography
          variant="caption"
          color={colors.gray}
          style={styles.pgAddressText}
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {item.property_address}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer} onLayout={onLayout}>
      {recentPGs?.length > 0 ? (
        <View style={[styles.sectionHeader, { marginBottom: 0 }]}>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.textDark}
            style={styles.sectionTitle}
          >
            Recent PG
          </Typography>
          {isLandlord ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NAV_KEYS.LandlordMyPGScreen as any)
              }
            >
              <Typography
                variant="label"
                weight="medium"
                color={colors.mainColor}
              >
                See All
              </Typography>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      <FlatList
        data={recentPGs}
        keyExtractor={item => item.property_id}
        contentContainerStyle={{ paddingBottom: 10, padding: 5 }}
        renderItem={renderPGItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RecentPGSection;

