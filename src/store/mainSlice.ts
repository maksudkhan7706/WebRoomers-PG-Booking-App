import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequest } from '../services/apiService';
import {
  dashboardUrl,
  pgDetailUrl,
  pgRoomsUrl,
  pgRoomDetailUrl,
  userInfoUrl,
  roomBookingUrl,
  updateProfileUrl,
  myPgListUrl,
  getAllCategoriesUrl,
  getAllCitiesUrl,
  getAllFloorsUrl,
  getAllFlooringsUrl,
  getAllWashroomUrl,
  getAllFeaturesUrl,
  postEnquiry,
  addEditPgRoomUrl,
  getAllRoomFeaturesUrl,
  deletePgRoomUrl,
  addEditPgUrl,
  getAllCityLocationUrl,
  getLandlordEnquiriesUrl,
  getLandlordPaymentHistoryUrl,
  getMyBookingUrl,
  getLandlordBankDetailUrl,
  payNowUrl,
  landlordEnquiryDetailUrl,
  updateEnquiryStatusUrl,
  activeInactiveStatusUrl,
  changePaymentStatusUrl,
  renewalUsersUrl,
  getComplaintsUrl,
  getComplaintPurposesUrl,
  submitComplaintUrl,
  changePasswordUrl,
  getLandlordPropertiesurl,
  updateComplaintStatusUrl,
  deleteComplaintUrl,
  getSettingsUrl,
  getLandlordSubUserUrl,
  deleteUserUrl,
  addEditSubUserUrl,
  getAllPermissionsUrl,
  pgTermsConditionUrl,
  getUsersUrl,
  addUserUrl,
  getBankDetailsUrl,
  addEditBankDetailsUrl,
  deleteBankDetailUrl,
  checkoutUrl,
  updateCheckoutStatusUrl,
} from '../services/urlHelper';
import { appLog } from '../utils/appLog';

interface MainState {
  loading: boolean;
  data: any;
  pgDetail: any;
  pgRooms: any;
  pgRoomDetail: any;
  apiUserData: any;
  error: string | null;
  myPgList: null;
  pgListSimple: { property_id: string; title: string }[];
  pgCategories: { label: string; value: string }[];
  pgCities: { label: string; value: string }[];
  pgCityLocation: { label: string; value: string }[];
  pgFloors: { label: string; value: string }[];
  pgFloorings: { label: string; value: string }[];
  pgWashrooms: { label: string; value: string }[];
  pgExtraFeatures: { label: string; value: string }[];
  allRoomFeatures: { label: string; value: string }[];
  complaintPurposes: { label: string; value: string }[];
  landlordProperties: { label: string; value: string }[];

  pgEnquiries: any[];
  landlordPaymentHistory: any[];
  landlordEnquiryDetails: any[];
  myBookings: any[];
  landlordBankDetail: any;
  bankDetails: any[];
  landlordRenewalUsers: any[];
  usersComplaintList: any[];
  settingsData: any | null;
  pgTermsConditionData: any | null;
  subUserList: any[];
  userAllPermissions: any[];
  tenantList: any[];
}

const initialState: MainState = {
  loading: false,
  data: null,
  pgDetail: null,
  pgRooms: null,
  pgRoomDetail: null,
  apiUserData: null,
  error: null,
  myPgList: null,
  pgListSimple: [],
  pgCategories: [],
  pgCities: [],
  pgCityLocation: [],
  pgFloors: [],
  pgFloorings: [],
  pgWashrooms: [],
  pgExtraFeatures: [],
  allRoomFeatures: [],
  pgEnquiries: [],
  landlordPaymentHistory: [],
  landlordEnquiryDetails: [],
  myBookings: [],
  landlordBankDetail: null,
  bankDetails: [],
  landlordRenewalUsers: [],
  usersComplaintList: [],
  complaintPurposes: [],
  landlordProperties: [],
  settingsData: null,
  pgTermsConditionData: null,
  subUserList: [],
  userAllPermissions: [],
  tenantList: [],
};

