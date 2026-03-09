import { Typography } from 'antd';
import styles from './sign-up-header.module.css';
import { PLEASE_REGISTER, WELCOME } from './sign-up-header.constants';

export const SignUpHeader = () => {
  return (
    <>
      <Typography.Title level={4} className={styles.header}>
        {WELCOME}
      </Typography.Title>
      <Typography.Text type="secondary" className={styles.header}>
        {PLEASE_REGISTER}
      </Typography.Text>
    </>
  );
};
