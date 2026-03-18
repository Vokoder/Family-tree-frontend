import * as yup from 'yup';

import { PASSWORDS_NOT_SAME, REQUIRED, WEAK_PASSWORD } from '../constants/validation';

export const passwordSchema = yup
  .object({
    oldPassword: yup.string().required(REQUIRED),
    newPassword: yup
      .string()
      .min(8, 'Минимум 8 символов')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, WEAK_PASSWORD)
      .required(REQUIRED),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], PASSWORDS_NOT_SAME)
      .required(REQUIRED),
  })
  .required();

export type ChangePasswordFields = yup.InferType<typeof passwordSchema>;
