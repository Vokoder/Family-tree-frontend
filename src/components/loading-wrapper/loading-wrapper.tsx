import type { ReactNode } from 'react';

import { Button, Result, Skeleton, Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

interface LoadingWrapperProps {
  isLoading: boolean;
  isEmpty?: boolean;
  error?: string | null;
  children: ReactNode;
  onRetry?: () => void;
  skeletonRows?: number;
}

const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

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
        title='Ошибка загрузки'
        subTitle={error}
        extra={
          onRetry && (
            <Button onClick={onRetry} type='primary'>
              Повторить
            </Button>
          )
        }
      />
    );
  }

  // 2. Состояние пустых данных (когда загрузка завершена, но данных нет)
  if (!isLoading && isEmpty) {
    return <Result status='warning' title='Данные не найдены' />;
  }

  // 3. Состояние загрузки (Spin + Skeleton)
  return (
    <Spin spinning={isLoading} indicator={antIcon}>
      {isLoading ? (
        <div style={{ padding: 20 }}>
          <Skeleton active paragraph={{ rows: skeletonRows }} title />
        </div>
      ) : (
        children
      )}
    </Spin>
  );
};
