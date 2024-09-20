import { device } from "~/constants";
import { Profile } from "~/core/models";
import Utils from "./utils";

const { ApiClient, authHeader } = Utils;

const create = async (create_token: string, name: string) => {
  const { data } = await ApiClient.post(
    "/customers",
    { name },
    { params: { useCookie: device.web }, headers: { create_token } },
  );
  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in?: Date;
  };
};

const find = async (access_token: string) => {
  const { data } = await ApiClient.get("/customers", authHeader(access_token));
  return data as Profile;
};

type UpdateCustomer = {
  name?: string;
  document?: string;
  phone?: string;
};

const update = async (access_token: string, dto: UpdateCustomer) => {
  const { data } = await ApiClient.patch(
    "/customers",
    dto,
    authHeader(access_token),
  );
  return data as { name: string };
};

export const apiCustomers = { create, find, update };
