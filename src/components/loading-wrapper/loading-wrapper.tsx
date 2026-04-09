import type { ReactNode } from 'react';

import { Button, Result, Skeleton, Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

import { DATA_NOT_FOUND, RETRY } from '../../constants/constants';
import { LOADING_ERROR } from '../../constants/errors.constant';
import styles from './loading-wrapper.module.css';

interface LoadingWrapperProps {
  isLoading: boolean;
  isEmpty?: boolean;
  error?: string | null;
  children: ReactNode;
  onRetry?: () => void;
  skeletonRows?: number;
}

const antIcon = <LoadingOutlined className={styles.loading_icon} spin />;

export const LoadingWrapper = ({
  isLoading,
  isEmpty,
  error,
  children,
  onRetry,
  skeletonRows = 6,
}: LoadingWrapperProps) => {
  if (error) {
    return (
      <Result
        status='error'
        title={LOADING_ERROR}
        subTitle={error}
        extra={
          onRetry && (
            <Button onClick={onRetry} type='primary'>
              {RETRY}
            </Button>
          )
        }
      />
    );
  }

  if (!isLoading && isEmpty) {
    return <Result status='warning' title={DATA_NOT_FOUND} />;
  }

  return (
    <Spin spinning={isLoading} indicator={antIcon}>
      {isLoading ? (
        <div className={styles.sceleton_container}>
          <Skeleton active paragraph={{ rows: skeletonRows }} title />
        </div>
      ) : (
        children
      )}
    </Spin>
  );
};
