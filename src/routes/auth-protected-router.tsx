import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { SIGN_IN_PATH } from '../constants/routes.constant';
import { useAppSelector } from '../store/hooks';

export const AuthProtected = () => {
  const { user, status } = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && status !== 'loading' && status !== 'idle') {
      navigate(SIGN_IN_PATH, { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? <Outlet /> : null;
};
