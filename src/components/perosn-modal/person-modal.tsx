import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from 'react-hook-form';

import { Col, DatePicker, Divider, Form, Input, Modal, Row, Select } from 'antd';

import dayjs from 'dayjs';

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
  UPDATE_MY_PERSON,
  UPDATE_PERSON,
} from '../../constants/constants';
import { useAppSelector } from '../../store';
import { getTranslation } from '../../utils/translate.utils';
import styles from './perosn-modal.module.css';

const titles = [
  [CREATE_PERSON, CREATE_MY_PERSON],
  [UPDATE_PERSON, UPDATE_MY_PERSON],
];

interface PersonModalProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  onOk: () => void;
  handleClose: () => void;
  open: boolean;
  isForSelf: boolean;
  isForUpdate: boolean;
  confirmLoading?: boolean;
}

export const PersonModal = <T extends FieldValues>({
  control,
  errors,
  onOk,
  handleClose,
  open,
  isForSelf,
  isForUpdate,
  confirmLoading,
}: PersonModalProps<T>) => {
  const typesOfRelations = useAppSelector((store) => store.typesOfRelations.typesOfRelations);

  const getHelp = (name: keyof T) => errors[name as keyof T]?.message as React.ReactNode;

  return (
    <Modal
      className={styles.personModal}
      title={titles[Number(isForUpdate)][Number(isForSelf)]}
      open={open}
      onOk={onOk}
      onCancel={handleClose}
      width={'60vw'}
      okText={SUBMIT}
      cancelText={CANCEL}
      confirmLoading={confirmLoading}
    >
      <Form layout='vertical'>
        <Divider orientation='horizontal'>{MAIN_INFORMATION}</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={LAST_NAME}
              validateStatus={errors.lastName ? 'error' : ''}
              help={getHelp('lastName')}
              required={!isForUpdate}
            >
              <Controller name={'lastName' as Path<T>} control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={FIRST_NAME}
              validateStatus={errors.firstName ? 'error' : ''}
              help={getHelp('firstName')}
              required={!isForUpdate}
            >
              <Controller
                name={'firstName' as Path<T>}
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={MIDDLE_NAME}
              validateStatus={errors.middleName ? 'error' : ''}
              help={getHelp('middleName')}
            >
              <Controller
                name={'middleName' as Path<T>}
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={GENDER}
              validateStatus={errors.gender ? 'error' : ''}
              help={getHelp('gender')}
              required={!isForUpdate}
            >
              <Controller
                name={'gender' as Path<T>}
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

        <Divider orientation='horizontal'>{BIRTH_AND_DEATH}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={DATE_OF_BIRTHDAY}
              validateStatus={errors.dateOfBirthday ? 'error' : ''}
              help={getHelp('dateOfBirthday')}
            >
              <Controller
                name={'dateOfBirthday' as Path<T>}
                control={control}
                render={({ field: { value, onChange, onBlur, ref } }) => (
                  <DatePicker
                    ref={ref}
                    onBlur={onBlur}
                    style={{ width: '100%' }}
                    format='DD.MM.YYYY'
                    value={value ? dayjs(value as string | Date) : null}
                    onChange={(date) => {
                      onChange(date ? date.toISOString() : null);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={PLACE_OF_BIRTHDAY}
              validateStatus={errors.placeOfBirthday ? 'error' : ''}
              help={getHelp('placeOfBirthday')}
            >
              <Controller
                name={'placeOfBirthday' as Path<T>}
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={DATE_OF_DEATH}
              validateStatus={errors.dateOfDeath ? 'error' : ''}
              help={getHelp('dateOfDeath')}
            >
              <Controller
                name={'dateOfDeath' as Path<T>}
                control={control}
                render={({ field: { value, onChange, onBlur, ref } }) => (
                  <DatePicker
                    ref={ref}
                    onBlur={onBlur}
                    style={{ width: '100%' }}
                    format='DD.MM.YYYY'
                    value={value ? dayjs(value as string | Date) : null}
                    onChange={(date) => {
                      onChange(date ? date.toISOString() : null);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={PLACE_OF_DEATH}
              validateStatus={errors.placeOfDeath ? 'error' : ''}
              help={getHelp('placeOfDeath')}
            >
              <Controller
                name={'placeOfDeath' as Path<T>}
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation='horizontal'>{ADDITIONALLY}</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={COUNTRY} validateStatus={errors.country ? 'error' : ''} help={getHelp('country')}>
              <Controller name={'country' as Path<T>} control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={CITY} validateStatus={errors.city ? 'error' : ''} help={getHelp('city')}>
              <Controller name={'city' as Path<T>} control={control} render={({ field }) => <Input {...field} />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={KEYWORDS} validateStatus={errors.keywords ? 'error' : ''} help={getHelp('keywords')}>
          <Controller
            name={'keywords' as Path<T>}
            control={control}
            render={({ field: { value, ...rest } }) => (
              <Input
                {...rest}
                placeholder={SELECT_KEYWORDS}
                value={Array.isArray(value) ? value.join(', ') : (value ?? '')}
              />
            )}
          />
        </Form.Item>
        <Form.Item label={BIOGRAPHY} validateStatus={errors.biography ? 'error' : ''} help={getHelp('biography')}>
          <Controller
            name={'biography' as Path<T>}
            control={control}
            render={({ field }) => <Input.TextArea rows={4} {...field} />}
          />
        </Form.Item>
        <Form.Item
          label={CONTACT_INFORMATION}
          validateStatus={errors.contactInformation ? 'error' : ''}
          help={getHelp('contactInformation')}
        >
          <Controller
            name={'contactInformation' as Path<T>}
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        {!isForSelf && (
          <Form.Item label={RELATION} validateStatus={errors.relation ? 'error' : ''} help={getHelp('relation')}>
            <Controller
              name={'relation' as Path<T>}
              control={control}
              render={({ field }) => (
                <Select {...field} allowClear placeholder={SELECT_RELATION_TYPE}>
                  {typesOfRelations.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {getTranslation(type.id)}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
