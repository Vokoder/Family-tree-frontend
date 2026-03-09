import React from 'react';
import { Link } from 'react-router-dom';
import styles from './not-found.module.css';

export const NotFound: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Страница не найдена</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.link}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
