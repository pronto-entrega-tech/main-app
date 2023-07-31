import { Product, ShoppingList } from '~/core/models';
import { money, calcPrices } from './money';

export const calcSubtotal = (shoppingList: ShoppingList) => {
  const initial = {
    subtotal: money('0'),
    totalOff: money('0'),
  };

  return [...shoppingList.values()].reduce((p, { item, quantity }) => {
    const res = calcItemTotalWithOff(item, quantity);

    return {
      subtotal: money.plus(p.subtotal, res.total),
      totalOff: money.plus(p.totalOff, res.off ?? 0),
    };
  }, initial);
};

const calcItemTotalWithOff = (item: Product, quantity: number) => {
  const max = (quantity: number) => {
    const maxQuantity = item.discount?.max_per_client ?? Infinity;
    return quantity < maxQuantity ? quantity : maxQuantity;
  };

  if (item.discount?.type === 'DISCOUNT_PERCENT_ON_SECOND') {
    const minQuantity = item.discount.value_2 ?? 2;

    if (quantity < minQuantity)
      return { total: money.times(item.price, quantity) };

    const off = item.discount.value_1;
    const newPricePercent = 1 - off / 100;

    const newPrice = money.times(item.price, newPricePercent);

    const quantityWithOff = max(quantity - (minQuantity - 1));
    const quantityWithoutOff = quantity - quantityWithOff;

    const totalWithoutOff = money.times(item.price, quantityWithoutOff);
    const totalWithOff = money.times(newPrice, quantityWithOff);

    return {
      total: money.plus(totalWithoutOff, totalWithOff),
      off: money.times(
        money.minus(item.price, newPrice),
        quantity - (minQuantity - 1)
      ),
    };
  } else if (item.discount?.type === 'ONE_FREE') {
    const minQuantity = item.discount.value_1;

    if (quantity < minQuantity)
      return { total: money.times(item.price, quantity) };

    const freeNumber = item.discount.value_2 ?? 1;
    const freeQuantity = max(freeNumber * Math.trunc(quantity / minQuantity));

    return {
      total: money.times(item.price, quantity - freeQuantity),
      off: money.times(item.price, freeQuantity),
    };
  } else {
    const { price, previous_price } = calcPrices(item);
    const off = (() => {
      if (!previous_price) return;

      const priceDiference = money.minus(previous_price, price);
      return money.times(priceDiference, quantity);
    })();

    const total = (() => {
      if (!item.discount?.max_per_client) return money.times(price, quantity);

      const quantityWithOff = max(quantity);
      const quantityWithoutOff = quantity - quantityWithOff;

      const totalWithoutOff = money.times(item.price, quantityWithoutOff);
      const totalWithOff = money.times(price, quantityWithOff);

      return money.plus(totalWithoutOff, totalWithOff);
    })();

    return { total, off };
  }
};
