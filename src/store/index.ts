import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mainReducer from './mainSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    main: mainReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
