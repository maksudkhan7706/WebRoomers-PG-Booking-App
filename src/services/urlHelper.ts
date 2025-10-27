export const baseUrl = 'https://main.webroomer.com/Api/v1';
export const authKey =
  '1c3b8f2f1e4d6a9b8d5f7a6c9b2e3d4f1a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d';

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
export const getAllCitiesUrl = () => '/getAllCities';
export const getAllFloorsUrl = () => '/getAllFloors';
export const getAllFlooringsUrl = () => '/getAllFloorings';
export const getAllWashroomUrl = () => '/getAllWashroom';
export const getAllFeaturesUrl = () => '/getAllFeatures';


export const postEnquiry = () => '/postEnquiry';