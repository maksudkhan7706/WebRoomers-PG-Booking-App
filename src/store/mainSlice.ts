import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest } from '../services/apiService';

interface MainState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: MainState = {
  loading: false,
  data: null,
  error: null,
};

// Example GET API
export const fetchSomeData = createAsyncThunk(
  'main/fetchSomeData',
  async (endpoint: string, { rejectWithValue }) => {
    try {
      const response = await getRequest(endpoint);
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
      .addCase(fetchSomeData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mainSlice.reducer;
