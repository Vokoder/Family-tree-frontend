import { Controller, useForm } from 'react-hook-form';

import { Form, Input, Modal } from 'antd';

import { yupResolver } from '@hookform/resolvers/yup';

import { CANCEL, SUBMIT } from '../constants/constants';
import { changePasswordRequest } from '../modules/fetch-api';
import { passwordSchema, type ChangePasswordFields } from '../schemas/change-password-validation-schema';

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void | Promise<void>;
}

export const ChangePasswordModal = ({ open, onCancel, onSubmit }: ChangePasswordModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFields>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const submitHandle = async (data: ChangePasswordFields) => {
    const status = await changePasswordRequest(data.oldPassword, data.newPassword);
    onSubmit(status);
  };

  const handleClose = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title='Изменить пароль'
      open={open}
      onOk={handleSubmit(submitHandle)}
      onCancel={handleClose}
      okText={SUBMIT}
      cancelText={CANCEL}
      destroyOnHidden
    >
      <Form layout='vertical'>
        <Form.Item
          label='Старый пароль'
          validateStatus={errors.oldPassword ? 'error' : ''}
          help={errors.oldPassword?.message}
          required
        >
          <Controller name='oldPassword' control={control} render={({ field }) => <Input.Password {...field} />} />
        </Form.Item>
        <Form.Item
          label='Новый пароль'
          validateStatus={errors.newPassword ? 'error' : ''}
          help={errors.newPassword?.message}
          required
        >
          <Controller name='newPassword' control={control} render={({ field }) => <Input.Password {...field} />} />
        </Form.Item>
        <Form.Item
          label='Повторите пароль'
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
          required
        >
          <Controller name='confirmPassword' control={control} render={({ field }) => <Input.Password {...field} />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
