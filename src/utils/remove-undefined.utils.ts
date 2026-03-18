export function removeEmptyOrUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0),
    ),
  ) as Partial<T>;
}
