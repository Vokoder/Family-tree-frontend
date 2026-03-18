import { Typography } from 'antd';

import formStyles from './form-input-name.module.css';

interface FormInputnameProps {
  name: string;
  required: boolean;
}

export const FormInputName = (props: FormInputnameProps) => {
  return (
    <Typography.Title level={5} className={formStyles.formInputName}>
      {props.name}
      {props.required && <span className={formStyles.requiredIndicator}> *</span>}
    </Typography.Title>
  );
};
