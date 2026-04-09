import * as yup from 'yup';
import z from 'zod';

import { CANNOT_BE_EMPTY, REQUIRED } from '../constants/validation';

export const relationFiltersSchema = z.object({
  sourcePersonId: z.string().optional(),
  targetPersonId: z.string().optional(),
  relationId: z.string().optional(),
  ownerId: z.string().optional(),
});

export const relationSchema = yup.object({
  sourcePersonId: yup.string().trim().required(REQUIRED).min(1, CANNOT_BE_EMPTY),
  targetPersonId: yup.string().trim().required(REQUIRED).min(1, CANNOT_BE_EMPTY),
  relationId: yup.string().trim().required(REQUIRED).min(1, CANNOT_BE_EMPTY),
});
export type RelationSchemaFields = yup.InferType<typeof relationSchema>;
