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
  LandlordEnquiryScreen: undefined;
  UserMyBookingScreen: undefined;
  ProfileScreen: undefined;
  MainTabs: { role?: 'user' | 'landlord'; screen?: string };
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
  LandlordAddPG: { type: 'addPG' | 'editPG'; propertyData?: any };
  PGRoomManagement: { roomId?: string; companyId: string };
  LandlordPaymentHistory: { EnquiryId?: string; companyId: string };
  LandlordViewEnquiryDetails: { EnquiryId?: string; companyId: string };
  UserBookingDetailScreen: { BookingData?: string };
  UserPaymentScreen: {
    LandlordId?: string;
    Amount?: string;
    EnquiryId?: string;
  };
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
  LandlordEnquiryScreen: 'LandlordEnquiryScreen',
  UserMyBookingScreen: 'UserMyBookingScreen',
  ProfileScreen: 'ProfileScreen',
  MAIN_TABS: 'MainTabs',
  PGDetailScreen: 'PGDetailScreen',
  PGRoomListScreen: 'PGRoomListScreen',
  PGRoomDetailScreen: 'PGRoomDetailScreen',
  PGBookScreen: 'PGBookScreen',
  LandlordAddPG: 'LandlordAddPG',
  PGRoomManagement: 'PGRoomManagement',
  LandlordPaymentHistory: 'LandlordPaymentHistory',
  LandlordViewEnquiryDetails: 'LandlordViewEnquiryDetails',
  UserBookingDetailScreen: 'UserBookingDetailScreen',
  UserPaymentScreen: 'UserPaymentScreen',
} as const;
