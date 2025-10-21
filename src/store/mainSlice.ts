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
} from '../services/urlHelper';

interface MainState {
  loading: boolean;
  data: any;
  pgDetail: any;
  pgRooms: any;
  pgRoomDetail: any;
  apiUserData: any;
  error: string | null;
}

const initialState: MainState = {
  loading: false,
  data: null,
  pgDetail: null,
  pgRooms: null,
  pgRoomDetail: null,
  apiUserData: null,
  error: null,
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
      console.log('formData =======>>>>',formData);
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
      });
  },
});

export default mainSlice.reducer;
