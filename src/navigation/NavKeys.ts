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
  ForgotPassword: { role?: 'user' | 'landlord' };
  //Main
  HomeScreen: undefined;
  PGEnquiryScreen: undefined;
  ProfileScreen: undefined;
  MainTabs: { role?: 'user' | 'landlord' };
  PGRoomListScreen: { propertyId: string; companyId: string };
  PGDetailScreen: { propertyId: string; companyId: string };
  PGRoomDetailScreen: {
    roomId: string;
    pgId: string;
    companyId: string;
  };
  PGBookScreen: {
    screenType: string;
    roomId: string;
    pgId: string;
    companyId: string;
  };
  LandlordAddPG: { type: 'addPG' | 'editPG'; propertyId?: string };
  PGRoomManagement: { roomId?: string };
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
  LandlordAddPG: 'LandlordAddPG',
  PGRoomManagement:'PGRoomManagement'
} as const;
