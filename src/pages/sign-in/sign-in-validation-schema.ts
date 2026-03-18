import * as yup from 'yup';

import { REQUIRED } from '../../constants/validation';

export const signInSchema = yup
  .object({
    login: yup
      .string()
      .transform((originalValue) => (originalValue ? originalValue.trim() : originalValue))
      .required(REQUIRED),

    password: yup.string().required(REQUIRED),
  })
  .required();
