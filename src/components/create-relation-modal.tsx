import { useState } from 'react';

import { Modal, message } from 'antd';

import { CREATE_RELATION_TITLE, ERROR_CREATING_RELATION, RELATION_CREATED } from '../constants/constants';
import { createRelationRequest } from '../modules/fetch-api';
import type { RelationSchemaFields } from '../schemas/relation.schema';
import type { Person } from '../types/person.type';
import { RelationForm } from './relation-form/relation-form';

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
      message.success(RELATION_CREATED);
      onSubmit(200);
    } catch (error) {
      message.error(ERROR_CREATING_RELATION);
      console.error(error);
      onSubmit(500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title={CREATE_RELATION_TITLE} open={open} onCancel={onCancel} footer={null} width={600} destroyOnHidden>
      <RelationForm sourcePerson={sourcePerson} onSubmit={handleFormSubmit} onCancel={onCancel} isLoading={isLoading} />
    </Modal>
  );
};
