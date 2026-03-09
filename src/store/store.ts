import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './user-slice';
import { alertReducer } from './alert-slice';
 
export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
