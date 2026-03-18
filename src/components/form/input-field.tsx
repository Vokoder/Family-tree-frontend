import { type FieldValues } from 'react-hook-form';

import { Input, type InputProps } from 'antd';
import type { PasswordProps } from 'antd/es/input';

import { FormField, type FormFieldProps } from './form-field';

type BaseFormProps<T extends FieldValues> = Omit<FormFieldProps<T>, 'children'> & {
  asPassword?: boolean;
};

export type UnifiedInputFieldProps<T extends FieldValues> = BaseFormProps<T> & (InputProps | PasswordProps);

export const InputField = <T extends FieldValues>({
  control,
  controllerName,
  label,
  required,
  asPassword = false,
  ...inputProps
}: UnifiedInputFieldProps<T>) => {
  return (
    <FormField control={control} controllerName={controllerName} label={label} required={required}>
      {({ field, fieldState }) => {
        const status = fieldState.error === undefined ? '' : 'error';
        if (asPassword) {
          return <Input.Password status={status} {...field} {...(inputProps as PasswordProps)} />;
        }
        return <Input status={status} {...field} {...(inputProps as InputProps)} />;
      }}
    </FormField>
  );
};
