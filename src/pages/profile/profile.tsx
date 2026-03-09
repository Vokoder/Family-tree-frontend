import styles from './profile.module.css';
import { AlertMessage } from '../../modules/alert';
import { useAppSelector } from '../../store';

export const Profile = () => {
  const alert = useAppSelector((store) => store.alert.alert);

  return (
    <div className={styles.page}>
      {alert && <AlertMessage />}
    </div>
  );
};
