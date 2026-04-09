import { useState } from 'react';

import { Modal, message } from 'antd';

import { createRelationRequest } from '../modules/fetch-api';
import type { RelationSchemaFields } from '../schemas/relation.schema';
import type { Person } from '../types/person.type';
import { RelationForm } from './relation-form';

// Твой метод создания

interface CreateRelationModalProps {
  sourcePerson: Person | null;
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void;
}

export const CreateRelationModal = ({ sourcePerson, open, onCancel, onSubmit }: CreateRelationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!sourcePerson) return null;

  const handleFormSubmit = async (data: RelationSchemaFields) => {
    setIsLoading(true);
    try {
      console.log(data);
      await createRelationRequest(data);
      message.success('Связь успешно создана');
      onSubmit(200);
    } catch (error) {
      message.error('Ошибка при создании связи');
      console.error(error);
      onSubmit(500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title='Создание новой связи' open={open} onCancel={onCancel} footer={null} width={600} destroyOnHidden>
      <RelationForm sourcePerson={sourcePerson} onSubmit={handleFormSubmit} onCancel={onCancel} />
    </Modal>
  );
};
