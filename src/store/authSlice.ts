import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '../services/apiService';
import { loginUrl } from '../services/urlHelper';

interface AuthState {
  loading: boolean;
  userData: any | null;
  userRole: string | null;
  isAuth: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  userData: null,
  userRole: null,
  isAuth: false,
  error: null,
};

// Login API
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    payload: {
      email_mobile: string;
      password: string;
      company_id: string;
      role: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(loginUrl(), payload);
      if (response.success) {
        // save user data + role to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        await AsyncStorage.setItem('userRole', payload.role);
      }
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Load user data from AsyncStorage on app start
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userRole = await AsyncStorage.getItem('userRole');
      if (userData && userRole) {
        return { userData: JSON.parse(userData), userRole };
      } else {
        return rejectWithValue('No user logged in');
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userRole');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.userData = action.payload.data;
          state.userRole = action.meta.arg.role;
          state.isAuth = true;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.userData = action.payload.userData;
        state.userRole = action.payload.userRole;
        state.isAuth = true;
      })
      .addCase(loadUserFromStorage.rejected, state => {
        state.isAuth = false;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.userData = null;
        state.userRole = null;
        state.isAuth = false;
      });
  },
});

export default authSlice.reducer;
