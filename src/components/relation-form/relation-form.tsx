import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Form, Select, Button, Space, Input, Modal } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  CANCEL,
  CREATE_RELATION,
  FROM_WHOM,
  PRESS_TO_SEARCH_PERSON,
  RELATION_TYPE,
  SAVE,
  SEARCH_PERSON_TITLE,
  SELECT_RELATION_TYPE,
  TO_WHOM,
} from '../../constants/constants';
import { relationSchema, type RelationSchemaFields } from '../../schemas/relation.schema';
import { useAppSelector } from '../../store';
import type { Person } from '../../types/person.type';
import type { PersonWithRelation } from '../../types/relation.type';
import { SearchPersons } from '../search-persons/search-persons';
import styles from './relation-form.module.css';

interface RelationFormProps {
  sourcePerson: Person;
  relatedData?: PersonWithRelation;
  onSubmit: (relation: RelationSchemaFields) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const RelationForm = ({ sourcePerson, relatedData, onSubmit, onCancel, isLoading }: RelationFormProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [targetPerson, setTargetPerson] = useState<Person | null>(null);
  const typesOfRelations = useAppSelector((state) => state.typesOfRelations.typesOfRelations);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RelationSchemaFields>({
    resolver: yupResolver(relationSchema),
    defaultValues: {
      sourcePersonId: sourcePerson.id,
      targetPersonId: relatedData?.person?.id || '',
      relationId: relatedData?.relation.id || '',
    },
  });

  const handleSelectFromSearch = (person: Person) => {
    setTargetPerson(person);
    setValue('targetPersonId', person.id);
    setIsSearchOpen(false);
  };

  return (
    <>
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
        <Form.Item label={FROM_WHOM} help={errors.sourcePersonId?.message}>
          <Input value={`${sourcePerson.lastName} ${sourcePerson.firstName}`} disabled />
        </Form.Item>

        <Form.Item label={RELATION_TYPE} required help={errors.relationId?.message}>
          <Controller
            name='relationId'
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder={SELECT_RELATION_TYPE}>
                {typesOfRelations.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.id}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label={TO_WHOM} required help={errors.targetPersonId?.message}>
          {relatedData ? (
            <Input value={`${relatedData.person.lastName} ${relatedData.person.firstName}`} disabled />
          ) : (
            <div onClick={() => setIsSearchOpen(true)} className={styles.button}>
              <Input
                placeholder={`${PRESS_TO_SEARCH_PERSON}...`}
                value={
                  targetPerson ? `${targetPerson.lastName} ${targetPerson.firstName} (ID: ${targetPerson.id})` : ''
                }
                readOnly
                disabled={!!relatedData}
                suffix={<SearchOutlined className={styles.search_icon} />}
              />
            </div>
          )}
        </Form.Item>

        <Space className={styles.buttons}>
          <Button onClick={onCancel}>{CANCEL}</Button>
          <Button type='primary' htmlType='submit' loading={isLoading}>
            {relatedData ? SAVE : CREATE_RELATION}
          </Button>
        </Space>
      </Form>

      <Modal
        title={SEARCH_PERSON_TITLE}
        open={isSearchOpen}
        onCancel={() => setIsSearchOpen(false)}
        width='80vw'
        footer={null}
      >
        <SearchPersons onPersonClick={handleSelectFromSearch} />
      </Modal>
    </>
  );
};
