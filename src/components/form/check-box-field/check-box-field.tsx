import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

import { Checkbox, Col } from 'antd';

import styles from './check-box-field.module.css';

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  controllerName: Path<T>;
  children: React.ReactNode;
}

export const CheckboxField = <T extends FieldValues>({ control, controllerName, children }: CheckboxFieldProps<T>) => {
  return (
    <Col span={24}>
      <Controller
        control={control}
        name={controllerName}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)}>
              {children}
            </Checkbox>
            {error && <div className={styles.error}>{error.message}</div>}
          </>
        )}
      />
    </Col>
  );
};
