import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequest } from '../services/apiService';
import {
  dashboardUrl,
  pgDetailUrl,
  pgRoomsUrl,
  pgRoomDetailUrl,
} from '../services/urlHelper';

interface MainState {
  loading: boolean;
  data: any;
  pgDetail: any;
  pgRooms: any;
  pgRoomDetail: any;
  error: string | null;
}

const initialState: MainState = {
  loading: false,
  data: null,
  pgDetail: null,
  pgRooms: null,
  pgRoomDetail: null,
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
      });
  },
});

export default mainSlice.reducer;
