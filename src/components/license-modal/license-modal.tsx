import { useEffect, useState } from 'react';

import { Modal, Spin } from 'antd';

import { LICENSE_AGREEMENT } from '../../constants/constants';
import { getLicense } from '../../modules/fetch-api';
import type { LicenseData } from '../../types/license.type';
import styles from './license-modal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const getLicenseData = async (setData: (data: LicenseData | null) => void, setLoading: (loading: boolean) => void) => {
  const license = await getLicense();
  setData(license);
  setLoading(false);
};

export const LicenseModal = ({ open, onClose }: Props) => {
  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !data) {
      setLoading(true);
      getLicenseData(setData, setLoading);
    }
  }, [open, data]);

  return (
    <Modal title={data?.title || LICENSE_AGREEMENT} open={open} onOk={onClose} onCancel={onClose} footer={null}>
      {loading ? (
        <div className={styles.spin}>
          <Spin />
        </div>
      ) : (
        <div className={styles.content}>
          {data?.content.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}
    </Modal>
  );
};
