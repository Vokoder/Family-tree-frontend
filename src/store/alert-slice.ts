import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AlertType } from '../modules/alert';

type AlertState = {
  alert: AlertType | null;
};

const initialState: AlertState = { alert: null };

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    show(state, action: PayloadAction<AlertType>) {
      state.alert = action.payload;
    },
    hide(state) {
      state.alert = null;
    },
  },
});

export const { show: showAlert, hide: hideAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;
