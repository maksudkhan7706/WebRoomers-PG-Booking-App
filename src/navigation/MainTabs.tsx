import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import FloatingActions from '../ui/FloatingActions';
import { StyleSheet, View } from 'react-native';
import UserMyBookingScreen from '../screens/MainScreen/ROLEUSER/UserMyBookingScreen';
import UserComplaintScreen from '../screens/MainScreen/ROLEUSER/UserComplaintScreen';
import LandlordComplaintScreen from '../screens/MainScreen/ROLELANDLORD/LandlordComplaintScreen';
import LandlordRenewalScreen from '../screens/MainScreen/ROLELANDLORD/LandlordRenewalScreen';
import LandlordMyPGScreen from '../screens/MainScreen/ROLELANDLORD/LandlordMyPGScreen';
import HomeScreen from '../screens/MainScreen/COMMON/HomeScreen';
import ProfileMenuSection from '../screens/MainScreen/COMMON/ProfileMenuSection';

const Tab = createBottomTabNavigator();

const MainTabs = ({ route }: any) => {
  const role = route.params?.role ?? 'user';
  const insets = useSafeAreaInsets();
  const tabBarHeight = 75 + insets.bottom;
  const [currentRoute, setCurrentRoute] = useState<string>('HomeScreen');
  // Determine if FloatingActions should be shown
  const shouldShowFloatingActions =
    role !== 'landlord' && currentRoute !== 'UserComplaintScreen';

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.75)',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName = 'home';
            if (route.name === 'UserComplaintScreen')
              iconName = 'report-problem';
            else if (route.name === 'LandlordComplaintScreen')
              iconName = 'report-problem';
            else if (route.name === 'UserMyBookingScreen') iconName = 'domain';
            else if (route.name === 'ProfileMenuSection') iconName = 'person';
            else if (route.name === 'LandlordMyPGScreen') iconName = 'domain';
            else if (route.name === 'LandlordRenewalScreen')
              iconName = 'autorenew';
            return (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                <Icon name={iconName} size={size} color={color} />
              </View>
            );
          },
          tabBarStyle: [
            styles.tabBar,
            {
              height: tabBarHeight,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ],
          tabBarItemStyle: {
            paddingTop: 10,
            paddingBottom: 4,
          },
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
          listeners={{
            focus: () => setCurrentRoute('HomeScreen'),
          }}
        />

        {role === 'landlord' && (
          <Tab.Screen
            name="LandlordMyPGScreen"
            component={LandlordMyPGScreen}
            options={{ tabBarLabel: 'My PG' }}
            listeners={{
              focus: () => setCurrentRoute('LandlordMyPGScreen'),
            }}
          />
        )}

        {role === 'landlord' && (
          <Tab.Screen
            name="LandlordRenewalScreen"
            component={LandlordRenewalScreen}
            options={{ tabBarLabel: 'Renewal' }}
            listeners={{
              focus: () => setCurrentRoute('LandlordRenewalScreen'),
            }}
          />
        )}

        {role === 'user' && (
          <Tab.Screen
            name="UserMyBookingScreen"
            component={UserMyBookingScreen}
            options={{ tabBarLabel: 'My Booking' }}
            listeners={{
              focus: () => setCurrentRoute('UserMyBookingScreen'),
            }}
          />
        )}

        {role === 'user' ? (
          <Tab.Screen
            name="UserComplaintScreen"
            component={UserComplaintScreen}
            options={{ tabBarLabel: 'Complaint' }}
            listeners={{
              focus: () => setCurrentRoute('UserComplaintScreen'),
            }}
          />
        ) : (
          <Tab.Screen
            name="LandlordComplaintScreen"
            component={LandlordComplaintScreen}
            options={{ tabBarLabel: 'Complaint' }}
            listeners={{
              focus: () => setCurrentRoute('LandlordComplaintScreen'),
            }}
          />
        )}

        <Tab.Screen
          name="ProfileMenuSection"
          component={ProfileMenuSection}
          options={{ tabBarLabel: 'Profile' }}
          listeners={{
            focus: () => setCurrentRoute('ProfileMenuSection'),
          }}
        />
      </Tab.Navigator>
      {shouldShowFloatingActions && <FloatingActions />}
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: colors.mainColor,
    elevation: 10,
    shadowColor: '#0A2F51',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default MainTabs;
