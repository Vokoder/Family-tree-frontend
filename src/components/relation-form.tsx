import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Form, Select, Button, Space, Input, Modal } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';

import { relationSchema, type RelationSchemaFields } from '../schemas/relation.schema';
import { useAppSelector } from '../store';
import type { Person } from '../types/person.type';
import type { PersonWithRelation } from '../types/relation.type';
import { SearchPersons } from './search-persons/search-persons';

interface RelationFormProps {
  sourcePerson: Person;
  relatedData?: PersonWithRelation;
  onSubmit: (relation: RelationSchemaFields) => void;
  onCancel: () => void;
}

export const RelationForm = ({ sourcePerson, relatedData, onSubmit, onCancel }: RelationFormProps) => {
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
        <Form.Item label='От кого' help={errors.sourcePersonId?.message}>
          <Input value={`${sourcePerson.lastName} ${sourcePerson.firstName}`} disabled />
        </Form.Item>

        <Form.Item label='Тип связи' required help={errors.relationId?.message}>
          <Controller
            name='relationId'
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder='Выберите тип связи'>
                {typesOfRelations.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.id} {/* Здесь будет имя типа */}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label='К кому' required help={errors.targetPersonId?.message}>
          {relatedData ? (
            <Input value={`${relatedData.person.lastName} ${relatedData.person.firstName}`} disabled />
          ) : (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder='Выберите человека через поиск'
                // value={selectedTargetId ? `Выбран ID: ${selectedTargetId}` : ''}
                value={targetPerson ? `${targetPerson.firstName} ${targetPerson.lastName} ${targetPerson.id}` : ''}
                readOnly
              />
              <Button icon={<SearchOutlined />} onClick={() => setIsSearchOpen(true)}>
                Поиск
              </Button>
            </Space.Compact>
          )}
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type='primary' htmlType='submit'>
            {relatedData ? 'Сохранить изменения' : 'Создать связь'}
          </Button>
        </Space>
      </Form>

      <Modal
        title='Поиск персоны'
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
