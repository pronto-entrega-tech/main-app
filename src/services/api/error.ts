import axios from "axios";
type ApiError = "Unauthorized" | "NotFound" | "Server";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  isError(type: ApiError, err: unknown) {
    if (!axios.isAxiosError(err)) return false;

    const status = {
      Unauthorized: 401,
      NotFound: 404,
      Server: 500,
    }[type];
    return err.response?.status === status;
  },
};
