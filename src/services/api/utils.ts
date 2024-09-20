import axios, { AxiosError } from "axios";
import { stringify } from "qs";
import { Urls } from "~/constants/urls";

const paramsSerializer = (params: unknown) =>
  stringify(params, { arrayFormat: "repeat" });

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const ApiClient = axios.create({
  baseURL: Urls.API,
  paramsSerializer,
  withCredentials: true,
  transformRequest: [
    (data) => {
      if (data)
        Object.entries(data).forEach(([key, value]) => {
          if (value === "") delete data[key];
        });

      return data;
    },
    ...(axios.defaults.transformRequest as []),
  ],
});
ApiClient.interceptors.response.use(undefined, (err: AxiosError) => {
  const stringify = (v: any) => JSON.stringify(v, null, 2);
  const format = (v: any) => {
    try {
      return stringify(JSON.parse(v));
    } catch (err) {
      return "ERROR";
    }
  };

  const errMsg = [
    `${err.config?.method?.toUpperCase()} ${err.request?.responseURL}`,
    `Request ${format(err.config?.data)}`,
    `Response ${stringify(err.response?.data)}`,
  ].join("\n");
  console.error(errMsg);

  return Promise.reject(err);
});

const StaticClient = axios.create({
  baseURL: Urls.STATIC,
  paramsSerializer,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default { ApiClient, StaticClient, authHeader };
