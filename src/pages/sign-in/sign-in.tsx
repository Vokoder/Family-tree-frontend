import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { SignIn } from './sign-in-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Col, Row, Typography } from 'antd';
import { SubmitButton } from '../../components/form';
import { signInSchema } from './sign-in-validation-schema';
import styles from '@pages/sign-in/sign-in.module.css';
import { WarningFilled } from '@ant-design/icons';
import { AuthLayout } from '../../layouts/auth-layout';
import { AUTH_ERROR } from './sign-in.constants';
import { INVALID_CREDENTIAL } from '../../constants/validation';
import { showAlert, hideAlert } from '../../store/';
import { HttpError } from '../../modules/http-error';
import { SERVER_AUTH_ADRESS, SERVER_LOGIN_ADRESS } from '../../constants/env';
import { useAppDispatch } from '../../store/hooks';
import { logIn } from '../../store/user-slice';
import { sendAuthRequest } from '../../modules/fetch-api';
import { LoginPasswordFields } from '../../components/login-password-fields';

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
                type="error"
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
