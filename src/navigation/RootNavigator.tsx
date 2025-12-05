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
import EmailVerification from '../screens/AuthScreen/EmailVerification';
import UserBookingDetailScreen from '../screens/MainScreen/ROLEUSER/UserBookingDetailScreen';
import UserPaymentScreen from '../screens/MainScreen/ROLEUSER/UserPaymentScreen';
import UserPGBookScreen from '../screens/MainScreen/ROLEUSER/UserPGBookScreen';
import LandlordViewEnquiryDetails from '../screens/MainScreen/ROLELANDLORD/LandlordViewEnquiryDetails';
import LandlordPaymentHistory from '../screens/MainScreen/ROLELANDLORD/LandlordPaymentHistory';
import LandlordAddPG from '../screens/MainScreen/ROLELANDLORD/LandlordAddPG';
import PGRoomManagement from '../screens/MainScreen/ROLELANDLORD/PGRoomManagement';
import ProfileScreen from '../screens/MainScreen/COMMON/ProfileScreen';
import PGDetailScreen from '../screens/MainScreen/COMMON/PGDetailScreen';
import PGRoomListScreen from '../screens/MainScreen/COMMON/PGRoomListScreen';
import PGRoomDetailScreen from '../screens/MainScreen/COMMON/PGRoomDetailScreen';
import UserComplaintScreen from '../screens/MainScreen/ROLEUSER/UserComplaintScreen';
import UserPaymentDetailScreen from '../screens/MainScreen/ROLEUSER/UserPaymentDetailScreen';
import LandlordComplaintScreen from '../screens/MainScreen/ROLELANDLORD/LandlordComplaintScreen';
import ChangePasswordScreen from '../screens/MainScreen/COMMON/ChangePasswordScreen';
import PrivacyPolicyScreen from '../screens/MainScreen/COMMON/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/MainScreen/COMMON/TermsConditionsScreen';
import SubUserScreen from '../screens/MainScreen/ROLELANDLORD/SubUserScreen';
import AddEditSubUserScreen from '../screens/MainScreen/ROLELANDLORD/AddEditSubUserScreen';
import TenantsScreen from '../screens/MainScreen/ROLELANDLORD/TenantsScreen';
import AddNewTenantScreen from '../screens/MainScreen/ROLELANDLORD/AddNewTenantScreen';
import PGTermsConditionScreen from '../screens/MainScreen/COMMON/PGTermsConditionScreen';
import LandlordBankDetailScreen from '../screens/MainScreen/ROLELANDLORD/LandlordBankDetailScreen';
import LandlordEnquiryScreen from '../screens/MainScreen/ROLELANDLORD/LandlordEnquiryScreen';
import UserEnquiryScreen from '../screens/MainScreen/ROLEUSER/UserEnquiryScreen';
import LandlordTenantsPaymentScreen from '../screens/MainScreen/ROLELANDLORD/LandlordTenantsPaymentScreen';

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
          <Stack.Screen
            name={NAV_KEYS.UserPGBookScreen}
            component={UserPGBookScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.ProfileScreen}
            component={ProfileScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.LandlordAddPG}
            component={LandlordAddPG}
          />
          <Stack.Screen
            name={NAV_KEYS.PGRoomManagement}
            component={PGRoomManagement}
          />
          <Stack.Screen
            name={NAV_KEYS.LandlordPaymentHistory}
            component={LandlordPaymentHistory}
          />
          <Stack.Screen
            name={NAV_KEYS.LandlordViewEnquiryDetails}
            component={LandlordViewEnquiryDetails}
          />
          <Stack.Screen
            name={NAV_KEYS.UserBookingDetailScreen}
            component={UserBookingDetailScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.UserPaymentScreen}
            component={UserPaymentScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.UserComplaintScreen}
            component={UserComplaintScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.UserPaymentDetailScreen}
            component={UserPaymentDetailScreen}
          />

          <Stack.Screen
            name={NAV_KEYS.LandlordComplaintScreen}
            component={LandlordComplaintScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.ChangePasswordScreen}
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.PrivacyPolicyScreen}
            component={PrivacyPolicyScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.TermsConditionsScreen}
            component={TermsConditionsScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.SubUserScreen}
            component={SubUserScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.AddEditSubUserScreen}
            component={AddEditSubUserScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.TenantsScreen}
            component={TenantsScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.AddNewTenantScreen}
            component={AddNewTenantScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.PGTermsConditionScreen}
            component={PGTermsConditionScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.LandlordBankDetailScreen}
            component={LandlordBankDetailScreen}
          />

          <Stack.Screen
            name={NAV_KEYS.LandlordEnquiryScreen}
            component={LandlordEnquiryScreen}
          />

          <Stack.Screen
            name={NAV_KEYS.UserEnquiryScreen}
            component={UserEnquiryScreen}
          />
          <Stack.Screen
            name={NAV_KEYS.LandlordTenantsPaymentScreen}
            component={LandlordTenantsPaymentScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name={NAV_KEYS.ROLE_SELECT} component={RoleSelect} />
          <Stack.Screen name={NAV_KEYS.LOGIN} component={Login} />
          <Stack.Screen name={NAV_KEYS.REGISTER} component={Register} />
          <Stack.Screen
            name={NAV_KEYS.EmailVerification}
            component={EmailVerification}
          />

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