//Dashboard API
export const fetchDashboardData = createAsyncThunk(
  'main/fetchDashboardData',
  async (
    payload: { company_id: string; user_id?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(dashboardUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Detail API
export const fetchPGDetailData = createAsyncThunk(
  'main/fetchPGDetailData',
  async (
    payload: { pg_id: string; company_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(
        pgDetailUrl(payload.pg_id, payload.company_id),
        payload,
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//PG Rooms API
export const fetchPgRooms = createAsyncThunk(
  'main/fetchPgRooms',
  async (
    payload: { pg_id: string; company_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(
        pgRoomsUrl(payload.pg_id, payload.company_id),
        payload,
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//PG Room Detail API
export const fetchPgRoomDetail = createAsyncThunk(
  'main/fetchPgRoomDetail',
  async (
    payload: { room_id: string; pg_id: string; company_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(pgRoomDetailUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// User Info API
export const apiUserDataFetch = createAsyncThunk(
  'main/apiUserDataFetch',
  async (
    payload: { user_id: string; company_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(userInfoUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//Room Booking API
export const bookRoomApi = createAsyncThunk(
  'main/bookRoomApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await postRequest(roomBookingUrl(), payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
// Profile Update API
export const updateProfileApi = createAsyncThunk(
  'main/updateProfileApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(payload).forEach(key => {
        const value = payload[key];

        if (value !== null && value !== undefined) {
          // ✅ Check if it's an image field
          if (
            key === 'profile_image' ||
            key === 'profile_photo' ||
            key === 'aadhar_front' ||
            key === 'aadhar_back' ||
            key === 'police_verification' ||
            key === 'qr_code'
          ) {
            // 🧩 Case 1: value is array (from your Image Picker)
            if (Array.isArray(value) && value.length > 0) {
              const file = value[0]; // pick first item
              formData.append(key, {
                uri: file.uri,
                name: file.fileName || file.name || `${key}.jpg`,
                type: file.type || 'image/jpeg',
              });
            }
            // 🧩 Case 2: value is single object (new file)
            else if (typeof value === 'object' && value?.uri) {
              formData.append(key, {
                uri: value.uri,
                name: value.fileName || value.name || `${key}.jpg`,
                type: value.type || 'image/jpeg',
              });
            }
            // 🧩 Case 3: value is string URL (existing photo - preserve it)
            else if (typeof value === 'string' && value.trim() !== '') {
              formData.append(key, value);
            }
          } else {
            formData.append(key, value);
          }
        }
      });

      (formData as any)?._parts?.forEach((p: any) => appLog(`${p[0]}:`, p[1]));

      const res = await postRequest(updateProfileUrl(), formData, true);
      return res;
    } catch (err: any) {
      appLog(
        'updateProfileApi',
        'PROFILE UPDATE ERROR',
        err.response?.data || err.message,
      );
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// My PG List API
export const fetchMyPgList = createAsyncThunk(
  'main/fetchMyPgList',
  async (
    payload: {
      company_id: string;
      landlord_id: string;
      user_type: string;
      property_id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(myPgListUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchBankDetails = createAsyncThunk(
  'main/fetchBankDetails',
  async (
    payload: {
      company_id: string;
      user_id: string;
      pg_id?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(getBankDetailsUrl(), payload);
      return response?.data || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const addEditBankDetails = createAsyncThunk(
  'main/addEditBankDetails',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        addEditBankDetailsUrl(),
        payload,
        true,
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteBankDetail = createAsyncThunk(
  'main/deleteBankDetail',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(deleteBankDetailUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Categories
export const fetchPgCategories = createAsyncThunk(
  'main/fetchPgCategories',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllCategoriesUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Cities
export const fetchPgCities = createAsyncThunk(
  'main/fetchPgCities',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllCitiesUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG City Location
export const fetchPgCityLocation = createAsyncThunk(
  'main/fetchPgCityLocation',
  async (payload: { city_id: any }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllCityLocationUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Floors
export const fetchPgFloors = createAsyncThunk(
  'main/fetchPgFloors',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllFloorsUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Floorings
export const fetchPgFloorings = createAsyncThunk(
  'main/fetchPgFloorings',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllFlooringsUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Washrooms
export const fetchPgWashrooms = createAsyncThunk(
  'main/fetchPgWashrooms',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllWashroomUrl(), payload);
      return response.data; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// PG Extra Features
export const fetchPgExtraFeatures = createAsyncThunk(
  'main/fetchPgExtraFeatures',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllFeaturesUrl(), payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// All Room Features
export const fetchAllRoomFeatures = createAsyncThunk(
  'main/fetchAllRoomFeatures',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllRoomFeaturesUrl(), payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//Enquiry submit thunk
export const submitPgEnquiry = createAsyncThunk(
  'main/submitPgEnquiry',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(postEnquiry(), payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);
//Add / Edit PG Room
export const addEditPgRoom = createAsyncThunk(
  'main/addEditPgRoom',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(addEditPgRoomUrl(), payload, true);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 🧱 Delete Room API
export const deletePgRoom = createAsyncThunk(
  'main/deletePgRoom',
  async (
    payload: { room_id: string | number; company_id: string | number },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(deletePgRoomUrl(), payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

//Add / Edit PG API
export const addEditPg = createAsyncThunk(
  'main/addEditPg',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(addEditPgUrl(), payload, true); // ✅ true = multipart
      return response;
    } catch (error: any) {
      appLog('addEditPg', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch Landlord Enquiries API
export const fetchLandlordEnquiries = createAsyncThunk(
  'main/fetchLandlordEnquiries',
  async (
    payload: {
      company_id: string;
      landlord_id: string;
      user_type: string;
      property_id: string;
      active_status: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(getLandlordEnquiriesUrl(), payload);
      return response?.data || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// Fetch Landlord Payment History API
export const fetchLandlordPaymentHistory = createAsyncThunk(
  'main/fetchLandlordPaymentHistory',
  async (
    payload: { company_id: string; enquiry_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(
        getLandlordPaymentHistoryUrl(),
        payload,
      );
      return response?.data || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// Fetch Landlord Enquiry Details API
export const fetchLandlordEnquiryDetails = createAsyncThunk(
  'main/fetchLandlordEnquiryDetails',
  async (
    payload: { company_id: string; enquiry_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(landlordEnquiryDetailUrl(), payload);
      return response?.data || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// Fetch User My Bookings API
export const fetchUserMyBooking = createAsyncThunk(
  'main/fetchUserMyBooking',
  async (
    payload: { company_id: string; user_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(getMyBookingUrl(), payload);
      return response?.data || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//Landlord Bank Detail API
export const fetchLandlordBankDetail = createAsyncThunk(
  'main/fetchLandlordBankDetail',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(getLandlordBankDetailUrl(), payload);
      return response.data;
    } catch (error: any) {
      appLog('fetchLandlordBankDetail', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
// Payment API
export const payNow = createAsyncThunk(
  'main/payNow',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(payNowUrl(), payload, true);
      return response; //ab poora response return karega
    } catch (error: any) {
      appLog('payNow', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update Enquiry Status API
export const updateEnquiryStatus = createAsyncThunk(
  'main/updateEnquiryStatus',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(updateEnquiryStatusUrl(), payload);
      return response;
    } catch (error: any) {
      appLog('updateEnquiryStatus', 'API Error', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Active/Inactive Status API
export const activeInactiveStatus = createAsyncThunk(
  'main/activeInactiveStatus',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(activeInactiveStatusUrl(), payload);
      return response;
    } catch (error: any) {
      appLog('activeInactiveStatus', 'API Error', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update Payment Status API
export const updatePaymentStatus = createAsyncThunk(
  'main/updatePaymentStatus',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(changePaymentStatusUrl(), payload);
      return response;
    } catch (error: any) {
      appLog('updatePaymentStatus', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

//Landlord Renewal Users API
export const fetchRenewalUsersDetail = createAsyncThunk(
  'main/fetchRenewalUsersDetail',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(renewalUsersUrl(), payload);
      return response.data;
    } catch (error: any) {
      appLog('fetchRenewalUsersDetail', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

//User Complaint List  API
export const fetchUsersComplaintList = createAsyncThunk(
  'main/fetchUsersComplaintList',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(getComplaintsUrl(), payload);
      return response.data;
    } catch (error: any) {
      appLog('fetchUsersComplaintList', 'API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// get Complaint Purposes Api
export const fetchComplaintPurposes = createAsyncThunk(
  'main/fetchComplaintPurposes',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getComplaintPurposesUrl(), payload);
      appLog('mainSlice', 'fetchComplaintPurposes Response', response);
      return response; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//  Submit Complaint API
export const submitUserComplaint = createAsyncThunk(
  'main/submitUserComplaint',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(submitComplaintUrl(), payload, true); // <- multipart = true
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Change Password Api
export const updateChangePassword = createAsyncThunk(
  'main/updateChangePassword',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(changePasswordUrl(), payload);
      appLog('mainSlice', 'updateChangePassword Response', response);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Landlord Property List Api
export const fetchLandlordProperty = createAsyncThunk(
  'main/fetchLandlordProperty',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(getLandlordPropertiesurl(), payload);
      appLog('mainSlice', 'fetchLandlordProperty Response', response);
      return response; //"data" return
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//  Update Status Complaint API
export const updateComplaintStatus = createAsyncThunk(
  'main/updateComplaintStatus',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        updateComplaintStatusUrl(),
        payload,
        true,
      ); // <- multipart = true
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//Delete Complaint API
export const deleteComplaint = createAsyncThunk(
  'main/deleteComplaint',
  async (
    payload: { company_id: string; complaint_id: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await postRequest(deleteComplaintUrl(), payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Delete complaint failed');
    }
  },
);

// Terms and Conditions Privacy Policy API
export const getSettings = createAsyncThunk(
  'main/getSettings',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const res = await postRequest(getSettingsUrl(), payload);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch settings');
    }
  },
);

// PG Terms and Conditions API
export const fetchPGTermsCondition = createAsyncThunk(
  'main/fetchPGTermsCondition',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await postRequest(pgTermsConditionUrl(), payload);
      return response || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//fetch Landlord Sub-user APi
export const fetchLandlordSubUser = createAsyncThunk(
  'main/fetchLandlordSubUser',
  async (
    payload: {
      company_id: string;
      landlord_id: string;
      user_type: string;
      property_id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(getLandlordSubUserUrl(), payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

//Delete User Api
export const deleteSubUser = createAsyncThunk(
  'main/deleteSubUser',
  async (
    payload: { user_id: string; company_id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(deleteUserUrl(), payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

// Add/Edit Sub User API
export const addEditSubUser = createAsyncThunk(
  'main/addEditSubUser',
  async (
    payload: {
      sub_user_id?: number | null;
      company_id: string;
      landlord_id: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      assigned_pg_id: string;
      password?: string;
      status: string;
      permissions?: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(addEditSubUserUrl(), payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

// User All Permissions API
export const fetchAllUserPermissions = createAsyncThunk(
  'main/fetchAllUserPermissions',
  async (payload: { company_id: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(getAllPermissionsUrl(), payload);
      return response?.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Fetch Tenants API
export const fetchTenants = createAsyncThunk(
  'main/fetchTenants',
  async (
    payload: {
      user_id: string;
      user_type: string;
      company_id: string;
      property_id?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(getUsersUrl(), payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

// Add Tenant API
export const addTenant = createAsyncThunk(
  'main/addTenant',
  async (
    payload: {
      fullname: string;
      email: string;
      mobile: string;
      gender: string;
      password: string;
      pg_id: string;
      message: string;
      check_in_date: string;
      check_out_date: string;
      company_id: string;
      landlord_id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(addUserUrl(), payload);
      appLog('addTenant', 'API response:', response);
      return response;
    } catch (error: any) {
      appLog('addTenant', 'API Error:', error);
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

// Checkout API
export const submitCheckout = createAsyncThunk(
  'main/submitCheckout',
  async (
    payload: {
      user_id: string;
      checkout_date: string;
      company_id: string;
      property_enquiry_id: string;
      lockin_period: string | number;
      checkout_reason: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(checkoutUrl(), payload);
      appLog('submitCheckout', 'API response:', response);
      return response;
    } catch (error: any) {
      appLog('submitCheckout', 'API Error:', error);
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

// Update Checkout Status API (Accept / Reject by landlord)
export const updateCheckoutStatusApi = createAsyncThunk(
  'main/updateCheckoutStatusApi',
  async (
    payload: {
      company_id: string;
      checkout_id: string;
      status: 'approved' | 'rejected';
      reject_reason?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(updateCheckoutStatusUrl(), payload);
      appLog('updateCheckoutStatusApi', 'API response:', response);
      return response;
    } catch (error: any) {
      appLog('updateCheckoutStatusApi', 'API Error:', error);
      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Dashboard
      .addCase(fetchDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Detail
      .addCase(fetchPGDetailData.pending, state => {
        state.loading = true;
        state.error = null;
        state.pgDetail = null;
      })
      .addCase(fetchPGDetailData.fulfilled, (state, action) => {
        state.loading = false;
        state.pgDetail = action.payload;
      })
      .addCase(fetchPGDetailData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Rooms
      .addCase(fetchPgRooms.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.pgRooms = action.payload;
      })
      .addCase(fetchPgRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Room Detail
      .addCase(fetchPgRoomDetail.pending, state => {
        state.loading = true;
        state.error = null;
        state.pgRoomDetail = null;
      })
      .addCase(fetchPgRoomDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.pgRoomDetail = action.payload;
      })
      .addCase(fetchPgRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // User Info API
      .addCase(apiUserDataFetch.pending, state => {
        state.loading = true;
        state.error = null;
        state.apiUserData = null;
      })
      .addCase(apiUserDataFetch.fulfilled, (state, action) => {
        state.loading = false;
        state.apiUserData = action.payload;
      })
      .addCase(apiUserDataFetch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Room Booking API
      .addCase(bookRoomApi.pending, state => {
        state.loading = true;
      })
      .addCase(bookRoomApi.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(bookRoomApi.rejected, state => {
        state.loading = false;
      })
      //Update Profile
      .addCase(updateProfileApi.pending, state => {
        state.loading = true;
      })
      .addCase(updateProfileApi.fulfilled, (state, action) => {
        state.loading = false;
        state.apiUserData = action.payload;
      })
      .addCase(updateProfileApi.rejected, state => {
        state.loading = false;
      })
      // My PG List
      .addCase(fetchMyPgList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPgList.fulfilled, (state, action) => {
        state.loading = false;
        state.myPgList = action.payload;
        // Extract only property_id and title for pgListSimple
        if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.pgListSimple = action.payload.data.map((pg: any) => ({
            property_id: pg.property_id || '',
            title: pg.title || pg.property_title || '',
          }));
        } else if (action.payload?.data && typeof action.payload.data === 'object') {
          // Handle case where data is an object with keys
          const pgArray = Object.values(action.payload.data);
          state.pgListSimple = pgArray.map((pg: any) => ({
            property_id: pg.property_id || '',
            title: pg.title || pg.property_title || '',
          }));
        } else {
          state.pgListSimple = [];
        }
      })
      .addCase(fetchMyPgList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Categories
      .addCase(fetchPgCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgCategories.fulfilled, (state, action) => {
        state.loading = false;
        // object ko array me convert karenge
        state.pgCategories = Object.values(action.payload).map((item: any) => ({
          label: item.property_category_title,
          value: item.property_category_id,
        }));
      })
      .addCase(fetchPgCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Cities
      .addCase(fetchPgCities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgCities.fulfilled, (state, action) => {
        state.loading = false;
        state.pgCities = Object.values(action.payload).map((item: any) => ({
          ...item,
          label: item.city_name,
          value: item.city_id,
        }));
      })
      .addCase(fetchPgCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG City Location
      .addCase(fetchPgCityLocation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgCityLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.pgCityLocation = Object.values(action.payload).map(
          (item: any) => ({
            ...item,
            label: item.city_location_name,
            value: item.city_location_id,
          }),
        );
      })
      .addCase(fetchPgCityLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Floors
      .addCase(fetchPgFloors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.pgFloors = Object.values(action.payload).map((item: any) => ({
          label: item.property_floor_title,
          value: item.property_floor_id,
        }));
      })
      .addCase(fetchPgFloors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Floorings
      .addCase(fetchPgFloorings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgFloorings.fulfilled, (state, action) => {
        state.loading = false;
        state.pgFloorings = Object.values(action.payload).map((item: any) => ({
          label: item.property_flooring_title,
          value: item.property_flooring_id,
        }));
      })
      .addCase(fetchPgFloorings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Washrooms
      .addCase(fetchPgWashrooms.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgWashrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.pgWashrooms = Object.values(action.payload).map((item: any) => ({
          label: item.property_washroom_title,
          value: item.property_washroom_id,
        }));
      })
      .addCase(fetchPgWashrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // PG Extra Features
      .addCase(fetchPgExtraFeatures.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPgExtraFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.pgExtraFeatures = Object.values(action.payload).map(
          (item: any) => ({
            label: item.property_features_title,
            value: item.property_features_id,
          }),
        );
      })
      // All Room Features
      .addCase(fetchAllRoomFeatures.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoomFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.allRoomFeatures = Object.values(action.payload).map(
          (item: any) => ({
            ...item,
            label: item.name,
            value: item.id,
          }),
        );
      })
      .addCase(fetchAllRoomFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Post Enquiry
      .addCase(submitPgEnquiry.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitPgEnquiry.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(submitPgEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Add / Edit PG Room
      .addCase(addEditPgRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditPgRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addEditPgRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePgRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      //Delete Room
      .addCase(deletePgRoom.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove the deleted room from pgRooms.data
        if (state.pgRooms?.data) {
          state.pgRooms.data = state.pgRooms.data.filter(
            (room: any) => room.id !== action.meta.arg.room_id,
          );
        }
      })
      .addCase(deletePgRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Add / Edit PG API
      .addCase(addEditPg.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditPg.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addEditPg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Landlord Enquiries API
      .addCase(fetchLandlordEnquiries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.pgEnquiries = action.payload;
      })
      .addCase(fetchLandlordEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Landlord Payment History API
      .addCase(fetchLandlordPaymentHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordPaymentHistory = action.payload;
      })
      .addCase(fetchLandlordPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Landlord Enquiry Details API
      .addCase(fetchLandlordEnquiryDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordEnquiryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordEnquiryDetails = action.payload;
      })
      .addCase(fetchLandlordEnquiryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User My Bookings API
      .addCase(fetchUserMyBooking.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMyBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchUserMyBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Landlord Bank Detail API
      .addCase(fetchLandlordBankDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordBankDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordBankDetail = action.payload;
      })
      .addCase(fetchLandlordBankDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBankDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload || [];
      })
      .addCase(fetchBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addEditBankDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditBankDetails.fulfilled, state => {
        state.loading = false;
      })
      .addCase(addEditBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBankDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBankDetail.fulfilled, state => {
        state.loading = false;
      })
      .addCase(deleteBankDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Payment API
      .addCase(payNow.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payNow.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(payNow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Enquiry Status API
      .addCase(updateEnquiryStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEnquiryStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateEnquiryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Active/Inactive Status API
      .addCase(activeInactiveStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activeInactiveStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(activeInactiveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Payment Status API
      .addCase(updatePaymentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Landlord Renewal Users API
      .addCase(fetchRenewalUsersDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRenewalUsersDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordRenewalUsers = action.payload;
      })
      .addCase(fetchRenewalUsersDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //User Complaint List  API
      .addCase(fetchUsersComplaintList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersComplaintList.fulfilled, (state, action) => {
        state.loading = false;
        state.usersComplaintList = action.payload;
      })
      .addCase(fetchUsersComplaintList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // get Complaint Purposes Api
      .addCase(fetchComplaintPurposes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintPurposes.fulfilled, (state, action) => {
        state.loading = false;
        const purposesData = action.payload?.purposes || {}; // safe access
        state.complaintPurposes = Object.values(purposesData).map(
          (item: any) => ({
            label: item.purpose_name,
            value: item.purpose_id,
          }),
        );
      })
      .addCase(fetchComplaintPurposes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //  Submit Complaint API
      .addCase(submitUserComplaint.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitUserComplaint.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(submitUserComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change Password Api
      .addCase(updateChangePassword.pending, state => {
        state.loading = true;
      })
      .addCase(updateChangePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Landlord Property List Api
      .addCase(fetchLandlordProperty.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordProperty.fulfilled, (state, action) => {
        state.loading = false;
        const propertyData = action.payload?.data || []; // safe access
        state.landlordProperties = propertyData.map((item: any) => ({
          label: item.property_title,
          value: item.property_id,
        }));
      })
      .addCase(fetchLandlordProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //  Update Status Complaint API
      .addCase(updateComplaintStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Delete Complaint API
      .addCase(deleteComplaint.pending, state => {
        state.loading = true;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteComplaint.rejected, state => {
        state.loading = false;
      })
      // Terms and Conditions Privacy Policy API
      .addCase(getSettings.pending, state => {
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.settingsData = action.payload.data;
        }
      })
      .addCase(getSettings.rejected, state => {
        state.loading = false;
      })
      // PG Terms and Conditions  API
      .addCase(fetchPGTermsCondition.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPGTermsCondition.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.pgTermsConditionData = action.payload;
        }
      })
      .addCase(fetchPGTermsCondition.rejected, state => {
        state.loading = false;
      })

      //fetch Landlord Sub-user APi
      .addCase(fetchLandlordSubUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordSubUser.fulfilled, (state, action) => {
        state.loading = false;
        state.subUserList = action.payload?.data || [];
      })
      .addCase(fetchLandlordSubUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Delete User Api
      .addCase(deleteSubUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubUser.fulfilled, (state, action) => {
        // Remove the deleted user from list (for immediate UI update)
        const deletedId = action.meta.arg.user_id;
        state.subUserList = state.subUserList.filter(
          (item: any) => item.user_id !== deletedId,
        );
        state.loading = false;
      })
      .addCase(deleteSubUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add/Edit Sub User API
      .addCase(addEditSubUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditSubUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addEditSubUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // User All Permissions API
      .addCase(fetchAllUserPermissions.pending, state => {
        state.loading = true;
        state.error = null;
        state.userAllPermissions = [];
      })
      .addCase(fetchAllUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.userAllPermissions = action.payload;
      })
      .addCase(fetchAllUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Tenants API
      .addCase(fetchTenants.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        const users = action.payload?.data?.users || [];
        appLog('fetchTenants.fulfilled', 'Received data:', {
          payload: action.payload,
          users: users,
          usersCount: users.length,
        });
        state.tenantList = users;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Tenant API
      .addCase(addTenant.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Checkout API
      .addCase(submitCheckout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Checkout Status API
      .addCase(updateCheckoutStatusApi.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCheckoutStatusApi.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCheckoutStatusApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mainSlice.reducer;
