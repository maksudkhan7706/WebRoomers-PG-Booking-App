import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NAV_KEYS, RootStackParamList } from '../../../navigation/NavKeys';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Typography from '../../../ui/Typography';
import styles from './styles';
import images from '../../../assets/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '../../../ui/AppButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type RoleSelectNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.ROLE_SELECT
>;

const RoleSelect = () => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'landlord' | null>(
    null,
  );
  const navigation = useNavigation<RoleSelectNavProp>();

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate(NAV_KEYS.LOGIN, { role: selectedRole });
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppHeader title="WEBROOMERS" /> */}
      <Image
        source={images.TransparentWebRoomerLogo}
        style={[styles.logo, { marginTop: 125 }]}
      />
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          {['user', 'landlord'].map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.card,
                selectedRole === role && styles.selectedCard,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedRole(role as 'user' | 'landlord')}
            >
              <View style={styles.cardFooter}>
                <View>
                  {role == 'user' ? (
                    <FontAwesome5 name="user" size={30} color="black" />
                  ) : (
                    <FontAwesome5 name="user-tie" size={30} color="black" />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 30,
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography variant="body" weight="bold">
                    {role.toUpperCase()}
                  </Typography>
                  <AntDesign name="right" size={14} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={{
            marginBottom: 120,
          }}
        />
      </View>
    </View>
  );
};

export default RoleSelect;
