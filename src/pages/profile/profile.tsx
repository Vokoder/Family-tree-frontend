import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Card, Col, Descriptions, Divider, List, Popconfirm, Row, Space, Tag } from 'antd';

import { HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { AlertMessage } from '../../components/alert';
import { ChangePasswordModal } from '../../components/change-password-modal';
import { CreatePersonModal } from '../../components/create-person-modal';
import { CreateRelationModal } from '../../components/create-relation-modal';
import { DeletePersonButton } from '../../components/delete-person-button/delete-person-button';
import { LoadingWrapper } from '../../components/loading-wrapper/loading-wrapper';
import { UpdatePersonModal } from '../../components/update-person-modal';
import { UpdateRelationModal } from '../../components/update-relation-modal';
import {
  ACCOUNT_MANAGEMENT,
  CANCEL,
  CHANGE_PASSWORD,
  CREATE_PERSON,
  CREATE_RELATION,
  CREATED_PERSONS,
  DATE_OF_CREATION,
  DELETE_ACCOUNT,
  EFFECT_IRREVERSIBLE,
  ERROR_CHANGING_PASSWORD,
  ERROR_CREATING_PERSON,
  ERROR_CREATING_RELATION,
  ERROR_DELETION_PROFILE,
  ERROR_GETTING_MY_PERSONS,
  ERROR_UPDATING_PERSON,
  ERROR_UPDATING_RELATION,
  GO_TO_MY_PERSON,
  LOG_OUT,
  LOG_OUT_ALL,
  LOGIN,
  MY_PERSON,
  MY_PROFILE_TITLE,
  NO_CHANGING_DATA,
  NO_PERSONS,
  PASSWORD_SUCCESSFULLY_CHANGED,
  SUBMIT,
  TO_MAIN_PAGE,
  UPDATE_PERSON,
  UPDATE_RELATION,
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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isCreatePersonModalOpen, setIsCreatePersonModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdatePersonModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isUpdateRelationModalOpen, setIsUpdateRelationOpen] = useState(false);
  const [isCreateRelationModalOpen, setIsCreateRelationModalOpen] = useState(false);
  const [createdPersons, setCreatedPersons] = useState<Person[]>([]);
  const [myPerson, setMyPerson] = useState<Person | null>(null);
  const [isForSelf, setIsForSelf] = useState(false);
  const [isPersonsLoading, setIsPersonsLoading] = useState(false);

  const getCreatedPersons = async (): Promise<void> => {
    setIsPersonsLoading(true);
    if (!user?.id) {
      dispatch(showAlert({ type: 'error', message: `${ERROR_GETTING_MY_PERSONS}. Отсутствует user.id` }));
      return;
    }

    const persons = await getCreatedPersonsRequest(user.id);
    setCreatedPersons(persons);
    setIsPersonsLoading(false);
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
    setIsCreatePersonModalOpen(false);
  };

  const handleUpdatePerson = async (status: number) => {
    if (status !== 200) {
      if (status === 304) {
        dispatch(showAlert({ type: 'warning', message: NO_CHANGING_DATA }));
        setIsUpdatePersonModalOpen(false);
        return;
      } else {
        dispatch(showAlert({ type: 'warning', message: ERROR_UPDATING_PERSON }));
        return;
      }
    }

    await getCreatedPersons();

    dispatch(hideAlert());
    setIsUpdatePersonModalOpen(false);
  };

  const handleDeletePerson = async (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_DELETION_PROFILE }));
      return;
    }

    await getCreatedPersons();
    dispatch(hideAlert());
  };

  const handleDeleteProfile = async () => {
    const status = await deleteProfileRequest();
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_DELETION_PROFILE }));
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
    setIsCreatePersonModalOpen(true);
  };

  const handleOpenCreatePerson = () => {
    setIsForSelf(false);
    setIsCreatePersonModalOpen(true);
  };

  const handleOpenUpdatePerson = () => {
    setIsUpdatePersonModalOpen(true);
  };

  const handleOpenUpdateRelation = () => {
    setIsUpdateRelationOpen(true);
  };

  const handleOpenCreateRelation = () => {
    setIsCreateRelationModalOpen(true);
  };

  const handleUpdateRelation = async (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_UPDATING_RELATION }));
      return;
    }

    await getCreatedPersons();

    dispatch(hideAlert());
    setIsUpdateRelationOpen(false);
  };

  const handleCreateRelation = async (status: number) => {
    if (status !== 200) {
      dispatch(showAlert({ type: 'warning', message: ERROR_CREATING_RELATION }));
      return;
    }

    await getCreatedPersons();

    dispatch(hideAlert());
    setIsCreateRelationModalOpen(false);
  };

  useEffect(() => {
    getCreatedPersons();
  }, [user?.id]);

  useEffect(() => {
    setMyPerson(createdPersons.find((field) => field.id === user?.personId) ?? null);
  }, [createdPersons]);

  return (
    <div className={styles.page}>
      <div className={styles.screen_page}>
        <Button icon={<HomeOutlined />} onClick={() => navigate(`/${PERSONS_PATH}`)} className={styles.backButton}>
          {TO_MAIN_PAGE}
        </Button>
        <Card title={MY_PROFILE_TITLE} extra={<Tag color='blue'>{user?.roleId}</Tag>}>
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label={LOGIN}>{user?.login}</Descriptions.Item>
            <Descriptions.Item label={DATE_OF_CREATION}>
              {user?.createdAt ? dayjs(user.createdAt).format('DD.MM.YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={MY_PERSON}>
              <LoadingWrapper isLoading={isPersonsLoading}>
                {user?.personId && myPerson ? (
                  <Link
                    to={`/${PERSONS_PATH}/${user.personId}`}
                    className={styles.person_link}
                    style={{ color: myPerson.gender ? '#1677ff' : '#eb2f96' }}
                  >
                    <Col>{`${myPerson.lastName} ${myPerson.firstName} ${myPerson.middleName || ''}`}</Col>
                    {GO_TO_MY_PERSON}
                    <Col>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPerson(myPerson);
                          handleOpenUpdatePerson();
                        }}
                      >
                        {UPDATE_PERSON}
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPerson(myPerson);
                          handleOpenUpdateRelation();
                        }}
                      >
                        {UPDATE_RELATION}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPerson(myPerson);
                          handleOpenCreateRelation();
                        }}
                      >
                        {CREATE_RELATION}
                      </Button>
                    </Col>

                    <Col>
                      <span onClick={(e) => e.preventDefault()}>
                        <DeletePersonButton onConfirm={handleDeletePerson} id={myPerson.id} />
                      </span>
                    </Col>
                  </Link>
                ) : (
                  <Button type='link' onClick={handleOpenCreatePersonForSelf}>
                    {CREATE_PERSON}
                  </Button>
                )}
              </LoadingWrapper>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation='horizontal'>{CREATED_PERSONS}</Divider>

          <LoadingWrapper isLoading={isPersonsLoading}>
            <List
              dataSource={createdPersons.filter((p) => p.id !== user?.personId)}
              renderItem={(p: Person) => (
                <List.Item>
                  <Link
                    to={`/${PERSONS_PATH}/${p.id}`}
                    className={styles.person_link}
                    style={{ color: p.gender ? '#1677ff' : '#eb2f96' }}
                  >
                    <Row gutter={[16, 0]}>
                      <Col>{`${p.lastName} ${p.firstName} ${p.middleName || ''}`}</Col>
                      <Col>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPerson(p);
                            handleOpenUpdatePerson();
                          }}
                        >
                          {UPDATE_PERSON}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPerson(p);
                            handleOpenUpdateRelation();
                          }}
                        >
                          {UPDATE_RELATION}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPerson(p);
                            handleOpenCreateRelation();
                          }}
                        >
                          {CREATE_RELATION}
                        </Button>
                      </Col>
                      <Col>
                        <span onClick={(e) => e.preventDefault()}>
                          <DeletePersonButton onConfirm={handleDeletePerson} id={p.id} />
                        </span>
                      </Col>
                    </Row>
                  </Link>
                </List.Item>
              )}
              locale={{ emptyText: NO_PERSONS }}
            />
          </LoadingWrapper>
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
          open={isCreatePersonModalOpen}
          isForSelf={isForSelf}
          onCancel={() => setIsCreatePersonModalOpen(false)}
          onSubmit={handleCreatePerson}
        />
        <UpdatePersonModal
          open={isUpdateModalOpen}
          onCancel={() => setIsUpdatePersonModalOpen(false)}
          onSubmit={handleUpdatePerson}
          person={selectedPerson}
        />
        <ChangePasswordModal
          open={isPassModalOpen}
          onCancel={() => setIsPassModalOpen(false)}
          onSubmit={handleChangePassword}
        />
        <CreateRelationModal
          open={isCreateRelationModalOpen}
          onCancel={() => setIsCreateRelationModalOpen(false)}
          onSubmit={handleCreateRelation}
          sourcePerson={selectedPerson}
        />
        <UpdateRelationModal
          open={isUpdateRelationModalOpen}
          onCancel={() => setIsUpdateRelationOpen(false)}
          onSubmit={handleUpdateRelation}
          sourcePerson={selectedPerson}
        />
      </div>

      {alert && <AlertMessage />}
    </div>
  );
};
