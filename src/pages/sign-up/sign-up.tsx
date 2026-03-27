import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Row, Col } from 'antd';
import { Typography } from 'antd';

import { yupResolver } from '@hookform/resolvers/yup';

import { SubmitButton } from '../../components/form';
import { InputField } from '../../components/form';
import { CheckboxField } from '../../components/form/check-box-field/check-box-field';
import { LicenseModal } from '../../components/license-modal/license-modal';
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
import { AUTH_ERROR, END_I_AGREE_WITH, SIGN_UP, START_I_AGREE_WITH } from './sign-up.constants';
import type { SignUp } from './sign-up.types';

const { Link } = Typography;

export const SignUpForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm<SignUp>({
    mode: 'onSubmit',
    resolver: yupResolver(signUpSchema),
    defaultValues: { agreement: false },
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
            <CheckboxField<SignUp> control={control} controllerName='agreement'>
              {START_I_AGREE_WITH}
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                {END_I_AGREE_WITH}
              </Link>
            </CheckboxField>
          </Col>
          <Col span={24}>
            <SubmitButton>{SIGN_UP}</SubmitButton>
          </Col>
        </Row>
      </form>

      <LicenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthLayout>
  );
};
