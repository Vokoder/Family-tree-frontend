import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { createPersonRequest } from '../modules/fetch-api';
import { createPersonSchema } from '../schemas/create-pesron-validation-schema';
import { useAppSelector } from '../store';
import type { CreatePersonFields } from '../types/person.type';
import { PersonModal } from './person-modal';

interface CreatePersonProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (status: number) => void | Promise<void>;
  isForSelf: boolean; // Если true - создаем person для себя
}

export const CreatePersonModal = ({ open, onCancel, onSubmit, isForSelf }: CreatePersonProps) => {
  const user = useAppSelector((store) => store.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePersonFields>({
    mode: 'onChange',
    resolver: yupResolver(createPersonSchema),
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
      await createPersonRequest({
        person: personData,
        isForSelf,
        relation:
          !isForSelf && relation && user?.personId
            ? {
                sourcePersonId: user.personId,
                relationId: relation,
              }
            : {},
      });

      reset();
      onSubmit(200);
    } catch {
      onSubmit(500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PersonModal
      control={control}
      errors={errors}
      onOk={() => handleSubmit(submitHandler)()}
      handleClose={onCancel}
      open={open}
      confirmLoading={isSubmitting}
      isForSelf={isForSelf}
      isForUpdate={false}
    />
  );
};
