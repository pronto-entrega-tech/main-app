import { Money } from '~/functions/money';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const weekDayNames = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;
export const weekDayArray = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
] as const;
export type WeekDay = typeof weekDayArray[number];

export type BusinessHours = {
  days: WeekDay[];
  open_time: string;
  close_time: string;
};

export type SpecialDays = {
  date: string;
  reason_code: number;
  reason_name: string;
  open_time: string;
  close_time: string;
};

export type Profile = {
  email: string;
  name: string;
  document: string | null;
  phone: string | null;
  debit: number | null;
};

export type Address = {
  id: string;
  nickname?: string | null;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement?: string | null;
  latitude?: number;
  longitude?: number;
  coords?: Coords;
};

export type Coords = { lat: number; lng: number };

export type PaymentCard = {
  id: string;
  customer_id: string;
  asaas_id: string;
  nickname?: string | null;
  brand: string;
  last4: string;
};

export type CreatePaymentCard = {
  nickname?: string;
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

export type UpdatePaymentCard = Pick<PaymentCard, 'id' | 'nickname'>;

export type Market = {
  market_id: string;
  name: string;
  city_slug: string;
  type: string;
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    complement?: string;
    coords: Coords;
  };
  business_hours: BusinessHours[];
  special_days: SpecialDays[];
  min_time: number;
  max_time: number;
  accept_scheduling: boolean;
  schedule_mins_interval?: number;
  schedule_max_days?: number;
  delivery_fee: Money;
  order_min: Money;
  rating?: number;
  reviews_count_lately?: number;
  reviews_count_total?: number;
  info: string;
  document: string;
  payments_accepted: string[];
};

export enum ItemOrderBy {
  Default = 'DEFAULT',
  Rating = 'RATING',
  DeliveryTime = 'DELIVERY_TIME',
  Distance = 'DISTANCE',
}

export type Product = {
  item_id: string;
  city_slug: string;
  prod_id: string;
  market_id: string;
  name: string;
  brand: string;
  quantity: string;
  price: Money;
  unit_weight?: number;
  images_names: string[];
  details: {
    name: string;
    quantity: number;
  }[];
  discount?: (
    | { type: 'DISCOUNT_VALUE'; value_1: Money }
    | {
        type: 'DISCOUNT_PERCENT' | 'DISCOUNT_PERCENT_ON_SECOND' | 'ONE_FREE';
        value_1: number;
      }
  ) & { value_2?: number; max_per_client: number };
};

export type ShoppingList = Map<string, { quantity: number; item: Product }>;

export type CreateOrder = {
  market_id: string;
  address_street: string;
  address_number: string;
  address_district: string;
  address_city: string;
  address_state: string;
  address_complement?: string | undefined;
  address_latitude: number;
  address_longitude: number;
  is_scheduled: boolean;
  /* schedule_hours: string; */
  paid_in_app: boolean;
  payment_method: PaymentMethod;
  payment_description: string;
  payment_change?: string;
  card_id?: string;
  client_total: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
};

export type RetryPayment =
  | { payment_method: 'PIX' }
  | { payment_method: 'CARD'; card_id: string };

export type CancelReason =
  | 'WRONG_PRODUCT'
  | 'WRONG_ADDRESS'
  | 'WRONG_PAYMENT_METHOD'
  | 'FORGOT_COUPON'
  | 'ORDER_BY_MISTAKE'
  | 'CANT_TAKE'
  | 'DELIVERY_TOO_LATE'
  | 'ORDER_IS_LATE'
  | 'OTHER';

export type CancelOrder = {
  reason?: CancelReason;
  message?: string;
};

export type ReviewOrder = {
  order_id: string;
  market_id: string;
  rating: number;
  complaint?: string[];
  message?: string;
};

export type Review = {
  rating: number;
  complaint: string[];
  message: string | null;
  response: string | null;
};

export type MarketRating = Pick<
  Market,
  'rating' | 'reviews_count_lately' | 'reviews_count_total'
> & {
  reviews: (Review & {
    order_id: string;
    customer: { name: string };
    created_at: string;
  })[];
};

type OrderStatus =
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REQUIRE_ACTION'
  | 'APPROVAL_PENDING'
  | 'PROCESSING'
  | 'DELIVERY_PENDING'
  | 'COMPLETING'
  | 'COMPLETED'
  | 'CANCELING'
  | 'CANCELED';

export type Order = Omit<CreateOrder, 'items' | 'card_id'> & {
  order_id: string;
  market_order_id: string;
  customer_id: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: Date;
  finished_at?: Date;
  delivery_min_time: Date;
  delivery_max_time: Date;
  delivery_fee: Money;
  total: Money;
  payment: {
    in_app: boolean;
    method: PaymentMethod;
    description: string;
    change: Money;
    pix_code?: string;
    pix_expires_at?: Date;
  };
  market_amount: string;
  debit_amount?: string;
  debit_market_id?: string;
  ip?: string;
  card_token?: string;
  payment_id?: string;
  customer_debit?: string;
  missing_items?: OrderMissingItem[];
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    complement?: string;
    coords: Coords;
  };
  market: { name: string };
  review: Review | null;
};

export type OrderItem = {
  prod_id: string | null;
  product: {
    name: string;
    brand: string;
    quantity: string;
  };
  quantity: string;
  price: string;
  is_kit: boolean;
  item_details: OrderItemDetails[];
};

type OrderItemDetails = {
  prod_id: string;
  quantity: string;
};

type OrderMissingItem = {
  order_item_id: string;
  quantity: string;
};

export type ProductOrder = {
  quantity: string;
  description: string;
  price: string;
  weight: string;
};

export type OrderPayment = {
  description: string;
  change?: Money;
  inApp: boolean;
  method: PaymentMethod;
  cardId?: string;
};

export type OrderSchedule = {
  dayText: string;
  dayNumber: number;
  hours: string;
  scheduled: boolean;
};

type PaymentMethod = 'CASH' | 'CARD' | 'PIX';

type ChatMessageAuthor = 'CUSTOMER' | 'MARKET';

export type ChatMsg = {
  id: string;
  customer_id: string;
  market_id: string;
  order_id: string;
  market_order_id: string;
  created_at: Date;
  author: ChatMessageAuthor;
  message: string;
};

export type CreateChatMsgDto = Pick<
  ChatMsg,
  'market_id' | 'order_id' | 'message'
>;
