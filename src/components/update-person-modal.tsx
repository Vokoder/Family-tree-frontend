import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import { getRelationRequest, updatePersonRequest } from '../modules/fetch-api';
import { personSchema } from '../schemas/pesron-validation-schema';
import { useAppSelector } from '../store';
import {
  dateFields,
  personFields,
  type CreateUpdatePersonFields,
  type Person,
  type UpdatePersonDto,
} from '../types/person.type';
import type { Relation, RelationFilters } from '../types/relation.type';
import { PersonModal } from './person-modal';

interface UpdatePersonProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void | Promise<void>;
  person: Person | null;
}

const comparePersons = (personBefore: Person, personAfter: Person): UpdatePersonDto | null => {
  const diff: UpdatePersonDto = {};

  const setDiffField = <K extends keyof UpdatePersonDto>(key: K, value: UpdatePersonDto[K]) => {
    diff[key] = value;
  };

  personFields.forEach((key) => {
    const valBefore = personBefore[key];
    const valAfter = personAfter[key];

    if (valBefore === valAfter) {
      return;
    }

    if (dateFields.includes(key)) {
      const isoBefore = valBefore ? dayjs(valBefore as Date).toISOString() : null;
      const isoAfter = valAfter ? dayjs(valAfter as Date).toISOString() : null;

      if (isoBefore !== isoAfter) {
        setDiffField(key, isoAfter);
      }

      return;
    }

    if (Array.isArray(valBefore) && Array.isArray(valAfter)) {
      if (JSON.stringify(valBefore) === JSON.stringify(valAfter)) return;
    }

    setDiffField(key, valAfter);
  });

  if (Object.keys(diff).length) {
    return diff;
  } else {
    return null;
  }
};

export const UpdatePersonModal = ({ open, onCancel, onSubmit, person }: UpdatePersonProps) => {
  const user = useAppSelector((store) => store.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relation, setRelation] = useState<Relation | undefined>(undefined);

  const fetchRelationData = async () => {
    setRelation(undefined);

    if (person && user?.personId && person.id !== user.personId) {
      const relations = await getRelationRequest({
        sourcePersonId: user.personId,
        targetPersonId: person.id,
      } as RelationFilters);

      setRelation(relations[0]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRelationData();
    }
  }, [open]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUpdatePersonFields>({
    mode: 'onChange',
    resolver: yupResolver(personSchema),
    defaultValues: { ...person, relation: relation?.relationId },
  });

  useEffect(() => {
    if (open && person) {
      reset({
        ...person,
        relation: relation?.relationId,
      });
    }
  }, [person, relation, open, reset]);

  const submitHandler: SubmitHandler<CreateUpdatePersonFields> = async (data: CreateUpdatePersonFields) => {
    if (!person) return;
    const clearedPerson = comparePersons(person, { ...data, id: person.id, ownerId: person.ownerId });
    if (!clearedPerson) {
      onSubmit(304);
      return;
    }

    setIsSubmitting(true);

    const status = await updatePersonRequest(person.id, clearedPerson);
    console.log(status);
    if (status === 200) {
      reset();
      onSubmit(status);
    } else {
      onSubmit(500);
    }

    setIsSubmitting(false);
  };

  return (
    <PersonModal
      control={control}
      errors={errors}
      onOk={() => handleSubmit(submitHandler)()}
      handleClose={onCancel}
      open={open}
      confirmLoading={isSubmitting}
      isForSelf={true}
      isForUpdate={true}
    />
  );
};
