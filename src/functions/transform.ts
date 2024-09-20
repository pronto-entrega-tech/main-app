export const transformCreatedAt = <T extends { created_at?: Date }>({
  created_at,
  ...res
}: T) =>
  ({
    ...res,
    created_at: created_at && new Date(created_at),
  }) as T;
