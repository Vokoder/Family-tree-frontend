import type { ReactNode } from 'react';
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Col, Row, Typography } from 'antd';

import { ErrorMessage } from './form-error-message';
import { FormInputName } from './form-input-name/form-input-name';

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  controllerName: Path<T>;
  label?: string;
  required: boolean;
  counter?: number;
  maxLength?: number;
  children: (params: { field: ControllerRenderProps<T, Path<T>>; fieldState: ControllerFieldState }) => ReactNode;
}

const { Text } = Typography;

export const FormField = <T extends FieldValues>({
  control,
  controllerName,
  label,
  required,
  counter,
  maxLength,
  children,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Row justify='space-between' align='middle'>
            {label !== undefined && (
              <Col flex='auto'>
                <FormInputName name={label} required={required} />
              </Col>
            )}
            {counter !== undefined && maxLength !== undefined && (
              <Col>
                <Text type='secondary'>
                  {counter}/{maxLength}
                </Text>
              </Col>
            )}
          </Row>

          <Row justify='start'>{children({ field, fieldState })}</Row>

          <Row justify='start'>
            <ErrorMessage message={fieldState.error?.message} />
          </Row>
        </>
      )}
    />
  );
};
