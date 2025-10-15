export type RootStackParamList = {
  //Auth
  RoleSelect: undefined;
  Login: { role?: 'user' | 'landlord' };
  Register: { role?: 'user' | 'landlord' };
  EmailVerification: {
    email: string;
    otp: string;
    role?: 'user' | 'landlord';
    mobile_number: string;
    full_name: string;
  };
  ForgotPassword: undefined;
  //Main
  HomeScreen: undefined;
  PGEnquiryScreen: undefined;
  ProfileScreen: undefined;
  MainTabs: { role?: 'user' | 'landlord' };
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
  EmailVerification: 'EmailVerification',
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
