import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { FormInputName } from './form-input-name/form-input-name';
import { ErrorMessage } from './form-error-message';
import { Col, Row, Typography } from 'antd';
import type { ReactNode } from 'react';

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

export const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
  return (
    <Controller
      name={props.controllerName}
      control={props.control}
      render={({ field, fieldState }) => (
        <>
          <Row justify="space-between" align="middle">
            {props.label !== undefined && (
              <Col flex="auto">
                <FormInputName name={props.label} required={props.required} />
              </Col>
            )}
            {props.counter !== undefined && props.maxLength !== undefined && (
              <Col>
                <Text type="secondary">
                  {props.counter}/{props.maxLength}
                </Text>
              </Col>
            )}
          </Row>

          <Row justify="start">{props.children({ field, fieldState })}</Row>

          <Row justify="start">
            <ErrorMessage message={fieldState.error?.message} />
          </Row>
        </>
      )}
    />
  );
};
