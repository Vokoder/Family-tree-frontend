import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Card, Descriptions, Divider, List, Popconfirm, Space, Tag } from 'antd';

import dayjs from 'dayjs';

import { ChangePasswordModal } from '../../components/change-password-modal';
import { CreatePersonModal } from '../../components/create-person-modal';
import {
  CANCEL,
  CHANGE_PASSWORD,
  CREATE_PERSON,
  DATE_OF_CREATION,
  DELETE_ACCOUNT,
  EFFECT_IRREVERSIBLE,
  ERROR_CHANGING_PASSWORD,
  ERROR_CREATING_PERSON,
  ERROR_DELETING_PROFILE,
  ERROR_GETTING_MY_PERSONS,
  GO_TO_MY_PERSON,
  LOGIN,
  MY_PERSON,
  NO_PERSONS,
  PASSWORD_SUCCESSFULLY_CHANGED,
  SUBMIT,
} from '../../constants/constants';
import { AlertMessage } from '../../modules/alert';
import { deleteProfileRequest, getCreatedPersonsRequest } from '../../modules/fetch-api';
import { hideAlert, logOut, showAlert, useAppDispatch, useAppSelector } from '../../store';
import type { Person } from '../../types/person.type';
import styles from './profile.module.css';

export const Profile = () => {
  const alert = useAppSelector((store) => store.alert.alert);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [createdPersons, setCreatedPersons] = useState<Person[]>([]);

  const getCreatedPersons = async (): Promise<void> => {
    if (!user?.id) {
      dispatch(showAlert({ type: 'error', message: `${ERROR_GETTING_MY_PERSONS}. Отсутствует user.id` }));
      return;
    }

    const persons = await getCreatedPersonsRequest(user.id);
    setCreatedPersons(persons);
  };

  const changePassword = (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_CHANGING_PASSWORD }));
      return;
    }

    dispatch(showAlert({ type: 'success', message: PASSWORD_SUCCESSFULLY_CHANGED }));
    setIsPassModalOpen(false);
  };

  const createdPerson = async (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_CREATING_PERSON }));
      return;
    }

    await getCreatedPersons();

    dispatch(hideAlert());
    setIsPersonModalOpen(false);
  };

  const deleteProfile = async () => {
    const status = await deleteProfileRequest();
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_DELETING_PROFILE }));
      return;
    }

    dispatch(logOut());
    dispatch(hideAlert());
  };

  useEffect(() => {
    getCreatedPersons();
  }, [user?.id]);

  return (
    <div className={styles.page}>
      <div className={styles.screen_page}>
        <Card title='Мой профиль' extra={<Tag color='blue'>{user?.roleId}</Tag>}>
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label={LOGIN}>{user?.login}</Descriptions.Item>
            <Descriptions.Item label={DATE_OF_CREATION}>
              {user?.createdAt ? dayjs(user.createdAt).format('DD.MM.YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={MY_PERSON}>
              {user?.personId ? (
                <Link to={`/persons/${user.personId}`}>{GO_TO_MY_PERSON}</Link>
              ) : (
                <Button type='link' onClick={() => setIsPersonModalOpen(true)}>
                  {CREATE_PERSON}
                </Button>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation='vertical'>{MY_PERSON}</Divider>
          <List
            dataSource={createdPersons}
            renderItem={(p: Person) => (
              <List.Item>
                <Link
                  to={`/persons/${p.id}`}
                  className={styles.person_link}
                  style={{ color: p.gender ? '#1677ff' : '#eb2f96' }}
                >
                  {`${p.lastName} ${p.firstName} ${p.middleName || ''}`}
                </Link>
              </List.Item>
            )}
            locale={{ emptyText: NO_PERSONS }}
          />

          <Space className={styles.space}>
            <Button onClick={() => setIsPassModalOpen(true)}>{CHANGE_PASSWORD}</Button>
            <Popconfirm
              title={`${DELETE_ACCOUNT}?`}
              description={EFFECT_IRREVERSIBLE}
              onConfirm={deleteProfile}
              okText={SUBMIT}
              cancelText={CANCEL}
            >
              <Button danger>{DELETE_ACCOUNT}</Button>
            </Popconfirm>
          </Space>
        </Card>

        <CreatePersonModal
          open={isPersonModalOpen}
          isForSelf={true}
          onCancel={() => setIsPersonModalOpen(false)}
          onSubmit={createdPerson}
        />
        <ChangePasswordModal
          open={isPassModalOpen}
          onCancel={() => setIsPassModalOpen(false)}
          onSubmit={changePassword}
        />
      </div>

      {alert && <AlertMessage />}
    </div>
  );
};
