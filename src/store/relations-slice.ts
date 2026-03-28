import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getTypesOfRelations } from '../modules/fetch-api';
import type { TypeOfRelation } from '../types/types-of-relations.type';

type TypesOfRelationsState = {
  typesOfRelations: TypeOfRelation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export const fetchRelations = createAsyncThunk('relations/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getTypesOfRelations();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState: TypesOfRelationsState = { typesOfRelations: [], status: 'idle' };

const typesOfRelationsSlice = createSlice({
  name: 'typesOfRelations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRelations.fulfilled, (state, action) => {
      state.typesOfRelations = action.payload;
    });
  },
});

export const {} = typesOfRelationsSlice.actions;
export const typesOfRelationsReducer = typesOfRelationsSlice.reducer;
