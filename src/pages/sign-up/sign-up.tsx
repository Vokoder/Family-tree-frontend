import { useForm, type SubmitHandler } from 'react-hook-form';

import { Row, Col } from 'antd';

import { yupResolver } from '@hookform/resolvers/yup';

import { SubmitButton } from '../../components/form';
import { InputField } from '../../components/form';
import { LoginPasswordFields } from '../../components/login-password-fields';
import { SERVER_AUTH_ADRESS, SERVER_REGISTER_ADRESS } from '../../constants/env';
import { AuthLayout } from '../../layouts/auth-layout';
import { sendAuthRequest } from '../../modules/fetch-api';
import { HttpError } from '../../modules/http-error';
import { showAlert, hideAlert } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import { logIn } from '../../store/user-slice';
import { SignUpHeader } from './sign-up-header/sign-up-header';
import { signUpSchema } from './sign-up-validation-schema';
import { AUTH_ERROR } from './sign-up.constants';
import type { SignUp } from './sign-up.types';

export const SignUpForm = () => {
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm<SignUp>({
    mode: 'onSubmit',
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    try {
      const user = await sendAuthRequest(data.login, data.password, `${SERVER_AUTH_ADRESS}${SERVER_REGISTER_ADRESS}`);
      dispatch(hideAlert());
      dispatch(logIn(user));
    } catch (error) {
      dispatch(showAlert({ type: 'warning', message: error instanceof HttpError ? error.message : AUTH_ERROR }));
    }
  };

  return (
    <AuthLayout mode={'signup'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <SignUpHeader />
          </Col>
          <Col span={24}>
            <Row gutter={[0, 16]}>
              <LoginPasswordFields<SignUp> control={control} />

              <Col span={24}>
                <InputField<SignUp>
                  control={control}
                  controllerName='confirmPassword'
                  asPassword={true}
                  label='Подтвердите пароль'
                  placeholder='Введите пароль'
                  required={true}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <SubmitButton>Зарегистрироваться</SubmitButton>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
