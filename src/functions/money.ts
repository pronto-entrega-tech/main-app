import { Product } from '~/core/models';

export type Money = {
  /**
   * `$10.00` will be `1000`, so be careful and use the money functions to manage this value.
   */
  readonly dangerousInnerValue: number;
};
const createMoney = (raw: unknown): Money => {
  if ((raw as Money).dangerousInnerValue) return raw as Money;

  const _raw = `${raw}`.replace(/,/g, '.').replace(/(?![\.])\D/g, '');
  const [v1, v2 = ''] = _raw.split('.');

  return { dangerousInnerValue: +`${v1}${v2.padEnd(2, '0')}` };
};

type MoneyValue = Money | number;
const moneyInnerValue = (v: MoneyValue) =>
  typeof v === 'number' ? v : v.dangerousInnerValue;

const plus = (v1: MoneyValue, v2: MoneyValue): Money => ({
  dangerousInnerValue: Math.round(moneyInnerValue(v1) + moneyInnerValue(v2)),
});

const minus = (v1: MoneyValue, v2: MoneyValue): Money => ({
  dangerousInnerValue: Math.round(moneyInnerValue(v1) - moneyInnerValue(v2)),
});

const times = (v1: MoneyValue, v2: MoneyValue): Money => ({
  dangerousInnerValue: Math.round(moneyInnerValue(v1) * moneyInnerValue(v2)),
});

const dividedBy = (v1: MoneyValue, v2: MoneyValue): Money => ({
  dangerousInnerValue: Math.round(moneyInnerValue(v1) / moneyInnerValue(v2)),
});

const isEqual = (v1: MoneyValue, v2: MoneyValue) =>
  moneyInnerValue(v1) === moneyInnerValue(v2);

const isLess = (v1: MoneyValue, v2: MoneyValue) =>
  moneyInnerValue(v1) < moneyInnerValue(v2);

const isGreater = (v1: MoneyValue, v2: MoneyValue) =>
  moneyInnerValue(v1) > moneyInnerValue(v2);

const toString = (money?: MoneyValue, prefix = '', separator = ',') => {
  if (!money) return '';

  const value =
    typeof money === 'number'
      ? `${money}`.replace(/\D/g, '')
      : `${money.dangerousInnerValue}`.padStart(3, '0');

  return `${prefix}${value.slice(0, -2)}${separator}${value.slice(-2)}`;
};

const toValue = (money?: MoneyValue) =>
  money ? toString(money, '', '.') : undefined;

export const money = Object.assign(createMoney, {
  plus,
  minus,
  times,
  dividedBy,
  isEqual,
  isLess,
  isGreater,
  toString,
  toValue,
});

export const calcPrices = (product: Product) => {
  const { price, discount } = product;

  if (discount?.type === 'DISCOUNT_VALUE') {
    const diff = moneyInnerValue(discount.value_1) / moneyInnerValue(price);
    const off = Math.trunc((1 - diff) * 100);

    return {
      price: discount.value_1,
      previous_price: price,
      discountText: `-${off}%`,
    };
  }

  if (discount?.type === 'DISCOUNT_PERCENT') {
    const off = discount.value_1;
    const newPricePercent = 1 - off / 100;

    return {
      price: times(price, newPricePercent),
      previous_price: price,
      discountText: `-${off}%`,
    };
  }

  if (discount?.type === 'DISCOUNT_PERCENT_ON_SECOND') {
    const percent = discount.value_1;
    const min = discount.value_2 ?? 2;

    return {
      price,
      discountText: `-${percent}% na ${min}º Un.`,
    };
  }

  if (discount?.type === 'ONE_FREE') {
    const take = discount.value_1;
    const pay = discount.value_1 - (discount.value_2 ?? 1);

    return {
      price,
      discountText: `Leve ${take} e pague ${pay}`,
    };
  }

  return { price };
};
