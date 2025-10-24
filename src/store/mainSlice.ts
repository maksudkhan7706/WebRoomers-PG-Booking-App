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
  pgFloors: { label: string; value: string }[];
  pgFloorings: { label: string; value: string }[];
  pgWashrooms: { label: string; value: string }[];
  pgExtraFeatures: { label: string; value: string }[];
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
  pgFloors: [],
  pgFloorings: [],
  pgWashrooms: [],
  pgExtraFeatures: [],
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
      console.log('formData =======>>>>', formData);
      // Convert payload to FormData
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          if (
            key === 'aadhar_front' ||
            key === 'aadhar_back' ||
            key === 'police_verification' ||
            key === 'qr_code'
          ) {
            // Agar image hai (uri, name, type)
            if (typeof payload[key] === 'object' && payload[key]?.uri) {
              formData.append(key, {
                uri: payload[key].uri,
                name: payload[key].name || 'image.jpg',
                type: payload[key].type || 'image/jpeg',
              });
            }
          } else {
            formData.append(key, payload[key]);
          }
        }
      });

      const res = await postRequest(updateProfileUrl(), formData, true); // ✅ 'true' agar multipart supported hai
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
          label: item.city_name,
          value: item.slug,
        }));
      })
      .addCase(fetchPgCities.rejected, (state, action) => {
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
      .addCase(fetchPgExtraFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mainSlice.reducer;