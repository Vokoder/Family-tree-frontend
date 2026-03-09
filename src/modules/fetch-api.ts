import axios from 'axios';
import type { User } from '../types/user.type';
import { HttpError } from './http-error';
import { SERVER_CHECK_AUTH_ADRESS, SERVER_CREATE_PATH_ADRESS, SERVER_LOGOUT_ADRESS } from '../constants/env';
import { AXIOS_ERROR } from '../constants/errors.constant';
import { SERVER_GET_STAT_ADRESS } from '../constants/env';
import { SERVER_GET_ALL_PATHS_ADRESS } from '../constants/env';
import type { PathData } from '../types/pathData.type';
import type { FullPathData } from '../types/fullPathData.type';

const getRequest = async <T>(adress: string, params?: string[]): Promise<T> => {
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

const postRequest = async <T>(adress: string, body: object = {}): Promise<T> => {
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
  const user: User = await postRequest<User>(path, { login, password });
  return user;
};

export const checkAuthRequest = async (): Promise<User | null> => {
  try {
    const user: User = await getRequest<User>(SERVER_CHECK_AUTH_ADRESS);
    return user;
  } catch {
    return null;
  }
};

export const logOutRequest = async (): Promise<void> => {
  await postRequest(SERVER_LOGOUT_ADRESS);
};

export const getStatRequest = async (path: string): Promise<FullPathData | null> => {
  const adress = SERVER_GET_STAT_ADRESS + path;
  const pathData: FullPathData | null = await getRequest<FullPathData | null>(adress);
  return pathData
    ? ({
        ...pathData,
        date_of_creation: new Date(pathData?.date_of_creation),
        active: Boolean(pathData.active),
      } as FullPathData)
    : null;
};

export const getAllPathsRequest = async (): Promise<PathData[]> => {
  const pathsData: PathData[] = await getRequest<PathData[]>(SERVER_GET_ALL_PATHS_ADRESS);
  if (!pathsData) return [];
  const parsedPathsData: PathData[] = pathsData.map<PathData>((path) => {
    return {
      ...path,
      date_of_creation: new Date(path.date_of_creation),
    } as PathData;
  });
  return parsedPathsData;
};

export const createPathRequest = async (url: string): Promise<PathData> => {
  const pathData: PathData = await postRequest(SERVER_CREATE_PATH_ADRESS, { url });
  const parsedPathData: PathData = { ...pathData, date_of_creation: new Date(pathData.date_of_creation) };
  return parsedPathData;
};
