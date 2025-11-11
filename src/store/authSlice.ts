import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '../services/apiService';
import {
  forgotPasswordpUrl,
  loginUrl,
  registerUrl,
  reSendOtpUrl,
  sendOtpUrl,
} from '../services/urlHelper';

// =======================
// 🔹 Initial State
// =======================
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

// =======================
// 🔹 LOGIN API
// =======================
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
        const userRoleFromAPI = response?.data?.user_type?.toLowerCase();
        const selectedRole = payload?.role?.toLowerCase();
        //Role mismatch check
        if (userRoleFromAPI !== selectedRole) {
          return {
            success: false,
            message: `Selected role (${selectedRole}) does not match your account role (${userRoleFromAPI}).`,
          };
        }
        //Only save when role matches
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        await AsyncStorage.setItem('userRole', payload.role);
      }

      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// =======================
// 🔹 LOAD USER (AsyncStorage)
// =======================
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

// =======================
// 🔹 LOGOUT
// =======================
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

// =======================
// 🔹 REGISTER API
// =======================
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    payload: {
      full_name: string;
      email: string;
      mobile: string;
      password: string;
      user_type: string; // user ya landlord
      company_id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(registerUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// =======================
// 🔹 SEND OTP API (new)
// =======================
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (
    payload: {
      email: string;
      mobile_number: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(sendOtpUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
// -------------------- RE-SEND OTP --------------------
export const reSendOtp = createAsyncThunk(
  'auth/reSendOtp',
  async (
    payload: { email: string; mobile_number: string; full_name: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest(reSendOtpUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: { email_mobile: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(forgotPasswordpUrl(), payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// =======================
// 🔹 SLICE
// =======================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // -------------------- LOGIN --------------------
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

      // -------------------- LOAD USER --------------------
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.userData = action.payload.userData;
        state.userRole = action.payload.userRole;
        state.isAuth = true;
      })
      .addCase(loadUserFromStorage.rejected, state => {
        state.isAuth = false;
      })

      // -------------------- LOGOUT --------------------
      .addCase(logoutUser.fulfilled, state => {
        state.userData = null;
        state.userRole = null;
        state.isAuth = false;
      })

      // -------------------- REGISTER --------------------
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.userData = null;
          state.userRole = null;
          state.isAuth = false; // abhi login nahi hua
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // -------------------- SEND OTP --------------------
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) {
          state.error = action.payload.message;
        }
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // -------------------- RE-SEND OTP --------------------
      .addCase(reSendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reSendOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) {
          state.error = action.payload.message;
        }
      })
      .addCase(reSendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // -------------------- FORGOT PASSWORD --------------------
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) {
          state.error = action.payload.message;
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
