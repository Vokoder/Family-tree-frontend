import { useEffect } from 'react';
import { SIGN_IN_PATH } from '../constants/routes.constant';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const AuthProtected = () => {
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate(SIGN_IN_PATH, { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? <Outlet /> : null;
};
