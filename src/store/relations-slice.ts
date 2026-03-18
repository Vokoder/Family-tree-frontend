import { createSlice } from '@reduxjs/toolkit';

import { getTypesOfRelations } from '../modules/fetch-api';
import type { TypeOfRelation } from '../types/types-of-relations.type';

type TypesOfRelationsState = {
  typesOfRelations: TypeOfRelation[];
};

const initialState: TypesOfRelationsState = { typesOfRelations: await getTypesOfRelations() };

const typesOfRelationsSlice = createSlice({
  name: 'typesOfRelations',
  initialState,
  reducers: {},
});

export const {} = typesOfRelationsSlice.actions;
export const typesOfRelationsReducer = typesOfRelationsSlice.reducer;
