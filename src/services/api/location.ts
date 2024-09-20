import Utils from "./utils";

const { ApiClient } = Utils;

const geocode = async (address: string) => {
  const { data } = await ApiClient.get(
    `/location/coords/from-address/${address}`,
  );

  return data as {
    lat: number;
    lng: number;
  };
};

const reverseGeocode = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const { data } = await ApiClient.get(
    `/location/address/from-coords/${latitude},${longitude}`,
  );

  return data as {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
};

export const apiLocation = { geocode, reverseGeocode };
