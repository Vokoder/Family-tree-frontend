import { Button, Popconfirm } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { DELETE_PERSON } from '../../constants/constants';
import { deletePersonRequest } from '../../modules/fetch-api';
import styles from './delete-person-button.module.css';

type DeletePersonButtonProps = {
  id: string;
  onConfirm?: (status: number) => void;
};

export const DeletePersonButton = ({ id, onConfirm = () => {} }: DeletePersonButtonProps) => {
  return (
    <Popconfirm
      title='Удаление персонажа'
      description='Вы уверены, что хотите удалить эту карточку? Это действие необратимо.'
      onConfirm={async (e) => {
        e?.stopPropagation();
        onConfirm(await deletePersonRequest(id));
      }}
      onCancel={(e) => e?.stopPropagation()}
      okText='Да, удалить'
      cancelText='Отмена'
      okButtonProps={{ danger: true }}
      icon={<QuestionCircleOutlined className={styles.icon} />}
    >
      <Button>{DELETE_PERSON}</Button>
    </Popconfirm>
  );
};
