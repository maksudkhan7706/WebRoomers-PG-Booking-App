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
  changePaymentStatusUrl,
} from '../services/urlHelper';

interface MainState {
  loading: boolean;
  data: any;
  pgDetail: any;
  pgRooms: any;
  pgRoomDetail: any;
  apiUserData: any;
  error: string | null;
  myPgList: null;
  pgCategories: { label: string; value: string }[];
  pgCities: { label: string; value: string }[];
  pgCityLocation: { label: string; value: string }[];
  pgFloors: { label: string; value: string }[];
  pgFloorings: { label: string; value: string }[];
  pgWashrooms: { label: string; value: string }[];
  pgExtraFeatures: { label: string; value: string }[];
  allRoomFeatures: { label: string; value: string }[];
  pgEnquiries: [];
  landlordPaymentHistory: [];
  landlordEnquiryDetails: [];
  myBookings: [];
  landlordBankDetail: any;
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
};

//Dashboard API
export const fetchDashboardData = createAsyncThunk(
  'main/fetchDashboardData',
  async (payload: { company_id: string }, { rejectWithValue }) => {
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
            // 🧩 Case 2: value is single object
            else if (typeof value === 'object' && value?.uri) {
              formData.append(key, {
                uri: value.uri,
                name: value.fileName || value.name || `${key}.jpg`,
                type: value.type || 'image/jpeg',
              });
            }
          } else {
            formData.append(key, value);
          }
        }
      });

      console.log('🧾 Final Profile FormData (debug):');
      (formData as any)?._parts?.forEach((p: any) =>
        console.log(`${p[0]}:`, p[1]),
      );

      const res = await postRequest(updateProfileUrl(), formData, true);
      console.log('PROFILE UPDATE RESPONSE =====>', res);
      return res;
    } catch (err: any) {
      console.log(
        'PROFILE UPDATE ERROR =====>',
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
    payload: { company_id: string; landlord_id: string },
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
      console.log('API response inside thunk:', response);
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
      const response = await postRequest(addEditPgRoomUrl(), payload);
      return response.data;
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
      console.log('📡 addEditPg Response:', response);
      return response.data;
    } catch (error: any) {
      console.log('❌ addEditPg API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch Landlord Enquiries API
export const fetchLandlordEnquiries = createAsyncThunk(
  'main/fetchLandlordEnquiries',
  async (
    payload: { company_id: string; landlord_id: string },
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
      console.log('📡 get LandlordBankDetail Response:', response);
      return response.data;
    } catch (error: any) {
      console.log('❌ get LandlordBankDetail API Error:', error);
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
      console.log('📡 payNow Response:', response);
      return response; //ab poora response return karega
    } catch (error: any) {
      console.log('❌ payNow API Error:', error);
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
      console.log('updateEnquiryStatus Response:', response);
      return response;
    } catch (error: any) {
      console.log('updateEnquiryStatus API Error:', error);
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
      console.log('updatePaymentStatus Response:', response);
      return response;
    } catch (error: any) {
      console.log('updatePaymentStatus API Error:', error);
      return rejectWithValue(error.response?.data || error.message);
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
      });
    builder
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
      });
  },
});

export default mainSlice.reducer;
