import { useNavigate } from 'react-router-dom';

import { Card, Descriptions, Tag, Typography } from 'antd';

import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import {
  DATE_OF_BIRTHDAY,
  DATE_OF_DEATH,
  GENDER,
  PLACE_OF_BIRTHDAY,
  PLACE_OF_DEATH,
  RELATED_LOCATIONS,
} from '../../constants/constants';
import type { Person } from '../../types/person.type';
import styles from './person-card.module.css';

type PersonCardProps = {
  person: Person;
};

export const PersonCard = ({ person }: PersonCardProps) => {
  const navigate = useNavigate();
  const formatDate = (date?: Date) => (date ? dayjs(date).format('DD.MM.YYYY') : null);

  return (
    <Card
      onClick={() => {
        navigate(person.id);
      }}
      hoverable
      className={[styles.card, person.gender ? styles.card_male : styles.card_female].join(' ')}
      style={{ borderLeft: `4px solid ${person.gender ? '#1677ff' : '#eb2f96'} ` }}
    >
      <Typography.Title level={4} className={styles.full_name}>
        {`${person.lastName} ${person.firstName} ${person.middleName ?? ''} `}
      </Typography.Title>

      <Descriptions
        size='small'
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
        layout='vertical'
        bordered
        className={styles.descriptions_style}
        labelStyle={{
          backgroundColor: '#fafafa',
          fontWeight: 500,
          width: '50%',
          padding: '4px 8px',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
        contentStyle={{
          backgroundColor: '#fff',
          width: '50%',
          padding: '4px 8px',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          verticalAlign: 'top',
        }}
      >
        {/* Рождение */}
        {person.dateOfBirthday && (
          <Descriptions.Item label={DATE_OF_BIRTHDAY}>{formatDate(person.dateOfBirthday)}</Descriptions.Item>
        )}
        {person.placeOfBirthday && (
          <Descriptions.Item label={PLACE_OF_BIRTHDAY} style={{ padding: 0, margin: 0 }}>
            {person.placeOfBirthday}
          </Descriptions.Item>
        )}

        {/* Смерть */}
        {person.dateOfDeath && (
          <Descriptions.Item label={<Typography.Text type='danger'>{DATE_OF_DEATH}</Typography.Text>}>
            {formatDate(person.dateOfDeath)}
          </Descriptions.Item>
        )}
        {person.placeOfDeath && <Descriptions.Item label={PLACE_OF_DEATH}>{person.placeOfDeath}</Descriptions.Item>}

        {/* Локация */}
        {(person.country || person.city) && (
          <Descriptions.Item label={RELATED_LOCATIONS}>
            {[person.country, person.city].filter(Boolean).join(', ')}
          </Descriptions.Item>
        )}

        <Descriptions.Item label={GENDER}>
          <Tag color={person.gender ? 'blue' : 'magenta'} icon={person.gender ? <ManOutlined /> : <WomanOutlined />}>
            {person.gender ? 'Мужчина' : 'Женщина'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
