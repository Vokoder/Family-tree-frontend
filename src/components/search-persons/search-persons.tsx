import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Col, DatePicker, Form, Input, Layout, Row, Select, Space, Typography } from 'antd';

import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CITY,
  COUNTRY,
  DATE_OF_BIRTHDAY,
  DATE_OF_DEATH,
  FEMALE,
  FILTERS,
  FIRST_NAME,
  GENDER,
  KEYWORDS,
  LAST_NAME,
  MALE,
  MIDDLE_NAME,
  NOTHING_FOUND,
  PLACE_OF_BIRTHDAY,
  PLACE_OF_DEATH,
  RESET,
  SEARCH,
  SEARCH_CITY,
  SEARCH_COUNTRY,
  SEARCH_FIRST_NAME,
  SEARCH_LAST_NAME,
  SEARCH_MIDDLE_NAME,
  SEARCH_PLACE_OF_BIRTHDAY,
  SEARCH_PLACE_OF_DEATH,
  SELECT_GENDER,
  SELECT_KEYWORDS,
} from '../../constants/constants';
import { getPersonsRequest } from '../../modules/fetch-api';
import { personFilterSchema } from '../../schemas/person.schema';
import type { Person, PersonFilters } from '../../types/person.type';
import { removeEmptyOrUndefined } from '../../utils/remove-undefined.utils';
import { PersonCard } from '../person-card/person-card';
import styles from './search-persons.module.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

interface SearchPersonsParams {
  onPersonClick?: (person: Person) => void;
}

export const SearchPersons = ({ onPersonClick }: SearchPersonsParams) => {
  const [searchResults, setSearchResults] = useState<Person[]>([]);

  const getSearchedPersons = async (filter?: PersonFilters): Promise<void> => {
    try {
      const persons = await getPersonsRequest(filter);
      setSearchResults(persons);
    } catch (error) {
      console.error(error);
    }
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(personFilterSchema),
  });

  useEffect(() => {
    getSearchedPersons();
  }, []);

  const onSearch = (filter: PersonFilters) => {
    const clearedFilter = removeEmptyOrUndefined(filter);
    getSearchedPersons(clearedFilter);
  };

  return (
    <Layout className={styles.content_layout}>
      {/* Фильтры */}
      <Sider width={300} theme='light' className={styles.sider}>
        <Title level={5}>
          <FilterOutlined /> {FILTERS}
        </Title>
        <Form layout='vertical' className={styles.form} onFinish={handleSubmit(onSearch)}>
          <Form.Item label={LAST_NAME}>
            <Controller
              name='lastName'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_LAST_NAME} />}
            />
          </Form.Item>

          <Form.Item label={FIRST_NAME}>
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_FIRST_NAME} />}
            />
          </Form.Item>

          <Form.Item label={MIDDLE_NAME}>
            <Controller
              name='middleName'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_MIDDLE_NAME} />}
            />
          </Form.Item>

          <Form.Item label={GENDER}>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <Select {...field} allowClear placeholder={SELECT_GENDER}>
                  <Select value={true}>{MALE}</Select>
                  <Select value={false}>{FEMALE}</Select>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label={DATE_OF_BIRTHDAY}>
            <Controller
              name='dateOfBirthday'
              control={control}
              render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} format='DD.MM.YYYY' />}
            />
          </Form.Item>

          <Form.Item label={PLACE_OF_BIRTHDAY}>
            <Controller
              name='placeOfBirthday'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_PLACE_OF_BIRTHDAY} />}
            />
          </Form.Item>

          <Form.Item label={DATE_OF_DEATH}>
            <Controller
              name='dateOfDeath'
              control={control}
              render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} format='DD.MM.YYYY' />}
            />
          </Form.Item>

          <Form.Item label={PLACE_OF_DEATH}>
            <Controller
              name='placeOfDeath'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_PLACE_OF_DEATH} />}
            />
          </Form.Item>

          <Form.Item label={COUNTRY}>
            <Controller
              name='country'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_COUNTRY} />}
            />
          </Form.Item>

          <Form.Item label={CITY}>
            <Controller
              name='city'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SEARCH_CITY} />}
            />
          </Form.Item>

          <Form.Item label={KEYWORDS}>
            <Controller
              name='keywords'
              control={control}
              render={({ field }) => <Input {...field} placeholder={SELECT_KEYWORDS} />}
            />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                getSearchedPersons();
                reset();
              }}
            >
              {RESET}
            </Button>
            <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
              {SEARCH}
            </Button>
          </Space>
        </Form>
      </Sider>

      {/* Карточки */}
      <Content className={styles.content}>
        <Row gutter={[16, 16]} justify='center'>
          <Col xs={24}>
            {searchResults.length > 0 ? (
              searchResults.map((person) => (
                <PersonCard key={person.id} person={person} onPersonClick={onPersonClick} />
              ))
            ) : (
              <div className={styles.empty}>{NOTHING_FOUND}</div>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
