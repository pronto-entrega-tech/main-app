export const fail = (message?: string) => {
  const error = new Error(message);
  Error.captureStackTrace?.(error, fail);
  throw error;
};
