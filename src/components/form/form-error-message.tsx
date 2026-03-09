import { Typography } from 'antd';

interface ErrorMessageProps {
  message: string | undefined;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return props.message && <Typography.Text type="danger">{props.message}</Typography.Text>;
};
