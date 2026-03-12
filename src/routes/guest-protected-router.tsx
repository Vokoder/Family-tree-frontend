import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const GuestProtected = () => {
  const user = useAppSelector((state) => state.user.user);

  return user ? null : <Outlet />;
};
