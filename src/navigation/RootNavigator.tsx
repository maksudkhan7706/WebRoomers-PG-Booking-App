import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_KEYS } from './NavKeys';
import RoleSelect from '../screens/AuthScreen/RoleSelect';
import Login from '../screens/AuthScreen/Login';
import Register from '../screens/AuthScreen/Register';
import MainTabs from './MainTabs';
import ForgotPassword from '../screens/AuthScreen/ForgotPassword';
import PGDetailScreen from '../screens/MainScreen/PGDetailScreen';
import PGRoomListScreen from '../screens/MainScreen/PGRoomListScreen';
import PGRoomDetailScreen from '../screens/MainScreen/PGRoomDetailScreen';
import PGBookScreen from '../screens/MainScreen/PGBookScreen';
import ProfileScreen from '../screens/MainScreen/ProfileScreen';
import EmailVerification from '../screens/AuthScreen/EmailVerification';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const role = useSelector((state: RootState) => state.auth.userRole) ?? 'user';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuth ? (
        <>
          <Stack.Screen name={NAV_KEYS.MAIN_TABS}>
            {props => (
              <MainTabs
                {...props}
                route={{ ...props.route, params: { role } }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name={NAV_KEYS.PGDetailScreen}
            component={PGDetailScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.PGRoomListScreen}
            component={PGRoomListScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.PGRoomDetailScreen}
            component={PGRoomDetailScreen}
          />
          <Stack.Screen name={NAV_KEYS.PGBookScreen} component={PGBookScreen} />
          <Stack.Screen name={NAV_KEYS.ProfileScreen} component={ProfileScreen} />

        </>
      ) : (
        <>
          <Stack.Screen name={NAV_KEYS.ROLE_SELECT} component={RoleSelect} />
          <Stack.Screen name={NAV_KEYS.LOGIN} component={Login} />
          <Stack.Screen name={NAV_KEYS.REGISTER} component={Register} />
          <Stack.Screen name={NAV_KEYS.EmailVerification} component={EmailVerification} />

          <Stack.Screen
            name={NAV_KEYS.FORGOTPASSWORD}
            component={ForgotPassword}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
