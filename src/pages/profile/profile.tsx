import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Card, Descriptions, Divider, List, Popconfirm, Space, Tag } from 'antd';

import { HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { AlertMessage } from '../../components/alert';
import { ChangePasswordModal } from '../../components/change-password-modal';
import { CreatePersonModal } from '../../components/create-person-modal';
import {
  ACCOUNT_MANAGEMENT,
  CANCEL,
  CHANGE_PASSWORD,
  CREATE_PERSON,
  CREATED_PERSONS,
  DATE_OF_CREATION,
  DELETE_ACCOUNT,
  EFFECT_IRREVERSIBLE,
  ERROR_CHANGING_PASSWORD,
  ERROR_CREATING_PERSON,
  ERROR_DELETING_PROFILE,
  ERROR_GETTING_MY_PERSONS,
  GO_TO_MY_PERSON,
  LOG_OUT,
  LOG_OUT_ALL,
  LOGIN,
  MY_PERSON,
  NO_PERSONS,
  PASSWORD_SUCCESSFULLY_CHANGED,
  SUBMIT,
  TO_MAIN_PAGE,
} from '../../constants/constants';
import { PERSONS_PATH } from '../../constants/routes.constant';
import { deleteProfileRequest, getCreatedPersonsRequest, logOutRequest } from '../../modules/fetch-api';
import { hideAlert, logOut as logOutAction, showAlert, useAppDispatch, useAppSelector } from '../../store';
import type { Person } from '../../types/person.type';
import styles from './profile.module.css';

export const Profile = () => {
  const alert = useAppSelector((store) => store.alert.alert);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [createdPersons, setCreatedPersons] = useState<Person[]>([]);
  const [isForSelf, setIsForSelf] = useState(false);

  const getCreatedPersons = async (): Promise<void> => {
    if (!user?.id) {
      dispatch(showAlert({ type: 'error', message: `${ERROR_GETTING_MY_PERSONS}. Отсутствует user.id` }));
      return;
    }

    const persons = await getCreatedPersonsRequest(user.id);
    setCreatedPersons(persons);
  };

  const logOut = async (all: boolean) => {
    const status = await logOutRequest(all);
    if (status !== 200) {
      return;
    }

    dispatch(logOutAction());
  };

  const handleChangePassword = (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_CHANGING_PASSWORD }));
      return;
    }

    dispatch(showAlert({ type: 'success', message: PASSWORD_SUCCESSFULLY_CHANGED }));
    setIsPassModalOpen(false);
  };

  const handleCreatePerson = async (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_CREATING_PERSON }));
      return;
    }

    await getCreatedPersons();

    dispatch(hideAlert());
    setIsPersonModalOpen(false);
  };

  const handleDeleteProfile = async () => {
    const status = await deleteProfileRequest();
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_DELETING_PROFILE }));
      return;
    }

    dispatch(logOutAction());
    dispatch(hideAlert());
  };

  const handleLogOut = () => {
    logOut(false);
  };

  const handleLogOutAll = () => {
    logOut(true);
  };

  const handleOpenCreatePersonForSelf = () => {
    setIsForSelf(true);
    setIsPersonModalOpen(true);
  };

  const handleOpenCreatePerson = () => {
    setIsForSelf(false);
    setIsPersonModalOpen(true);
  };

  useEffect(() => {
    getCreatedPersons();
  }, [user?.id]);

  return (
    <div className={styles.page}>
      <div className={styles.screen_page}>
        <Button icon={<HomeOutlined />} onClick={() => navigate(`/${PERSONS_PATH}`)} className={styles.backButton}>
          {TO_MAIN_PAGE}
        </Button>
        <Card title='Мой профиль' extra={<Tag color='blue'>{user?.roleId}</Tag>}>
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label={LOGIN}>{user?.login}</Descriptions.Item>
            <Descriptions.Item label={DATE_OF_CREATION}>
              {user?.createdAt ? dayjs(user.createdAt).format('DD.MM.YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={MY_PERSON}>
              {user?.personId ? (
                <Link to={`/${PERSONS_PATH}/${user.personId}`}>{GO_TO_MY_PERSON}</Link>
              ) : (
                <Button type='link' onClick={handleOpenCreatePersonForSelf}>
                  {CREATE_PERSON}
                </Button>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation='horizontal'>{CREATED_PERSONS}</Divider>

          <List
            dataSource={createdPersons}
            renderItem={(p: Person) => (
              <List.Item>
                <Link
                  to={`/${PERSONS_PATH}/${p.id}`}
                  className={styles.person_link}
                  style={{ color: p.gender ? '#1677ff' : '#eb2f96' }}
                >
                  {`${p.lastName} ${p.firstName} ${p.middleName || ''}`}
                </Link>
              </List.Item>
            )}
            locale={{ emptyText: NO_PERSONS }}
          />
          <div className={styles.new_person_button}>
            <Button type='default' onClick={handleOpenCreatePerson}>
              {CREATE_PERSON}
            </Button>
          </div>

          <Divider orientation='horizontal'>{ACCOUNT_MANAGEMENT}</Divider>

          <Space className={styles.space}>
            <Button onClick={() => setIsPassModalOpen(true)}>{CHANGE_PASSWORD}</Button>
            <Popconfirm
              title={`${DELETE_ACCOUNT}?`}
              description={EFFECT_IRREVERSIBLE}
              onConfirm={handleDeleteProfile}
              okText={SUBMIT}
              cancelText={CANCEL}
            >
              <Button danger>{DELETE_ACCOUNT}</Button>
            </Popconfirm>
          </Space>

          <Space className={styles.space}>
            <Button onClick={handleLogOut}>{LOG_OUT}</Button>
            <Button onClick={handleLogOutAll}>{LOG_OUT_ALL}</Button>
          </Space>
        </Card>

        <CreatePersonModal
          open={isPersonModalOpen}
          isForSelf={isForSelf}
          onCancel={() => setIsPersonModalOpen(false)}
          onSubmit={handleCreatePerson}
        />
        <ChangePasswordModal
          open={isPassModalOpen}
          onCancel={() => setIsPassModalOpen(false)}
          onSubmit={handleChangePassword}
        />
      </div>

      {alert && <AlertMessage />}
    </div>
  );
};
