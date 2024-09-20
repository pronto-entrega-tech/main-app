import { UrlObject } from "url";
import { Urls } from "~/constants/urls";
import {
  Market,
  Product,
  OrderSchedule,
  Order,
  Address,
  Coords,
  PaymentCard,
} from "~/core/models";
import { screensPaths } from "~/constants/routes";
import { objectConditional } from "./conditionals";
import { money } from "./money";
import { Buffer } from "buffer";
import { lightFormat } from "date-fns";
import { Params } from "~/hooks/useRouting";

export const validateProduct = (v: any): Product => ({
  ...v,
  price: money(v.price),
  ...objectConditional(v.discount_type)({
    discount: {
      type: v.discount_type,
      value_1:
        v.discount_type === "DISCOUNT_VALUE"
          ? money(v.discount_value_1)
          : +v.discount_value_1,
      value_2: v.discount_value_2,
      max_per_client: v.discount_max_per_client,
    },
  }),
});

export const validateMarket = (v: any): Market => ({
  ...v,
  min_time: +v.min_time,
  max_time: +v.max_time,
  accept_scheduling: !!v.schedule_mins_interval,
  delivery_fee: money(v.delivery_fee),
  order_min: v.order_min && money(v.order_min),
  rating: +v.rating,
  address: {
    street: v.address_street,
    number: v.address_number,
    district: v.address_district,
    city: v.address_city,
    state: v.address_state,
    complement: v.address_complement,
    coords: { lat: v.address_latitude, lng: v.address_longitude },
  },
});

export const validateOrder = (v: any): Order => ({
  ...v,
  created_at: new Date(v.created_at),
  finished_at: v.finished_at && new Date(v.finished_at),
  delivery_min_time: new Date(v.delivery_min_time),
  delivery_max_time: new Date(v.delivery_max_time),
  delivery_fee: money(v.delivery_fee),
  total: money(v.total),
  payment: {
    in_app: v.paid_in_app,
    method: v.payment_method,
    description: v.payment_description,
    change: money(v.payment_change),
    pix_code: v.pix_code,
    pix_qr_code: v.pix_qr_code,
    pix_expires_at: v.pix_expires_at && new Date(v.pix_expires_at),
  },
  address: {
    street: v.address_street,
    number: v.address_number,
    district: v.address_district,
    city: v.address_city,
    state: v.address_state,
    complement: v.address_complement,
    coords: { lat: v.address_latitude, lgn: v.address_longitude },
  },
});

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> =>
  keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {} as T);

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> =>
  keys.reduce(
    (result, key) => {
      delete result[key];
      return result;
    },
    { ...obj },
  );

type FalsyValue = undefined | null | false | 0 | "";
type Truly<T> = T extends FalsyValue ? never : T;
type Falsy<T> = T extends FalsyValue ? T : never;

export const filterFalsy = <T>(arr: T[]) => arr.filter(Boolean) as Truly<T>[];

export const toArray = <T>(v: T) =>
  (!v || Array.isArray(v) ? v : [v]) as Falsy<T> | Truly<T>[];

/**
 * @example [...addToArray(v)]
 */
export const addToArray = <T>(v: T) => (toArray(v) || []) as Truly<T>[];

export const capitalize = (v: string) =>
  `${v[0]?.toUpperCase()}${v.slice(1).toLowerCase()}`;

export const formatCardBrand = (card: PaymentCard) =>
  capitalize(card.brand.replace("UNKNOWN", "Desconhecido"));

export const digitsMask = (raw: string, data: [number, string][]) =>
  data.reduce(
    (v, [n, s]) => (v.length > n ? v.slice(0, n) + s + v.slice(n) : v),
    raw.replace(/\D/g, ""),
  );

export const documentMask = (doc: string) => {
  let lastQuantity = 0;

  const get = (quantity: number) => {
    lastQuantity += quantity;
    return doc.slice(lastQuantity - quantity, lastQuantity);
  };

  return `${get(2)}.${get(3)}.${get(3)}/${get(4)}-${get(2)}`;
};

