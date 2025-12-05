export const baseUrl = 'https://main.webroomer.com/Api/v1';
export const authKey =
  '1c3b8f2f1e4d6a9b8d5f7a6c9b2e3d4f1a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyBZrmzANmT_V2heVloY7S7ASKniWrLAtQs';
export const GEOCODING_MAP_KEY = 'AIzaSyCvB3RR_NNxUq71sdm7oBL9YPkVB0ZImN8';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.webroomerpgbookingapp';

export const loginUrl = () => '/login';
export const registerUrl = () => '/register';
export const sendOtpUrl = () => '/sendOtp';
export const reSendOtpUrl = () => '/reSendOtp';
export const forgotPasswordpUrl = () => '/forgotPassword';
// main api url
export const dashboardUrl = () => '/dashboard';
export const pgDetailUrl = (pg_id: string, company_id: string) =>
  `/pgDetails?pg_id=${pg_id}&company_id=${company_id}`;
export const pgRoomsUrl = (pg_id: string, company_id: string) =>
  `/getPgRooms?pg_id=${pg_id}&company_id=${company_id}`;
export const pgRoomDetailUrl = () => '/getPgRoomDetails';
export const userInfoUrl = () => `/userInfo`;
export const roomBookingUrl = () => `/roomBooking`;
export const updateProfileUrl = () => `/updateProfile`;
export const myPgListUrl = () => `/myPgList`;
//Landlord ADD/EDIT PG DROPDOWN
export const getAllCategoriesUrl = () => '/getAllCategories';

export const getBankDetailsUrl = () => '/getBankDetails';
export const addEditBankDetailsUrl = () => '/addEditBankDetails';
export const deleteBankDetailUrl = () => '/deleteBankDetail';
export const getAllCitiesUrl = () => '/getAllCities';
export const getAllFloorsUrl = () => '/getAllFloors';
export const getAllFlooringsUrl = () => '/getAllFloorings';
export const getAllWashroomUrl = () => '/getAllWashroom';
export const getAllFeaturesUrl = () => '/getAllFeatures';
export const getAllRoomFeaturesUrl = () => '/getAllRoomFeatures';
export const getAllCityLocationUrl = () => '/getAllCityLocation';
export const postEnquiry = () => '/postEnquiry';
export const addEditPgRoomUrl = () => '/addEditPgRoom';
export const deletePgRoomUrl = () => '/deleteRoom';
export const addEditPgUrl = () => '/addEditPg';
export const getLandlordEnquiriesUrl = () => '/myEnquiries';
export const getLandlordPaymentHistoryUrl = () => '/getPaymentHistory';
export const landlordEnquiryDetailUrl = () => '/enquiryDetail';
export const getMyBookingUrl = () => '/myBookings';
export const getLandlordBankDetailUrl = () => '/getLandlordBankDetail';
export const payNowUrl = () => '/payNow';
export const updateEnquiryStatusUrl = () => '/updateEnquiryStatus';
export const activeInactiveStatusUrl = () => '/activeInactiveStatus';
export const changePaymentStatusUrl = () => '/changePaymentStatus';
export const renewalUsersUrl = () => '/renewalUsers';
export const getComplaintsUrl = () => '/getComplaints';
export const getComplaintPurposesUrl = () => '/getComplaintPurposes';
export const submitComplaintUrl = () => '/submitComplaint';
export const changePasswordUrl = () => '/changePassword';
export const getLandlordPropertiesurl = () => '/getLandlordProperties';
export const updateComplaintStatusUrl = () => '/updateComplaintStatus';
export const deleteComplaintUrl = () => '/deleteComplaint';
export const getSettingsUrl = () => '/settings';
export const getLandlordSubUserUrl = () => '/getLandlordSubUser';
export const deleteUserUrl = () => '/deleteUser';
export const addEditSubUserUrl = () => '/addEditSubUser';

export const getAllPermissionsUrl = () => '/getAllPermissions';
export const pgTermsConditionUrl = () => `/pgTermsCondition`;
export const getUsersUrl = () => '/getUsers';
export const addUserUrl = () => '/addUser';
export const checkoutUrl = () => '/checkout';
export const updateCheckoutStatusUrl = () => '/updateCheckoutStatus';
