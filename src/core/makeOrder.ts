import { Market } from '~/components/MarketItem';
import { saveOrdersList, getOrdersList } from '~/core/dataStorage';
import { ProductOrder } from '@pages/compras/pedido';
import { Money, moneyToString, add } from '~/functions/converter';
import { scheduleModel } from '@pages/carrinho';

export default async function makeOrder(
  activeMarket: Market,
  activeSchedule: scheduleModel,
  off: Money,
  cartSubtotal: Money,
  longAddress: {
    rua: string;
    bairro: string;
  },
  payment: {
    title?: string | undefined;
    sub?: string | undefined;
  },
  prodOrder: ProductOrder[]
) {
  /* const cart = [
    {
      label: 'Total',
      amount: (total.value / 100).toString(),
      type: 'final',
    },
  ] as ApplePay.CartSummaryItem[];
  if (payment.title === 'ApplePay') {
    const { error, paymentMethod } = await presentApplePay({
      country: 'BR',
      currency: 'BRL',
      cartItems: cart,
    });

    if (error) {
      console.error(error.code, error.message);
    } else {
      console.log(JSON.stringify(paymentMethod, null, 2));
      const clientSecret = await fetchPaymentIntentClientSecret(
        payment.title,
        cart
      );

      const { error: confirmApplePayError } = await confirmApplePayPayment(
        clientSecret
      );

      if (confirmApplePayError) {
        console.error(
          confirmApplePayError.code,
          confirmApplePayError.message
        );
      } else {
        console.log('Success', 'The payment was confirmed successfully!');
      }
    }
  } else if (payment.title === 'GooglePay') {
    const {
      initGooglePay,
      presentGooglePay,
      loading,
      createGooglePayPaymentMethod,
    } = useGooglePay();

    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: (total.value / 100).toString(),
      currencyCode: 'BRL',
    });
  } */
  const scheduled = activeSchedule.scheduled;

  const d = new Date();
  const padZero = (time: number) => time.toString().padStart(2, '0');

  const time = `${d.getHours()}:${padZero(d.getMinutes())}`;

  const day = padZero(d.getDay());
  const month = padZero(d.getMonth());
  const year = d.getFullYear();
  const date = `${day}/${month}/${year}`;

  const orderDate = `${time} - ${date}`;

  const deliveryTime = (() => {
    if (scheduled) return activeSchedule.horarios;

    const minDate = new Date(d.getTime() + activeMarket.min_time * 60000);
    const maxDate = new Date(d.getTime() + activeMarket.max_time * 60000);
    const minTime = `${minDate.getHours()}:${padZero(minDate.getMinutes())}`;
    const maxTime = `${maxDate.getHours()}:${padZero(maxDate.getMinutes())}`;
    return `${minTime} - ${maxTime}`;
  })();

  const list = await getOrdersList();
  saveOrdersList([
    {
      marketName: activeMarket.name,
      marketId: activeMarket.market_id,
      orderMarketId: list.length + 1,
      prodList: prodOrder,
      scheduled: scheduled,
      deliveryTime,
      date: orderDate,
      subtotal: moneyToString(cartSubtotal),
      discount: moneyToString(off),
      deliveryFee: moneyToString(activeMarket.fee),
      total: moneyToString(add(cartSubtotal, activeMarket.fee)),
      address:
        longAddress.rua +
        (longAddress.bairro ? ' - ' + longAddress.bairro : ''),
      payment: payment.title ?? 'Dinheiro',
    },
    ...list,
  ]);
}
