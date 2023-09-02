/**
 * @example { ...objectConditional(condition)(value) }
 */
export const objectConditional =
  (condition: unknown) =>
  <T>(value: T) =>
    condition ? value : undefined;

/**
 * @example [...arrayConditional(condition)(value)]
 */
export const arrayConditional =
  (condition: unknown) =>
  <T>(value: T) =>
    condition ? [value] : [];
