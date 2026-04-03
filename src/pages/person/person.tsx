import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Descriptions, Empty, Popconfirm, Space, Tag, Typography } from 'antd';

import { ArrowLeftOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { DeletePersonButton } from '../../components/delete-person-button/delete-person-button';
import { LoadingWrapper } from '../../components/loading-wrapper/loading-wrapper';
import {
  BACK,
  CONTACT_INFORMATION,
  DATE_OF_BIRTHDAY,
  DATE_OF_DEATH,
  FEMALE_NOMINATIVE,
  MALE_NOMINATIVE,
  NOT_SPECIFIED,
  OWNER_ID,
  PLACE_OF_BIRTHDAY,
  PLACE_OF_DEATH,
  RELATED_LOCATIONS,
} from '../../constants/constants';
import { USER_ADMIN_ROLE } from '../../constants/env';
import { getPersonRequest } from '../../modules/fetch-api';
import { useAppSelector } from '../../store';
import type { Person as PersonType } from '../../types/person.type';
import styles from './person.module.css';

export const Person = () => {
  const { Title, Paragraph, Text } = Typography;
  const { '*': uid } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useAppSelector((store) => store.user.user);

  if ((!person && !loading) || !uid) {
    return (
      <div style={{ padding: '24px' }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          {BACK}
        </Button>
        <Empty description='Персона не найдена' style={{ marginTop: 50 }} />
      </div>
    );
  }

  const getPerson = async (): Promise<void> => {
    setLoading(true);
    const person = await getPersonRequest(uid);
    setPerson(person);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getPerson();
  }, [uid]);

  const formatDate = (date?: Date) => (date ? dayjs(date).format('DD.MM.YYYY') : '-');

  return (
    <div className={styles.screen}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className={styles.backButton}>
        {BACK}
      </Button>

      <LoadingWrapper isLoading={loading} isEmpty={!person} onRetry={getPerson} skeletonRows={10}>
        <Card>
          <div className={styles.fullname_div}>
            <Title level={2} className={styles.title}>
              {person?.lastName} {person?.firstName} {person?.middleName}
            </Title>
            <Space size='middle' className={styles.space}>
              <Tag
                color={person?.gender ? 'blue' : 'magenta'}
                icon={person?.gender ? <ManOutlined /> : <WomanOutlined />}
              >
                {person?.gender ? MALE_NOMINATIVE : FEMALE_NOMINATIVE}
              </Tag>
              {person?.keywords?.map((tag) => (
                <Tag key={tag} color='default'>
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>

          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            {(person?.dateOfBirthday || person?.placeOfBirthday) && (
              <>
                <Descriptions.Item label={DATE_OF_BIRTHDAY}>
                  {formatDate(person?.dateOfBirthday) || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={PLACE_OF_BIRTHDAY}>{person?.placeOfBirthday || '-'}</Descriptions.Item>
              </>
            )}

            {(person?.dateOfDeath || person?.placeOfDeath) && (
              <>
                <Descriptions.Item label={DATE_OF_DEATH}>{formatDate(person.dateOfDeath) || '-'}</Descriptions.Item>
                <Descriptions.Item label={PLACE_OF_DEATH}>{person.placeOfDeath || '-'}</Descriptions.Item>
              </>
            )}

            {(person?.country || person?.city) && (
              <Descriptions.Item label={RELATED_LOCATIONS} span={2}>
                {[person?.country, person?.city].filter(Boolean).join(', ') || '-'}
              </Descriptions.Item>
            )}

            {person?.biography && (
              <Descriptions.Item label={CONTACT_INFORMATION} span={2}>
                <Text>{person?.contactInformation || NOT_SPECIFIED}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>

          {person?.biography && <Paragraph className={styles.paragraph}>{person.biography}</Paragraph>}

          {person?.ownerId && (
            <div className={styles.id_div}>
              <Text type='secondary'>
                {OWNER_ID}: {person?.ownerId}
              </Text>
            </div>
          )}

          {person?.id && (person?.ownerId === user?.id || user?.roleId === USER_ADMIN_ROLE) && (
            <>
              <DeletePersonButton id={person.id} />
            </>
          )}
        </Card>
      </LoadingWrapper>
    </div>
  );
};
