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

type RoleSelectNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof NAV_KEYS.ROLE_SELECT
>;

const RoleSelect = () => {
  const [selectedRole, setSelectedRole] = useState<'USER' | 'LANDLORD' | null>(null);
  const navigation = useNavigation<RoleSelectNavProp>();

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate(NAV_KEYS.LOGIN, { role: selectedRole });
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppHeader title="WEBROOMERS" /> */}
      <Image source={images.TransparentWebRoomerLogo} style={[styles.logo, { marginTop: 55 }]} />
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          {['USER', 'LANDLORD'].map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.card,
                selectedRole === role && styles.selectedCard,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedRole(role as 'USER' | 'LANDLORD')}
            >
              <Image
                source={images.TransparentWebRoomerLogo}
                style={styles.logo}
              />

              <View style={styles.cardFooter}>
                <Typography variant="body" weight="bold">
                  {role}
                </Typography>
                <AntDesign name="right" size={14} color="black" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
        />
      </View>
    </View>
  );
};

export default RoleSelect;