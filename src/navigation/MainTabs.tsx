import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import PGEnquiryScreen from '../screens/MainScreen/PGEnquiryScreen';
import HomeScreen from '../screens/MainScreen/HomeScreen';
import ProfileScreen from '../screens/MainScreen/ProfileScreen';
import MyPGScreen from '../screens/MainScreen/MyPGScreen';
import FloatingActions from '../ui/FloatingActions';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabs = ({ route }: any) => {
  const role = route.params?.role ?? 'user'; // default user
  console.log('role ==========>>>>>>', role);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.mainColor,
          tabBarInactiveTintColor: colors.lightGary,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'PGEnquiryScreen') iconName = 'list';
            else if (route.name === 'ProfileScreen') iconName = 'person';
            else if (route.name === 'MyPGScreen') iconName = 'domain';
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
        <Tab.Screen
          name="PGEnquiryScreen"
          component={PGEnquiryScreen}
          options={{ tabBarLabel: 'Enquiry' }}
        />
        {role === 'landlord' && (
          <Tab.Screen
            name="MyPGScreen"
            component={MyPGScreen}
            options={{ tabBarLabel: 'My PG' }}
          />
        )}
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>

      <FloatingActions />
    </>
  );
};

export default MainTabs;
