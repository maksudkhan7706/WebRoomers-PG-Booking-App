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
    registerPayload: any;
  };
  ForgotPassword: { role?: 'user' | 'landlord' };
  //User
  UserEnquiryScreen: undefined;
  UserMyBookingScreen: undefined;
  UserBookingDetailScreen: { BookingData?: string };
  UserComplaintScreen: undefined;
  UserPGBookScreen: {
    screenType: string;
    roomId: string;
    pgId: string;
    companyId: string;
    genderType?: string;
  };
  UserPaymentScreen: {
    LandlordId?: string;
    Amount?: string;
    EnquiryId?: string;
    PaymentStartDate?: Date;
    PaymentStartEnd?: Date;
  };

  //Landlord
  LandlordAddPG: { type: 'addPG' | 'editPG'; propertyData?: any };
  LandlordComplaintScreen: undefined;
  LandlordEnquiryScreen: undefined;
  PGRoomManagement: { roomId?: string; companyId: string };
  LandlordPaymentHistory: { EnquiryId?: string; companyId: string };
  LandlordViewEnquiryDetails: { EnquiryId?: string; companyId: string };
  LandlordRenewalScreen: undefined;

  //Common
  MainTabs: { role?: 'user' | 'landlord'; screen?: string };
  HomeScreen: undefined;
  ProfileScreen: undefined;
  PGRoomListScreen: { propertyId: string; companyId: string };
  PGDetailScreen: { propertyId: string; companyId: string };
  PGRoomDetailScreen: {
    roomId: string;
    pgId: string;
    companyId: string;
  };
  ChangePasswordScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsConditionsScreen: undefined;
};

export const NAV_KEYS = {
  //Auth
  ROLE_SELECT: 'RoleSelect',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOTPASSWORD: 'ForgotPassword',
  EmailVerification: 'EmailVerification',

  //User
  UserEnquiryScreen: 'UserEnquiryScreen',
  UserMyBookingScreen: 'UserMyBookingScreen',
  UserBookingDetailScreen: 'UserBookingDetailScreen',
  UserComplaintScreen: 'UserComplaintScreen',
  UserPGBookScreen: 'UserPGBookScreen',
  UserPaymentScreen: 'UserPaymentScreen',

  //Landlord
  LandlordAddPG: 'LandlordAddPG',
  LandlordComplaintScreen: 'LandlordComplaintScreen',
  LandlordEnquiryScreen: 'LandlordEnquiryScreen',
  PGRoomManagement: 'PGRoomManagement',
  LandlordPaymentHistory: 'LandlordPaymentHistory',
  LandlordViewEnquiryDetails: 'LandlordViewEnquiryDetails',
  LandlordRenewalScreen: 'LandlordRenewalScreen',

  //Common
  MAIN_TABS: 'MainTabs',
  HomeScreen: 'HomeScreen',
  ProfileScreen: 'ProfileScreen',
  PGRoomListScreen: 'PGRoomListScreen',
  PGDetailScreen: 'PGDetailScreen',
  PGRoomDetailScreen: 'PGRoomDetailScreen',
  ChangePasswordScreen: 'ChangePasswordScreen',
  PrivacyPolicyScreen: 'PrivacyPolicyScreen',
  TermsConditionsScreen: 'TermsConditionsScreen',
} as const;
