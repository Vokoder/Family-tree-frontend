import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getMyUserRequest, requestWithRefresh } from '../modules/fetch-api';
import type { User } from '../types/user.type';

type UserState = {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export const fetchUser = createAsyncThunk('user/fetch', async (_, { rejectWithValue }) => {
  try {
    // return await requestWithRefresh(() => getMyUserRequest());
    return await getMyUserRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState: UserState = { user: null, status: 'idle' };

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.status = 'failed';
      });
  },
});

export const { logIn, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
