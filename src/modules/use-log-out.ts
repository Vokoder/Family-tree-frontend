import { useCallback } from 'react';

import { useAppDispatch } from '../store/hooks';
import { logOut as logOutAction } from '../store/user-slice';
import { logOutRequest } from './fetch-api';

export const useLogOut = () => {
  const dispatch = useAppDispatch();

  const logOut = useCallback(async (): Promise<void> => {
    await logOutRequest();
    dispatch(logOutAction());
  }, [dispatch]);

  return logOut;
};
