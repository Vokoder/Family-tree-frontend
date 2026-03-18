import { useNavigate } from 'react-router-dom';

import { Button } from 'antd';

import { LoginOutlined, UserOutlined } from '@ant-design/icons';

import { LOG_IN } from '../constants/constants';
import { PROFILE_PATH, SIGN_IN_PATH } from '../constants/routes.constant';
import { useAppSelector } from '../store';

export const GoToProfileButton = () => {
  const navigate = useNavigate();
  const login = useAppSelector((state) => state.user.user?.login);

  return (
    <Button
      type='default'
      onClick={() => navigate(!!login ? `/${PROFILE_PATH}` : `/${SIGN_IN_PATH}`)}
      icon={!!login ? <UserOutlined /> : <LoginOutlined />}
    >
      {!!login ? login : LOG_IN}
    </Button>
  );
};
