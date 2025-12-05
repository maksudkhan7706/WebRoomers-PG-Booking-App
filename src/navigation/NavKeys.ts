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
  UserPaymentDetailScreen: { EnquiryId?: string; companyId?: string };
  UserPGBookScreen: {
    screenType: string;
    roomId: string;
    pgId: string;
    companyId: string;
    genderType?: string;
  };
  UserPaymentScreen: {
    LandlordId?: string;
    PgId?: string;
    Amount?: string;
    EnquiryId?: string;
    PaymentStartDate?: Date;
    PaymentStartEnd?: Date;
    SecurityCharges: any;
    MaintainanceCharges: any;
    RoomRent: any;
    LandlordName?: string;
    LandlordEmail?: string;
    LandlordMobile?: string;
  };

  //Landlord
  LandlordAddPG: { type: 'addPG' | 'editPG'; propertyData?: any };
  LandlordComplaintScreen: undefined;
  LandlordEnquiryScreen: undefined;
  LandlordMyPGScreen: undefined;
  PGRoomManagement: { roomId?: string; companyId: string };
  LandlordPaymentHistory: { EnquiryId?: string; companyId: string };
  LandlordViewEnquiryDetails: { EnquiryId?: string; companyId: string };
  LandlordRenewalScreen: undefined;
  SubUserScreen: undefined;
  AddEditSubUserScreen: { subUserData?: any };
  TenantsScreen: undefined;
  AddNewTenantScreen: undefined;
  LandlordBankDetailScreen: undefined;
  LandlordTenantsPaymentScreen: { tenantData?: any };
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
  PGTermsConditionScreen: { pgId: string; companyId: string; isLandlord?: boolean };
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
  UserPaymentDetailScreen: 'UserPaymentDetailScreen',
  UserPGBookScreen: 'UserPGBookScreen',
  UserPaymentScreen: 'UserPaymentScreen',

  //Landlord
  LandlordAddPG: 'LandlordAddPG',
  LandlordComplaintScreen: 'LandlordComplaintScreen',
  LandlordEnquiryScreen: 'LandlordEnquiryScreen',
  LandlordMyPGScreen: 'LandlordMyPGScreen',
  PGRoomManagement: 'PGRoomManagement',
  LandlordPaymentHistory: 'LandlordPaymentHistory',
  LandlordViewEnquiryDetails: 'LandlordViewEnquiryDetails',
  LandlordRenewalScreen: 'LandlordRenewalScreen',
  SubUserScreen: 'SubUserScreen',
  AddEditSubUserScreen: 'AddEditSubUserScreen',
  TenantsScreen: 'TenantsScreen',
  AddNewTenantScreen: 'AddNewTenantScreen',
  LandlordBankDetailScreen: 'LandlordBankDetailScreen',
  LandlordTenantsPaymentScreen: 'LandlordTenantsPaymentScreen',
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
  PGTermsConditionScreen: 'PGTermsConditionScreen',
} as const;
