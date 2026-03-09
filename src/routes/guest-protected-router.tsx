import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DEFAULT_PATH, STATISTIC_PATH } from '../constants/routes.constant';
import { useAppSelector } from '../store/hooks';

export const GuestProtected = () => {
  const user = useAppSelector((state) => state.user.user);
  const path = useAppSelector((state) => state.path.path);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const target = path?.length ? `${STATISTIC_PATH}/${path}` : DEFAULT_PATH;

    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [user, navigate, location, path]);

  return user ? null : <Outlet />;
};
