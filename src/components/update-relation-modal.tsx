import { useEffect, useState } from 'react';

import { Modal, List, Button, Popconfirm, message, Typography, Space } from 'antd';

import {
  DELETE,
  DELETE_RELATION_TITLE,
  EDIT,
  ERROR_DELETING_RELATION,
  ERROR_UPDATING_RELATION,
  NO_CHANGES,
  RELATION_DELETED,
  RELATION_TYPE,
  RELATION_UPDATED,
  RELATIONS,
  UPDATE_RELATION_TITLE,
} from '../constants/constants';
import { deleteRelationRequest, getRelatedPersonsRequest, updateRelationRequest } from '../modules/fetch-api';
import type { RelationSchemaFields } from '../schemas/relation.schema';
import type { Person } from '../types/person.type';
import type { PersonWithRelation } from '../types/relation.type';
import { compareRelations } from '../utils/compare-relations.utils';
import { RelationForm } from './relation-form/relation-form';

interface UpdateRelationModalProps {
  sourcePerson: Person | null;
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void;
}

export const UpdateRelationModal = ({ sourcePerson, open, onCancel, onSubmit }: UpdateRelationModalProps) => {
  const [relatedData, setRelatedData] = useState<PersonWithRelation[]>([]);
  const [editingRelation, setEditingRelation] = useState<PersonWithRelation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(false);

  const fetchRelated = async () => {
    if (!sourcePerson) return;
    setIsLoading(true);
    try {
      const data = await getRelatedPersonsRequest(sourcePerson.id);
      setRelatedData(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && sourcePerson) {
      fetchRelated();
    }
  }, [open, sourcePerson]);

  if (!sourcePerson) return null;

  const handleUpdate = async (formData: RelationSchemaFields) => {
    setIsEventLoading(true);
    if (!editingRelation) return;

    const diff = compareRelations(editingRelation.relation, formData);

    if (Object.keys(diff).length === 0) {
      message.info(NO_CHANGES);
      setEditingRelation(null);
      return;
    }

    try {
      await updateRelationRequest(editingRelation.relation.id, diff);
      message.success(RELATION_UPDATED);
      onSubmit(200);
      setEditingRelation(null);
    } catch (e) {
      message.error(ERROR_UPDATING_RELATION);
      onSubmit(500);
    } finally {
      setIsEventLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsEventLoading(true);
    try {
      await deleteRelationRequest(id);
      message.success(RELATION_DELETED);
      onSubmit(200);
    } catch (e) {
      message.error(ERROR_DELETING_RELATION);
      onSubmit(500);
    } finally {
      setIsEventLoading(false);
    }
  };

  return (
    <Modal
      title={editingRelation ? UPDATE_RELATION_TITLE : `${RELATIONS}: ${sourcePerson.lastName}`}
      open={open}
      onCancel={editingRelation ? () => setEditingRelation(null) : onCancel}
      footer={null}
      width={700}
      destroyOnHidden
    >
      {editingRelation ? (
        // РЕЖИМ ФОРМЫ
        <RelationForm
          sourcePerson={sourcePerson}
          relatedData={editingRelation}
          onSubmit={handleUpdate}
          onCancel={() => setEditingRelation(null)}
          isLoading={isEventLoading}
        />
      ) : (
        // РЕЖИМ СПИСКА
        <List
          loading={isLoading}
          dataSource={relatedData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key='edit' type='link' onClick={() => setEditingRelation(item)}>
                  {EDIT}
                </Button>,
                <Popconfirm
                  key='del'
                  title={DELETE_RELATION_TITLE}
                  onConfirm={() => {
                    handleDelete(item.relation.id);
                  }}
                >
                  <Button type='link' danger loading={isEventLoading}>
                    {DELETE}
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`${item.person.lastName} ${item.person.firstName} ${item.person.middleName ?? ''}`}
                description={
                  <Space>
                    <Typography.Text type='secondary'>{RELATION_TYPE}:</Typography.Text>
                    <Typography.Text strong>{item.relation.relationId}</Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};
