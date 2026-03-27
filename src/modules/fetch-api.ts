import axios from 'axios';
import qs from 'qs';

import {
  LICENSE_ADRESS,
  SERVER_ADRESS,
  SERVER_LOGOUT_ADRESS,
  SERVER_PERSON_ADRESS,
  SERVER_PROFILE_ADRESS,
  SERVER_RELATION_ADRESS,
  SERVER_TYPES_OF_RELATIONS_ADRESS,
  SERVER_USER_ADRESS,
} from '../constants/env';
import { AXIOS_ERROR } from '../constants/errors.constant';
import type { LicenseData } from '../types/license.type';
import type { Person, PersonDto, PersonFilters } from '../types/person.type';
import type { Relation, RelationDto } from '../types/relation.type';
import type { TypeOfRelation } from '../types/types-of-relations.type';
import type { User } from '../types/user.type';
import { HttpError } from './http-error';

type QueryParams = Record<string, string | number | boolean | string[] | number[] | undefined | null>;

const axiosGetRequest = async <T>(adress: string, params?: QueryParams): Promise<T> => {
  try {
    const res = await axios.get(adress, {
      withCredentials: true,
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new HttpError(error.status, error.message);
    }
    throw new HttpError(500, (error as Error)?.message ?? AXIOS_ERROR);
  }
};

const axiosPostRequest = async <T>(adress: string, body: object = {}): Promise<T> => {
  try {
    const res = await axios.post(adress, body, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new HttpError(error.status, error.message);
    }
    throw new HttpError(500, (error as Error)?.message ?? AXIOS_ERROR);
  }
};

const axiosDeleteRequest = async (adress: string, body: object = {}): Promise<void> => {
  try {
    const res = await axios.delete(adress, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new HttpError(error.status, error.message);
    }
    throw new HttpError(500, (error as Error)?.message ?? AXIOS_ERROR);
  }
};

export const sendAuthRequest = async (login: string, password: string, path: string): Promise<User> => {
  const user: User = await axiosPostRequest<User>(`${SERVER_ADRESS}${path}`, { login, password });
  return user;
};

export const logOutRequest = async (): Promise<void> => {
  await axiosPostRequest(SERVER_LOGOUT_ADRESS);
};

export const deleteProfileRequest = async (uid?: string): Promise<number> => {
  try {
    await axiosDeleteRequest(`${SERVER_ADRESS}${SERVER_PROFILE_ADRESS}`, { uid });
    return 200;
  } catch (error) {
    console.error(error);
    return 500;
  }
};

export const getPersonsRequest = async (filter?: PersonFilters): Promise<Person[]> => {
  try {
    const normalizedFilter = filter
      ? {
          ...filter,
          dateOfBirthday: filter.dateOfBirthday?.toISOString(),
          dateOfDeath: filter.dateOfDeath?.toISOString(),
        }
      : undefined;

    const persons = await axiosGetRequest<Person[]>(`${SERVER_ADRESS}${SERVER_PERSON_ADRESS}`, normalizedFilter);
    return persons;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const getCreatedPersonsRequest = async (uid: string): Promise<Person[]> => {
  try {
    const persons = axiosGetRequest<Person[]>(`${SERVER_ADRESS}${SERVER_PERSON_ADRESS}/user`, { uid });
    return persons;
  } catch (error) {
    console.error(error);
  }

  return [];
};

export const createPersonRequest = async (personDto: PersonDto): Promise<Person> => {
  const person = await axiosPostRequest<Person>(`${SERVER_ADRESS}${SERVER_PERSON_ADRESS}`, personDto);
  return person;
};

export const getMyUserRequest = async (): Promise<User | null> => {
  try {
    const user = await axiosGetRequest<User>(`${SERVER_ADRESS}${SERVER_USER_ADRESS}`);
    return user;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const changePasswordRequest = async (oldPassword: string, password: string): Promise<number> => {
  try {
    await axiosPostRequest<User>(`${SERVER_ADRESS}${SERVER_USER_ADRESS}`, { oldPassword, password });
  } catch (error) {
    return 400;
  }
  return 200;
};

export const createRelationRequest = async (relationDto: RelationDto): Promise<Relation> => {
  const relation = await axiosPostRequest<Relation>(`${SERVER_ADRESS}${SERVER_RELATION_ADRESS}`, relationDto);
  return relation;
};

export const updateRelationRequest = async (relationId: string, relationDto: RelationDto): Promise<Relation> => {
  const relation = await axiosPostRequest<Relation>(
    `${SERVER_ADRESS}${SERVER_RELATION_ADRESS}/${relationId}`,
    relationDto,
  );
  return relation;
};

export const deleteRelationRequest = async (relationId: string): Promise<void> => {
  await axiosDeleteRequest(`${SERVER_ADRESS}${SERVER_RELATION_ADRESS}`, { relationId });
};

export const getTypesOfRelations = async (): Promise<TypeOfRelation[]> => {
  try {
    const typesOfRelations = axiosGetRequest<TypeOfRelation[]>(`${SERVER_ADRESS}${SERVER_TYPES_OF_RELATIONS_ADRESS}`);
    return typesOfRelations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLicense = async (): Promise<LicenseData | null> => {
  try {
    const license = (await axiosGetRequest(LICENSE_ADRESS)) as LicenseData;
    return license;
  } catch (error) {
    console.error(error);
    return null;
  }
};
