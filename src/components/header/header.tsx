import type { ReactNode } from 'react';
import styles from './header.module.css';
import { Button, Col, Grid, Row } from 'antd';
import { EXIT_PROFILE } from './header.constants';
import { useLogOut } from '../../modules/use-log-out';
import { LogoutOutlined } from '@ant-design/icons';

export const Header = ({ children }: { children: ReactNode }) => {
  const logOut = useLogOut();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const showIcon = !screens.sm;

  return (
    <>
      <Row className={styles.mainContainer} justify="space-between">
        <Col span={12} sm={11} lg={9} xl={8} className={styles.children}>
          {children}
        </Col>
        <Col span={12} sm={12} lg={8} xl={6} className={styles.logOutButton}>
          <Button color="danger" variant="outlined" onClick={logOut}>
            {showIcon ? <LogoutOutlined /> : EXIT_PROFILE}
          </Button>
        </Col>
      </Row>
    </>
  );
};
