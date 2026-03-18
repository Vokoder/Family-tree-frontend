import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Alert, Col, Row, Typography } from 'antd';

import { WarningFilled } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '@pages/sign-in/sign-in.module.css';

import { SubmitButton } from '../../components/form';
import { LoginPasswordFields } from '../../components/login-password-fields';
import { SERVER_AUTH_ADRESS, SERVER_LOGIN_ADRESS } from '../../constants/env';
import { INVALID_CREDENTIAL } from '../../constants/validation';
import { AuthLayout } from '../../layouts/auth-layout';
import { sendAuthRequest } from '../../modules/fetch-api';
import { HttpError } from '../../modules/http-error';
import { showAlert, hideAlert } from '../../store/';
import { useAppDispatch } from '../../store/hooks';
import { logIn } from '../../store/user-slice';
import type { SignIn } from './sign-in-types';
import { signInSchema } from './sign-in-validation-schema';
import { AUTH_ERROR } from './sign-in.constants';

export const SignInForm = () => {
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm<SignIn>({
    mode: 'onSubmit',
    resolver: yupResolver(signInSchema),
  });
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    try {
      const user = await sendAuthRequest(data.login, data.password, `${SERVER_AUTH_ADRESS}${SERVER_LOGIN_ADRESS}`);
      setIsInvalidCredentials(false);
      dispatch(hideAlert());
      dispatch(logIn(user));
    } catch (error) {
      dispatch(showAlert({ type: 'warning', message: error instanceof HttpError ? error.message : AUTH_ERROR }));
      if (error instanceof HttpError && error.status === 401) setIsInvalidCredentials(true);
    }
  };

  return (
    <AuthLayout mode={'signin'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <Typography.Title level={4}>Добро пожаловать!</Typography.Title>
          </Col>
          {isInvalidCredentials && (
            <Col span={24}>
              <Alert
                message={INVALID_CREDENTIAL}
                type='error'
                className={styles.alert}
                icon={<WarningFilled className={styles.alertIcon} />}
                showIcon
              />
            </Col>
          )}
          <Col span={24}>
            <Row gutter={[0, 16]}>
              <LoginPasswordFields<SignIn> control={control} />
            </Row>
          </Col>
          <Col span={24}>
            <SubmitButton>Авторизоваться</SubmitButton>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
