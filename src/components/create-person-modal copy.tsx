import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Col, DatePicker, Divider, Form, Input, Modal, Row, Select } from 'antd';

import { yupResolver } from '@hookform/resolvers/yup';

import {
  ADDITIONALLY,
  BIOGRAPHY,
  BIRTH_AND_DEATH,
  CANCEL,
  CITY,
  CONTACT_INFORMATION,
  COUNTRY,
  CREATE_MY_PERSON,
  CREATE_PERSON,
  DATE_OF_BIRTHDAY,
  DATE_OF_DEATH,
  FEMALE,
  FIRST_NAME,
  GENDER,
  KEYWORDS,
  LAST_NAME,
  MAIN_INFORMATION,
  MALE,
  MIDDLE_NAME,
  PLACE_OF_BIRTHDAY,
  PLACE_OF_DEATH,
  RELATION,
  SELECT_KEYWORDS,
  SELECT_RELATION_TYPE,
  SUBMIT,
} from '../constants/constants';
import { createPersonRequest, createRelationRequest } from '../modules/fetch-api';
import { createPersonSchema } from '../schemas/create-pesron-validation-schema';
import { useAppSelector } from '../store';
import type { CreatePersonFields } from '../types/person.type';

interface CreatePersonProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void | Promise<void>;
  isForSelf: boolean; // Если true - создаем person для себя
}

export const CreatePersonModal = ({ open, onCancel, onSubmit, isForSelf }: CreatePersonProps) => {
  const user = useAppSelector((store) => store.user.user);
  const typesOfRelations = useAppSelector((store) => store.typesOfRelations.typesOfRelations);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePersonFields>({
    mode: 'onSubmit',
    resolver: yupResolver(createPersonSchema),
    context: { isForSelf },
    defaultValues: {
      lastName: '',
      firstName: '',
      gender: undefined,
    },
  });

  const submitHandler: SubmitHandler<CreatePersonFields> = async (data: CreatePersonFields) => {
    const { relation, ...personData } = data;
    setIsSubmitting(true);
    try {
      // Идеально: отправить это одним запросом на бэк или использовать batch в Firebase
      const person = await createPersonRequest(personData);

      if (!isForSelf && relation && user?.personId) {
        await createRelationRequest({
          sourcePersonId: user.personId,
          targetPersonId: person.id,
          relationId: relation,
          ownerId: user.id,
        });
      }

      reset();
      onSubmit(200);
    } catch (e) {
      onSubmit(500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title={isForSelf ? CREATE_MY_PERSON : CREATE_PERSON}
      open={open}
      onOk={handleSubmit(submitHandler)}
      onCancel={() => {
        handleClose();
      }}
      width={'60vw'}
      okText={SUBMIT}
      cancelText={CANCEL}
      confirmLoading={isSubmitting}
    >
      <Form layout='vertical'>
        <Divider orientation='horizontal'>{MAIN_INFORMATION}</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={LAST_NAME}
              validateStatus={errors.lastName ? 'error' : ''}
              help={errors.lastName?.message}
              required
            >
              <Controller name='lastName' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={FIRST_NAME}
              validateStatus={errors.firstName ? 'error' : ''}
              help={errors.firstName?.message}
              required
            >
              <Controller name='firstName' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={MIDDLE_NAME}
              validateStatus={errors.middleName ? 'error' : ''}
              help={errors.middleName?.message}
            >
              <Controller name='middleName' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={GENDER}
              validateStatus={errors.gender ? 'error' : ''}
              help={errors.gender?.message}
              required
            >
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: true, label: MALE },
                      { value: false, label: FEMALE },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isForSelf && (
          <Form.Item label={RELATION} validateStatus={errors.relation ? 'error' : ''} help={errors.relation?.message}>
            <Controller
              name='relation'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={SELECT_RELATION_TYPE}
                  options={typesOfRelations.map((typeOfRelation) => {
                    return { value: typeOfRelation.id, label: typeOfRelation.id };
                  })}
                />
              )}
            />
          </Form.Item>
        )}

        <Divider orientation='horizontal'>{BIRTH_AND_DEATH}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={DATE_OF_BIRTHDAY}
              validateStatus={errors.dateOfBirthday ? 'error' : ''}
              help={errors.dateOfBirthday?.message}
            >
              <Controller
                name='dateOfBirthday'
                control={control}
                render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} format='DD.MM.YYYY' />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={PLACE_OF_BIRTHDAY}
              validateStatus={errors.placeOfBirthday ? 'error' : ''}
              help={errors.placeOfBirthday?.message}
            >
              <Controller name='placeOfBirthday' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={DATE_OF_DEATH}
              validateStatus={errors.dateOfDeath ? 'error' : ''}
              help={errors.dateOfDeath?.message}
            >
              <Controller
                name='dateOfDeath'
                control={control}
                render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} format='DD.MM.YYYY' />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={PLACE_OF_DEATH}
              validateStatus={errors.placeOfDeath ? 'error' : ''}
              help={errors.placeOfDeath?.message}
            >
              <Controller name='placeOfDeath' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation='horizontal'>{ADDITIONALLY}</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={COUNTRY} validateStatus={errors.country ? 'error' : ''} help={errors.country?.message}>
              <Controller name='country' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={CITY} validateStatus={errors.city ? 'error' : ''} help={errors.city?.message}>
              <Controller name='city' control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={KEYWORDS} validateStatus={errors.keywords ? 'error' : ''} help={errors.keywords?.message}>
          <Controller
            name='keywords'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={SELECT_KEYWORDS}
                value={Array.isArray(field.value) ? field.value.join(', ') : (field.value ?? '')}
              />
            )}
          />
        </Form.Item>
        <Form.Item label={BIOGRAPHY} validateStatus={errors.biography ? 'error' : ''} help={errors.biography?.message}>
          <Controller
            name='biography'
            control={control}
            render={({ field }) => <Input.TextArea rows={4} {...field} />}
          />
        </Form.Item>
        <Form.Item
          label={CONTACT_INFORMATION}
          validateStatus={errors.contactInformation ? 'error' : ''}
          help={errors.contactInformation?.message}
        >
          <Controller name='contactInformation' control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
