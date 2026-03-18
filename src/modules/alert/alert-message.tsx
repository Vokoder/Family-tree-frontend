import { Alert } from 'antd';

import { hideAlert } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './alert.module.css';

export const AlertMessage = () => {
  const alert = useAppSelector((state) => state.alert.alert);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.alertContainer}>
      <Alert message={alert?.message} type={alert?.type} closable onClose={() => dispatch(hideAlert())} />
    </div>
  );
};
