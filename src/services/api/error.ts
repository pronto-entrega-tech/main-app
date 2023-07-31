type ApiError = 'Unauthorized' | 'NotFound' | 'Server';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  isError(type: ApiError, err: any) {
    const status = {
      Unauthorized: 401,
      NotFound: 404,
      Server: 500,
    }[type];
    return err.response?.status === status;
  },
};
