import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert-slice';
import { typesOfRelationsReducer } from './relations-slice';
import { userReducer } from './user-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    typesOfRelations: typesOfRelationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
