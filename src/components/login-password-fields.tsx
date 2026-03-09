import { Col } from 'antd';
import { InputField } from './form';
import type { Control, FieldValues, Path } from 'react-hook-form';

type LoginPasswordFieldsProps<T extends FieldValues> = {
  control: Control<T>;
};

export const LoginPasswordFields = <T extends FieldValues>({ control }: LoginPasswordFieldsProps<T>) => {
  return (
    <>
      <Col span={24}>
        <InputField<T>
          control={control}
          controllerName={'login' as Path<T>}
          label="Логин"
          placeholder="Введите имя пользователя"
          required={true}
        />
      </Col>

      <Col span={24}>
        <InputField<T>
          control={control}
          controllerName={'password' as Path<T>}
          asPassword={true}
          label="Пароль"
          placeholder="Введите пароль"
          required={true}
        />
      </Col>
    </>
  );
};
