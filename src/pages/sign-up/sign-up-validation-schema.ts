import * as yup from 'yup';

import { LICENSE_CONSENT_REQUIRED, PASSWORDS_NOT_SAME, REQUIRED, WEAK_PASSWORD } from '../../constants/validation';

export const signUpSchema = yup
  .object({
    login: yup
      .string()
      .transform((originalValue) => (originalValue ? originalValue.trim() : originalValue))
      .required(REQUIRED),

    password: yup
      .string()
      .required(REQUIRED)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, WEAK_PASSWORD),

    confirmPassword: yup
      .string()
      .required(REQUIRED)
      .oneOf([yup.ref('password')], PASSWORDS_NOT_SAME),

    agreement: yup.boolean().oneOf([true], LICENSE_CONSENT_REQUIRED).required(REQUIRED),
  })
  .required();
