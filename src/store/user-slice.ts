import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user.type';
import { checkAuthRequest } from '../modules/fetch-api';

type UserState = {
  user: User | null;
};

const initialState: UserState = { user: await checkAuthRequest() };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logOut(state) {
      state.user = null;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
