import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_KEYS } from './NavKeys';
import RoleSelect from '../screens/AuthScreen/RoleSelect';
import Login from '../screens/AuthScreen/Login';
import Register from '../screens/AuthScreen/Register';
import MainTabs from './MainTabs';
import ForgotPassword from '../screens/AuthScreen/ForgotPassword';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuth, setIsAuth] = React.useState(false);
  const [role, setRole] = React.useState<'USER' | 'LANDLORD'>('USER');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name={NAV_KEYS.MAIN_TABS}>
            {props => (
              <MainTabs
                {...props}
                route={{
                  ...props.route,
                  params: { role }, //pass role here
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name={NAV_KEYS.ROLE_SELECT} component={RoleSelect} />
            <Stack.Screen name={NAV_KEYS.LOGIN}>
              {props => (
                <Login
                  {...props}
                  route={{
                    ...props.route,
                    params: {
                      role,
                      ...(props.route.params || {}),
                    },
                  }}
                  setIsAuth={setIsAuth}
                  setRole={(role: string) => {
                    if (role === 'USER' || role === 'LANDLORD') {
                      setRole(role);
                    }
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name={NAV_KEYS.REGISTER} component={Register} />
            <Stack.Screen
              name={NAV_KEYS.FORGOTPASSWORD}
              component={ForgotPassword}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
