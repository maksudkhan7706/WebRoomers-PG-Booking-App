export type RootStackParamList = {
  //Auth
  RoleSelect: undefined;
  Login: { role?: 'USER' | 'LANDLORD' };
  Register: undefined;
  ForgotPassword: undefined;

  //Main
  HomeScreen: undefined;
  BookingScreen: undefined;
  ProfileScreen: undefined;
  MainTabs: { role?: 'USER' | 'LANDLORD' };
};

export const NAV_KEYS = {
  // Auth Screens
  ROLE_SELECT: 'RoleSelect',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOTPASSWORD: 'ForgotPassword',
  // Main Screens / Bottom Tabs
  HomeScreen: 'HomeScreen',
  BookingScreen: 'BookingScreen',
  ProfileScreen: 'ProfileScreen',
  // Optional: If you use a bottom tab navigator name
  MAIN_TABS: 'MainTabs',
} as const;
