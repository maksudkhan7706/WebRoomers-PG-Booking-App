export type RootStackParamList = {
  //Auth
  RoleSelect: undefined;
  Login: { role?: 'USER' | 'LANDLORD' };
  Register: undefined;
  ForgotPassword: undefined;
  //Main
  HomeScreen: undefined;
  PGEnquiryScreen: undefined;
  ProfileScreen: undefined;
  MainTabs: { role?: 'USER' | 'LANDLORD' };
  PGDetailScreen: undefined;
  PGRoomListScreen: undefined;
  PGRoomDetailScreen: undefined;
  PGBookScreen: undefined;
};

export const NAV_KEYS = {
  // Auth Screens
  ROLE_SELECT: 'RoleSelect',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOTPASSWORD: 'ForgotPassword',
  // Main Screens / Bottom Tabs
  HomeScreen: 'HomeScreen',
  PGEnquiryScreen: 'PGEnquiryScreen',
  ProfileScreen: 'ProfileScreen',
  MAIN_TABS: 'MainTabs',
  PGDetailScreen: 'PGDetailScreen',
  PGRoomListScreen: 'PGRoomListScreen',
  PGRoomDetailScreen: 'PGRoomDetailScreen',
  PGBookScreen: 'PGBookScreen',
} as const;
