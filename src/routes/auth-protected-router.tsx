import { useEffect } from 'react';
import { SIGN_IN_PATH } from '../constants/routes.constant';
import { Outlet, useLocation, useNavigate, useParams, type Params } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPath } from '../store/path-slice';

export const AuthProtected = () => {
  const user = useAppSelector((state) => state.user.user);
  const pathData = useAppSelector((state) => state.path.path);
  const dispatch = useAppDispatch();
  const { externalPath } = useParams<Params>();
  const path = externalPath ? decodeURIComponent(externalPath) : '';

  useEffect(() => {
    if (!path) return;
    if (pathData !== path) {
      dispatch(setPath(path));
    }
  }, [dispatch, path, pathData]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate(SIGN_IN_PATH, { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? <Outlet /> : null;
};
