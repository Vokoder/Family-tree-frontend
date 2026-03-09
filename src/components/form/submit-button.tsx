import { Button, type ButtonProps } from 'antd';

export const SubmitButton = (props: ButtonProps) => {
  return (
    <Button type="primary" block htmlType="submit" className="register-submit" {...props}>
      {props.children}
    </Button>
  );
};
