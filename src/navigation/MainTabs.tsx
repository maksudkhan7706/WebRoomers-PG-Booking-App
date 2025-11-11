import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import FloatingActions from '../ui/FloatingActions';
import { View } from 'react-native';
import UserMyBookingScreen from '../screens/MainScreen/ROLEUSER/UserMyBookingScreen';
import UserEnquiryScreen from '../screens/MainScreen/ROLEUSER/UserEnquiryScreen';
import LandlordEnquiryScreen from '../screens/MainScreen/ROLELANDLORD/LandlordEnquiryScreen';
import LandlordRenewalScreen from '../screens/MainScreen/ROLELANDLORD/LandlordRenewalScreen';
import LandlordMyPGScreen from '../screens/MainScreen/ROLELANDLORD/LandlordMyPGScreen';
import HomeScreen from '../screens/MainScreen/COMMON/HomeScreen';
import ProfileScreen from '../screens/MainScreen/COMMON/ProfileScreen';
import ProfileMenuSection from '../screens/MainScreen/COMMON/ProfileMenuSection';

const Tab = createBottomTabNavigator();

const MainTabs = ({ route }: any) => {
  const role = route.params?.role ?? 'user';
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.mainColor,
          tabBarInactiveTintColor: colors.lightGary,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'UserEnquiryScreen') iconName = 'list';
            else if (route.name === 'LandlordEnquiryScreen') iconName = 'list';
            else if (route.name === 'UserMyBookingScreen') iconName = 'domain';
            else if (route.name === 'ProfileMenuSection') iconName = 'person';
            else if (route.name === 'LandlordMyPGScreen') iconName = 'domain';
            else if (route.name === 'LandlordRenewalScreen')
              iconName = 'autorenew';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            position: 'absolute',
            height: 80,
            paddingTop: 15,
            borderRadius: 20,
            marginBottom: 20,
            marginHorizontal: 16,
            backgroundColor: colors.white, // your color
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <View style={{ backgroundColor: 'transparent', flex: 1 }} />
          ),
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
        />

        {role === 'landlord' ? (
          <Tab.Screen
            name="LandlordEnquiryScreen"
            component={LandlordEnquiryScreen}
            options={{ tabBarLabel: 'Enquiry' }}
          />
        ) : (
          <>
            <Tab.Screen
              name="UserEnquiryScreen"
              component={UserEnquiryScreen}
              options={{ tabBarLabel: 'Enquiry' }}
            />
            <Tab.Screen
              name="UserMyBookingScreen"
              component={UserMyBookingScreen}
              options={{ tabBarLabel: 'My Booking' }}
            />
          </>
        )}

        {role === 'landlord' && (
          <Tab.Screen
            name="LandlordMyPGScreen"
            component={LandlordMyPGScreen}
            options={{ tabBarLabel: 'My PG' }}
          />
        )}

        {role === 'landlord' && (
          <Tab.Screen
            name="LandlordRenewalScreen"
            component={LandlordRenewalScreen}
            options={{ tabBarLabel: 'Renewal' }}
          />
        )}

        <Tab.Screen
          name="ProfileMenuSection"
          component={ProfileMenuSection}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
      {role === 'landlord' ? null : (
        <FloatingActions />
      )}
    </>
  );
};

export default MainTabs;
