import styles from './alert.module.css';
import { Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideAlert } from '../../store';

export const AlertMessage = () => {
  const alert = useAppSelector((state) => state.alert.alert);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.alertContainer}>
      <Alert message={alert?.message} type={alert?.type} closable onClose={() => dispatch(hideAlert())} />
    </div>
  );
};
