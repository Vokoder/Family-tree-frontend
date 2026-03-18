import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getMyUserRequest } from '../modules/fetch-api';
import type { User } from '../types/user.type';

type UserState = {
  user: User | null;
};

const initialState: UserState = { user: await getMyUserRequest() };

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
