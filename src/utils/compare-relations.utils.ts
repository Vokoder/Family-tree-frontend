import type { RelationSchemaFields } from '../schemas/relation.schema';
import type { Relation } from '../types/relation.type';

export const compareRelations = (
  relationBefore: Relation,
  formData: RelationSchemaFields,
): Partial<RelationSchemaFields> => {
  const diff: Partial<RelationSchemaFields> = {};

  const setDiffField = <K extends keyof RelationSchemaFields>(key: K, value: RelationSchemaFields[K]) => {
    diff[key] = value;
  };

  (Object.keys(formData) as Array<keyof RelationSchemaFields>).forEach((key) => {
    const valBefore = relationBefore[key];
    const valAfter = formData[key];

    if (valBefore !== valAfter) {
      setDiffField(key, valAfter);
    }
  });

  return diff;
};
