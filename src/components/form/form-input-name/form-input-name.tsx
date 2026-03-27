import { Typography } from 'antd';

import formStyles from './form-input-name.module.css';

interface FormInputNameProps {
  name: string;
  required: boolean;
}

export const FormInputName = (props: FormInputNameProps) => {
  return (
    <Typography.Title level={5} className={formStyles.formInputName}>
      {props.name}
      {props.required && <span className={formStyles.requiredIndicator}> *</span>}
    </Typography.Title>
  );
};
