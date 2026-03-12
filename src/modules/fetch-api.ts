import axios from 'axios';
import type { User } from '../types/user.type'
import { HttpError } from './http-error';
import { SERVER_ADRESS, SERVER_LOGOUT_ADRESS, SERVER_PERSON_ADRESS } from '../constants/env';
import { AXIOS_ERROR } from '../constants/errors.constant';
import type { Person, PersonFilters } from '../types/person.type';

type QueryParams = Record<string, string | number | boolean | string[] | number[] | undefined | null>;

const axiosGetRequest = async <T>(adress: string, params?: QueryParams): Promise<T> => {
  try {
    const res = await axios.get(adress, { withCredentials: true, params });
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

export const sendAuthRequest = async (login: string, password: string, path: string): Promise<User> => {
  const user: User = await axiosPostRequest<User>(`${SERVER_ADRESS}${path}`, { login, password });
  return user;
};

export const logOutRequest = async (): Promise<void> => {
  await axiosPostRequest(SERVER_LOGOUT_ADRESS);
};

export const getPersons = async (filter?: PersonFilters): Promise<Person[]> => {
  const normalizedFilter = filter ? {
    ...filter,
    dateOfBirthday: filter.dateOfBirthday?.toISOString(),
    dateOfDeath: filter.dateOfDeath?.toISOString(),
  } : undefined;

  const persons = await axiosGetRequest<Person[]>(`${SERVER_ADRESS}${SERVER_PERSON_ADRESS}`, normalizedFilter);
  return persons;
}
