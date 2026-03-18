import type z from 'zod';

import type { personFilterSchema } from '../schemas/person.schema.ts';

export interface Person {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: boolean; // 1 - male, 0 - female
  dateOfBirthday?: Date;
  placeOfBirthday?: string;
  dateOfDeath?: Date;
  placeOfDeath?: string;
  country?: string;
  city?: string;
  ownerId: string;
  biography?: string;
  keywords?: string[];
  contactInformation?: string;
}

export type CreatePersonFields = {
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: boolean; // 1 - male, 0 - female
  dateOfBirthday?: Date;
  placeOfBirthday?: string;
  dateOfDeath?: Date;
  placeOfDeath?: string;
  country?: string;
  city?: string;
  biography?: string;
  keywords?: string[];
  contactInformation?: string;
  relation?: string;
};

export type PersonFilters = z.infer<typeof personFilterSchema>;

export type PersonDto = Partial<Person>;

//  поля, присутствующие во всех интерфейсах
export const personFields: (keyof Person)[] = [
  'lastName',
  'firstName',
  'middleName',
  'gender',
  'dateOfBirthday',
  'placeOfBirthday',
  'dateOfDeath',
  'placeOfDeath',
  'country',
  'city',
  'ownerId',
  'biography',
  'keywords',
  'contactInformation',
];

//  минимально необходимые поля для персоны
export const personRequiredFields: (keyof Person)[] = ['lastName', 'firstName', 'gender'];

//  поля с идентичными firebase типами данных
export const simpleFields: (keyof Person)[] = [
  'lastName',
  'firstName',
  'middleName',
  'gender',
  'placeOfBirthday',
  'placeOfDeath',
  'country',
  'city',
  'ownerId',
  'biography',
  'keywords',
  'contactInformation',
];

//   поля Date - Timestamp
export const dateFields: (keyof Person)[] = ['dateOfBirthday', 'dateOfDeath'];
