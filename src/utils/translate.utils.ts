import { REL_TRANSLATIONS } from '../constants/constants';

export const getTranslation = (id: string): string => {
  const relation = REL_TRANSLATIONS[id]?.direct || id;
  return relation;
};
