import * as yup from 'yup';

import { REQUIRED } from '../constants/validation';
import type { CreatePersonFields } from '../types/person.type';

export const createPersonSchema: yup.ObjectSchema<CreatePersonFields> = yup
  .object({
    lastName: yup.string().trim().required(REQUIRED),
    firstName: yup.string().trim().required(REQUIRED),
    middleName: yup.string().trim().optional(),
    gender: yup.boolean().required(REQUIRED),
    country: yup.string().trim().optional(),
    city: yup.string().trim().optional(),
    relation: yup.string().trim().optional(),
    dateOfBirthday: yup.date().optional(),
    placeOfBirthday: yup.string().trim().optional(),
    dateOfDeath: yup.date().optional(),
    placeOfDeath: yup.string().trim().optional(),
    keywords: yup
      .array()
      .of(yup.string().trim().required())
      .transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
          return originalValue
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return value;
      })
      .optional(),
    biography: yup.string().trim().optional(),
    contactInformation: yup.string().trim().optional(),
  })
  .required();