export const computeDistance = (coords1: Coords, coords2: Coords) => {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const kilometerConst = 6377.830272;

  const radLat1 = toRad(coords1.lat);
  const radLng1 = toRad(coords1.lng);
  const radLat2 = toRad(coords2.lat);
  const radLng2 = toRad(coords2.lng);

  return (
    kilometerConst *
    Math.acos(
      Math.sin(radLat1) * Math.sin(radLat2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radLng2 - radLng1),
    )
  )
    .toFixed(1)
    .replace(".", ",");
};

export const getJwtExpiration = (jwt: string) => {
  const [, rawPayload] = jwt.split(".");
  const payload = JSON.parse(Buffer.from(rawPayload, "base64").toString());

  return payload.exp * 1000;
};

export const getLatLong = ({ coords }: Address) =>
  coords && `${coords.lat},${coords.lng}`;

export const canReview = (o: Order) => {
  if (!o.finished_at) return;

  const orderAge = Date.now() - +o.finished_at;
  const day = 24 * 60 * 60 * 1000;

  return orderAge < 15 * day;
};

export const formatDeliveryTime = (order: Order) => {
  const toString = (d: Date) => lightFormat(d, "HH:mm");

  const min = toString(order.delivery_min_time);
  const max = toString(order.delivery_max_time);

  return `${min} - ${max}`;
};

export const isScheduleEqual = (
  schedule1?: OrderSchedule,
  schedule2?: OrderSchedule,
) =>
  schedule1?.dayNumber === schedule2?.dayNumber &&
  schedule1?.hours === schedule2?.hours;

export const fail = (message?: string) => {
  const error = new Error(message);
  Error.captureStackTrace?.(error, fail);
  throw error;
};

// JavaScriptCore don't support lookbehind regex
const pathRegex = /(?:\/)\[.*?](?=\/|$)/g;

const queryFrom = (params: Params, path: string) => {
  const paramsNames = path.match(pathRegex)?.map((v) => v.slice(2, -1));

  return Object.fromEntries(
    Object.entries(params).filter(
      ([name, value]) => value && !paramsNames?.includes(name),
    ),
  );
};

export const urlFrom = (screen: string, params?: Params) => {
  const path =
    screensPaths.get(screen) ?? fail(`Path for '${screen}' not found`);

  const pathWithParams = path.replace(
    pathRegex,
    (param) => `/${params?.[param.slice(2, -1)]}`,
  );

  return {
    pathname: pathWithParams,
    query: params && queryFrom(params, path),
  } as UrlObject;
};

export const screenFrom = (path: string) =>
  [...screensPaths.entries()].find(([, p]) => p === path)?.[0];

type ImageDir = "main" | "market" | "product" | "banners";
export const getImageUrl = (dir: ImageDir, image: string) =>
  `${Urls.STATIC}/${dir}/${image}.webp`;

export const stringifyShortAddress = (a: Address) => {
  if (!a.street || !a.number) return a.city;

  return `${a.street}, ${a.number}`;
};

export const stringifyAddress = (a: Omit<Address, "id">) => {
  const district = a.district ? ` - ${a.district}` : "";
  const number = a.number ? `, ${a.number}` : "";

  return `${a.street}${number}${district}, ${a.city} - ${a.state}`;
};

export const toCityState = (address: Pick<Address, "city" | "state">) =>
  `${removeAccents(address.city)}-${address.state?.toLowerCase()}`;

export const removeAccents = (text?: string) =>
  text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-") ?? "";

export const getStateCode = (region: string) =>
  ({
    acre: "AC",
    alagoas: "AL",
    amapa: "AP",
    amazonas: "AM",
    bahia: "BA",
    ceara: "CE",
    "distrito-federal": "DF",
    "espirito-santo": "ES",
    goias: "GO",
    maranhao: "MA",
    "mato-grosso": "MT",
    "mato-grosso-do-sul": "MS",
    "minas-gerais": "MG",
    para: "PA",
    paraiba: "PB",
    parana: "PR",
    pernambuco: "PE",
    piaui: "PI",
    "rio-de-janeiro": "RJ",
    "rio-grande-do-norte": "RN",
    "rio-grande-do-sul": "RS",
    rondonia: "RO",
    roraima: "RR",
    "santa-catarina": "SC",
    "sao-paulo": "SP",
    sergipe: "SE",
    tocantins: "TO",
  })[removeAccents(region)] ?? region;
