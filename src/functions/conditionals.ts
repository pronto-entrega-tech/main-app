/**
 * @example { ...objectConditional(condition)(value) }
 */
export const objectConditional =
  (condition: any) =>
  <T>(value: T) =>
    condition ? value : undefined;

/**
 * @example [...arrayConditional(condition)(value)]
 */
export const arrayConditional =
  (condition: any) =>
  <T>(value: T) =>
    condition ? [value] : [];
