import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useEffect } from 'react';
import { PERSONS_PATH } from '../constants/routes.constant';

export const GuestProtected = () => {
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(PERSONS_PATH, { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? null : <Outlet />;
};
