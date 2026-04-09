import { useEffect, useState } from 'react';

import { Modal, List, Button, Popconfirm, message, Typography, Space } from 'antd';

import { deleteRelationRequest, getRelatedPersonsRequest, updateRelationRequest } from '../modules/fetch-api';
import type { RelationSchemaFields } from '../schemas/relation.schema';
import type { Person } from '../types/person.type';
import type { PersonWithRelation } from '../types/relation.type';
import { compareRelations } from '../utils/compare-relations.utils';
import { RelationForm } from './relation-form';

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
    if (!editingRelation) return;

    const diff = compareRelations(editingRelation.relation, formData);

    if (Object.keys(diff).length === 0) {
      message.info('Изменений не обнаружено');
      setEditingRelation(null);
      return;
    }

    try {
      await updateRelationRequest(editingRelation.relation.id, diff);
      message.success('Связь обновлена');
      onSubmit(200);
      setEditingRelation(null);
    } catch (e) {
      message.error('Ошибка при обновлении');
      onSubmit(500);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRelationRequest(id);
      message.success('Связь удалена');
      onSubmit(200);
    } catch (e) {
      message.error('Ошибка при удалении');
      onSubmit(500);
    }
  };

  return (
    <Modal
      title={editingRelation ? 'Редактирование связи' : `Связи: ${sourcePerson.lastName}`}
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
                  Изменить
                </Button>,
                <Popconfirm
                  key='del'
                  title='Удалить связь?'
                  onConfirm={() => {
                    handleDelete(item.relation.id);
                  }}
                >
                  <Button type='link' danger>
                    Удалить
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`${item.person.lastName} ${item.person.firstName} ${item.person.middleName ?? ''}`}
                description={
                  <Space>
                    <Typography.Text type='secondary'>Вид связи:</Typography.Text>
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
