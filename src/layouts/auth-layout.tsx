import { type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Typography } from 'antd';

import { AlertMessage } from '../modules/alert';
import { useAppSelector } from '../store/hooks';
import type { AuthLayoutMode, ModeConfig } from '../types/auth-layout.type';
import styles from './auth-layout.module.css';
import { modeConstants } from './constants';

type AuthLayoutProps = {
  mode: AuthLayoutMode;
};

export const AuthLayout = ({ mode, children }: PropsWithChildren<AuthLayoutProps>) => {
  const alert = useAppSelector((store) => store.alert.alert);
  const modeConfig: ModeConfig = modeConstants[mode];

  return (
    <Row justify='center' align='middle' className={styles.registrationPageBg}>
      <Col xs={{ span: 22 }} sm={{ span: 16 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 7 }}>
        <Row className={styles.formBg}>
          <Col span={24}>{children}</Col>
          <Col span={24}>
            <Row justify='center' align='middle'>
              <Typography.Text className={styles.authorisationMethodText}>
                {modeConfig.footerText + ' '}
                <Link to={{ pathname: `/${modeConfig.footerNavigateTo}` }} className={styles.authorisationMethodButton}>
                  {modeConfig.footerSubText}
                </Link>
              </Typography.Text>
            </Row>
          </Col>
        </Row>
      </Col>
      {alert && <AlertMessage />}
    </Row>
  );
};
