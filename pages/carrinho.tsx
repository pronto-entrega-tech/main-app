import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import useMyContext from '~/core/MyContext';
import IconButton from '~/components/IconButton';
import { Market } from '~/components/MarketItem';
import MyTouchable from '~/components/MyTouchable';
import MyButton from '~/components/MyButton';
import { Product } from '~/components/ProdItem';
import ProdList from '~/components/ProdList';
import ProdListHorizontal from '~/components/ProdListHorizontal';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import {
  getLongAddress,
  saveShoppingList,
  getActiveMarket,
  saveActiveMarketId,
  saveOrdersList,
  getOrdersList,
  getActiveMarketId,
  getLastPayment,
  saveLastPayment,
  getCity,
} from '~/core/dataStorage';
import { ProductOrder } from './compras/pedido';
import MyText from '~/components/MyText';
import {
  fetchPaymentIntentClientSecret,
  getMarket,
  getProdFeedByMarket,
} from '~/services/requests';
import Header from '~/components/Header';
import {
  money,
  Money,
  moneyToString,
  isMarketOpen,
  getImageUrl,
  add,
  sub,
  multiply,
} from '~/functions/converter';
import Loading, { Errors, myErrors } from '~/components/Loading';
import useRouting from '~/hooks/useRouting';
import MyDivider from '~/components/MyDivider';
import { useConnection } from '~/functions/connection';
import MyIcon from '~/components/MyIcon';
import { isScheduleEqual } from './agendamento';
import AnimatedText from '~/components/AnimatedText';
/* import {
  ApplePay,
  confirmApplePayPayment,
  presentApplePay,
} from '@stripe/stripe-react-native'; */

export interface scheduleModel {
  dia: string;
  diaDoMes: number;
  horarios: string;
  scheduled: boolean;
}

const extraWidth = device.android ? 0 : 10;
function CartHeader({
  entregar,
  setEntregar,
  setIsLoading,
}: {
  entregar: boolean;
  setEntregar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const routing = useRouting();
  const { setShoppingList, setSubtotal, setActiveMarketId } = useMyContext();
  const [state] = React.useState({
    indicator: new Animated.Value(0),
  });

  useEffect(() => {
    if (entregar) {
      Animated.timing(state.indicator, {
        toValue: 0,
        duration: 175,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(state.indicator, {
        toValue: 80 + extraWidth,
        duration: 175,
        useNativeDriver: true,
      }).start();
    }
  }, [entregar, state.indicator]);

  return (
    <View
      style={[
        globalStyles.notch,
        { backgroundColor: myColors.background },
        device.web && { position: 'fixed' as any, width: '100%', zIndex: 1 },
      ]}>
      <View style={styles.headerConteiner}>
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => routing.goBack()}
        />
        <View style={styles.headerButtonsConteiner}>
          <MyButton
            onPress={() => setEntregar(true)}
            title='Entregar'
            type='clear'
            titleStyle={{
              color: entregar ? myColors.primaryColor : myColors.grey,
            }}
            buttonStyle={styles.headerButtons1}
          />
          <MyButton
            onPress={() => setEntregar(false)}
            title='Retirar'
            type='clear'
            titleStyle={{
              color: !entregar ? myColors.primaryColor : myColors.grey,
            }}
            buttonStyle={styles.headerButtons2}
          />
        </View>
        <MyButton
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
              setShoppingList(new Map());
              saveShoppingList(new Map());
              setActiveMarketId('');
              saveActiveMarketId('');
              setSubtotal(money('0'));
            }, 50);
            setTimeout(() => {
              routing.goBack();
            }, 300);
          }}
          titleStyle={{ color: myColors.primaryColor }}
          title='Limpar carrinho'
          type='clear'
        />
      </View>
      <MyDivider style={{ marginTop: -1 }} />
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: state.indicator }],
            width: entregar ? 80 + extraWidth : 70 + extraWidth,
          },
        ]}
      />
    </View>
  );
}

function updateCart(
  shoppingList: Map<string, { quantity: number; item: Product }>,
  setSubtotal: (subtotal: Money) => void,
  setOff: (off: Money) => void,
  setTotal: (total: Money) => void,
  setProdOrder: React.Dispatch<React.SetStateAction<ProductOrder[]>>,
  setProdList: React.Dispatch<React.SetStateAction<Product[] | undefined>>,
  setReadySubtotal: React.Dispatch<React.SetStateAction<boolean>>
) {
  let subtotal = money('0');
  let totalOff = money('0');
  let prodList = [] as Product[];
  let prodOrder = [] as ProductOrder[];
  const keys = Array.from(shoppingList.keys());

  for (const i in keys) {
    const key = keys[i];
    const quantity = shoppingList.get(key)?.quantity;
    const item = shoppingList.get(key)?.item;

    if (!item || !quantity) return;

    subtotal = add(subtotal, multiply(item.price, quantity));

    if (item.previous_price) {
      const priceDiference = sub(item.previous_price, item.price);
      totalOff = add(totalOff, multiply(priceDiference, quantity));
    }

    prodList = [...prodList, item];
    prodOrder = [
      ...prodOrder,
      {
        quantity: quantity.toString(),
        description: `${item.name} ${item.brand}`,
        price: moneyToString(item.price, 'R$'),
        weight: item.quantity,
      },
    ];
  }
  setSubtotal(subtotal);
  setOff(totalOff);
  setTotal(add(subtotal, totalOff));
  setProdOrder(prodOrder);
  setProdList(prodList);

  setReadySubtotal(true);
}

function updateSchedule(
  { business_hours, min_time, max_time }: Market,
  setSchedules: React.Dispatch<
    React.SetStateAction<{ isOpen: Boolean; list: scheduleModel[] }>
  >,
  setActiveSchedule: React.Dispatch<
    React.SetStateAction<scheduleModel | undefined>
  >
) {
  let scheduleList = [] as scheduleModel[];
  const date = new Date();
  const min = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();

  const { isOpen, open_time, close_time } = isMarketOpen(business_hours);
  const [openHour_, openMin] = open_time.split(':');
  const [closeHour_] = close_time.split(':');
  const openHour = +openHour_;
  const closeHour = +closeHour_;

  const dayText = hours < closeHour ? 'Hoje' : 'Amanhã';
  const dayText2 = hours < closeHour ? day : day + 1;

  const deliveryHour = hours + (min + min_time) / 60;
  if (isOpen) {
    const schedule: scheduleModel = {
      dia: dayText,
      diaDoMes: dayText2,
      horarios: `${min_time} - ${max_time} min`,
      scheduled: false,
    };
    scheduleList = [schedule];
    setActiveSchedule(schedule);
  } else {
    setActiveSchedule(undefined);
  }

  for (let i = openHour; i < closeHour; i++) {
    if (deliveryHour < i || hours >= closeHour) {
      const i2 = i + 1 < closeHour ? i + 1 : closeHour;
      const schedule: scheduleModel = {
        dia: dayText,
        diaDoMes: dayText2,
        horarios: `${i}:${openMin} - ${i2}:${openMin}`,
        scheduled: true,
      };
      scheduleList = [...scheduleList, schedule];
    }
  }
  setSchedules({ isOpen, list: scheduleList });
}

function marketAddress(address: Market['address']) {
  return `${address.street}, ${address.number} - ${address.district}`;
}

function Cart() {
  const routing = useRouting();
  const [tryAgain, setTryAgain] = useState(false);
  const [error, setError] = useState<myErrors>(null);
  const [readySubtotal, setReadySubtotal] = useState(false);
  const [readyActiveMarket, setReadyActiveMarket] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [entregar, setEntregar] = useState<boolean>(true);
  const [longAddress, setLongAddress] = useState<{
    rua: string;
    bairro: string;
  } | null>(null);
  const [payment, setPayment] = useState<{ title?: string; sub?: string }>();
  const [activeMarket, setActiveMarket] = useState<Market>();
  const [activeSchedule, setActiveSchedule] = useState<scheduleModel>();
  const [schedules, setSchedules] = useState<{
    isOpen: Boolean;
    list: scheduleModel[];
  }>({ isOpen: false, list: [] });
  const [cartSubtotal, setCartSubtotal] = useState<Money>(money('0'));
  const [off, setOff] = useState<Money>();
  const [total, setTotal] = useState<Money>();
  const [prodList, setProdList] = useState<Product[]>();
  const [buyTooList, setBuyTooList] = useState<Product[]>();
  const [ready, setReady] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [prodOrder, setProdOrder] = useState<ProductOrder[]>([]);
  const {
    refresh,
    isGuest,
    shoppingList,
    setShoppingList,
    setActiveMarketId,
    setSubtotal,
  } = useMyContext();
  const hasInternet = useConnection();

  React.useEffect(() => {
    setError(!hasInternet ? 'connection' : null);
  }, [hasInternet]);

  useEffect(() => {
    setReadyActiveMarket(false);

    getLastPayment().then((lastPayment) => {
      if (lastPayment) setPayment(lastPayment);
    });

    const setup = async (activeMarket: Market) => {
      try {
        const city = await getCity();
        const products = await getProdFeedByMarket(
          city,
          activeMarket.market_id
        );
        setBuyTooList(products);
      } catch {
        setError('server');
      }

      setActiveMarket(activeMarket);
      updateSchedule(activeMarket, setSchedules, setActiveSchedule);
      setReadyActiveMarket(true);
    };

    getActiveMarket()
      .then(async (activeMarket) => {
        if (activeMarket) return setup(activeMarket);

        const market_id = await getActiveMarketId();
        if (!market_id) return setError('nothing');

        const city = await getCity();

        const data = await getMarket(city, market_id);
        if (!data) return setError('nothing_market');

        setup(data);
      })
      .catch(() => setError('server'));
  }, []);

  useEffect(() => {
    setReadySubtotal(false);
    updateCart(
      shoppingList,
      setCartSubtotal,
      setOff,
      setTotal,
      setProdOrder,
      setProdList,
      setReadySubtotal
    );
  }, [refresh, shoppingList]);

  useEffect(() => {
    const callback = routing.params.callback;
    const value = routing.params.value;
    if (callback === 'refresh' || !longAddress) {
      getLongAddress().then(setLongAddress); // getLongAddress first render here
    }
    if (!value) return;
    if (callback === 'activeSchedule') {
      setActiveSchedule(JSON.parse(value));
    }
    if (callback === 'payment') {
      const payment = JSON.parse(value);
      setPayment(payment);
      saveLastPayment(payment);
    }
  }, [longAddress, routing.params.callback, routing.params.value]);

  useEffect(() => {
    if (activeMarket) {
      if (
        cartSubtotal.dangerousInnerValue <
        activeMarket.order_min.dangerousInnerValue
      ) {
        setButtonText(
          `Subtotal mínimo de R$${moneyToString(activeMarket.order_min)}`
        );
      } else if (longAddress?.rua === '') {
        setButtonText('Escolha um endereço');
      } else if (!payment && !isGuest) {
        setButtonText('Escolha um meio de pagamento');
      } else if (!activeSchedule) {
        setButtonText('Escolha um horário');
      } else if (isGuest) {
        setButtonText('Entre ou cadastre-se');
      } else {
        setReady(true);
        setButtonText('Fazer pedido');
        return;
      }
    }
    setReady(false);
  }, [
    cartSubtotal,
    longAddress,
    payment,
    activeMarket,
    activeSchedule,
    isGuest,
  ]);

  useEffect(() => {
    setIsLoading(!readySubtotal || !readyActiveMarket);
  }, [readySubtotal, readyActiveMarket]);

  const makePayment = async () => {
    if (!(activeMarket && activeSchedule && off && total && longAddress))
      return;

    setIsLoading(true);
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
    const orderDate = `${d.getHours()}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${d.getDay().toString().padStart(2, '0')}/${d
      .getMonth()
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
    let previsao: string;
    if (!scheduled) {
      const date1 = new Date(d.getTime() + activeMarket.min_time * 60000);
      const date2 = new Date(d.getTime() + activeMarket.max_time * 60000);
      previsao = `${date1.getHours()}:${date1
        .getMinutes()
        .toString()
        .padStart(2, '0')} - ${date2.getHours()}:${date2
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      previsao = activeSchedule.horarios;
    }
    getOrdersList().then((list) => {
      saveOrdersList([
        {
          marketName: activeMarket.name,
          marketId: activeMarket.market_id,
          orderMarketId: list.length + 1,
          prodList: prodOrder,
          scheduled: scheduled,
          deliveryTime: previsao,
          date: orderDate,
          subtotal: moneyToString(cartSubtotal),
          discount: moneyToString(off),
          deliveryFee: moneyToString(activeMarket.fee),
          total: moneyToString(add(cartSubtotal, activeMarket.fee)),
          address:
            longAddress.rua +
            (longAddress.bairro ? ' - ' + longAddress.bairro : ''),
          payment: payment?.title ?? '',
        },
        ...list,
      ]).then(() => {
        saveShoppingList(new Map());
        setShoppingList(new Map());
        setSubtotal(money('0'));
        setCartSubtotal(money('0'));
        setActiveMarketId('');
        saveActiveMarketId('');

        if (payment?.title === 'Dinheiro')
          saveLastPayment({ title: 'Dinheiro', sub: 'Sem troco' });

        routing.pop(1);
        routing.navigate('/compras');
      });
    });
  };

  if (!prodList?.length)
    return (
      <>
        <Header />
        <View
          style={{
            ...globalStyles.centralizer,
            backgroundColor: myColors.background,
          }}>
          <MyText style={{ fontSize: 15, color: myColors.text2 }}>
            Carrinho vazio
          </MyText>
        </View>
      </>
    );

  if (error || !activeMarket)
    return (
      <>
        <Header />
        <Errors
          error={error}
          onPress={() => {
            setError(null);
            setTryAgain(!tryAgain);
          }}
        />
      </>
    );

  if (isLoading) return <Loading />;

  const ListHeader = (
    <View>
      {isGuest && (
        <>
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <MyText
              style={{
                color: myColors.text2,
                fontSize: 20,
                fontFamily: myFonts.Medium,
              }}>
              Falta pouco!
            </MyText>
            <MyText
              style={{ marginTop: 8, color: myColors.text, fontSize: 16 }}>
              Pra concluir o pedido, precisamos que você se identifique
              primeiro.
            </MyText>
            <MyButton
              title='Entrar ou cadastrar-se'
              buttonStyle={{ marginTop: 12 }}
              onPress={() => routing.navigate('/entrar', 'return')}
            />
          </View>
          <MyDivider style={styles.divider} />
        </>
      )}

      <MyTouchable
        disabled={!entregar}
        path='/endereco'
        params={{ return: 'cart' }}
        style={styles.addressConteiner}>
        <MyIcon
          name={entregar ? 'home-map-marker' : 'map-marker-radius'}
          size={28}
          style={{ marginLeft: -2 }}
        />
        <View style={{ marginLeft: 8 }}>
          <MyText style={styles.topText}>
            {entregar ? 'Entregar' : 'Retirar'} em
          </MyText>
          <MyText style={styles.addressText}>
            {entregar
              ? !longAddress
                ? 'Carregando...'
                : longAddress.rua || 'Escolha um endereço' // `||` don't catch empty strings
              : marketAddress(activeMarket?.address)}
          </MyText>
          {entregar &&
            longAddress?.bairro !== '' &&
            longAddress?.rua !== '' && (
              <MyText style={styles.addressSubtext}>
                {longAddress?.bairro}
              </MyText>
            )}
        </View>
        {!entregar && (
          <MyIcon
            name='chevron-right'
            size={36}
            color={myColors.grey2}
            style={styles.rightIcon}
          />
        )}
      </MyTouchable>

      <MyDivider style={styles.divider2} />

      {!isGuest && (
        <>
          <MyTouchable
            onPress={() =>
              routing.navigate('/pagamento', {
                total: total?.dangerousInnerValue,
              })
            }
            style={styles.addressConteiner}>
            <MyIcon name='credit-card-outline' size={28} />
            <View style={{ marginLeft: 8 }}>
              <MyText style={styles.topText}>Meio de pagamento</MyText>
              <MyText style={styles.addressText}>
                {payment?.title ?? 'Escolha um meio de pagamento'}
              </MyText>
              {!!payment?.sub && (
                <MyText style={styles.addressSubtext}>{payment.sub}</MyText>
              )}
            </View>
            <MyIcon
              name='chevron-right'
              size={36}
              color={myColors.grey2}
              style={styles.rightIcon}
            />
          </MyTouchable>
          <MyDivider style={styles.divider2} />
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <MyText style={styles.scheduleText}>
          {!activeSchedule
            ? 'Escolha um horário'
            : `${activeSchedule.dia}, ${activeSchedule.horarios}`}
        </MyText>
        {schedules.list.length !== 0 && (
          <MyButton
            title='Ver horários'
            type='clear'
            titleStyle={{ color: myColors.primaryColor }}
            buttonStyle={{
              minHeight: 0,
              marginBottom: -4,
              height: 36,
              paddingHorizontal: 16,
            }}
            onPress={() =>
              routing.navigate('/agendamento', {
                active: JSON.stringify(activeSchedule),
                list: JSON.stringify(schedules.list),
              })
            }
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scheduleConteiner}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {schedules.list.map((item, index) => {
          const active = isScheduleEqual(item, activeSchedule);
          return (
            <View key={index} style={{ borderRadius: 10 }}>
              <MyTouchable
                onPress={() => {
                  setActiveSchedule(item);
                }}
                style={[
                  styles.scheduleCardBase,
                  active
                    ? styles.scheduleCardActive
                    : styles.scheduleCardInactive,
                  active ? globalStyles.elevation4 : globalStyles.elevation1,
                ]}>
                <>
                  <MyText
                    style={{
                      color: active ? myColors.primaryColor : myColors.text2,
                      fontFamily: myFonts.Bold,
                    }}>
                    {schedules.isOpen && index === 0 ? 'Padrão' : 'Agendar'}
                  </MyText>
                  <MyText style={{ color: myColors.text4, fontSize: 15 }}>
                    {item.dia}
                  </MyText>
                  <MyText style={{ color: myColors.text4 }}>
                    {item.horarios}
                  </MyText>
                </>
              </MyTouchable>
            </View>
          );
        })}
      </ScrollView>

      <MyDivider style={styles.divider} />
      <View style={{ minHeight: 231, backgroundColor: '#FCFCFC' }}>
        <MyText style={styles.orderTooText}>Peça também</MyText>
        {!buyTooList ? (
          <Loading />
        ) : (
          <ProdList
            horizontal
            refreshless
            hideMarketLogo
            style={{ paddingRight: 8, paddingTop: 8 }}
            data={buyTooList}
          />
        )}
      </View>

      <MyDivider style={[styles.divider, { marginBottom: 4 }]} />
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceText}>Subtotal</MyText>
        <AnimatedText style={styles.priceText} distace={10}>
          {cartSubtotal}
        </AnimatedText>
      </View>
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceText}>Economizado</MyText>
        <AnimatedText
          style={[styles.priceText, { color: '#E00000' }]}
          distace={10}>
          {off ?? money('0')}
        </AnimatedText>
      </View>
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceText}>
          {entregar ? 'Taxa de entrega' : 'Retirada'}
        </MyText>
        <MyText
          style={[
            styles.priceText,
            (activeMarket.fee.dangerousInnerValue === 0 || !entregar) && {
              color: '#109c00',
            },
          ]}>
          {activeMarket.fee.dangerousInnerValue === 0 || !entregar
            ? 'Grátis'
            : moneyToString(activeMarket.fee, 'R$')}
        </MyText>
      </View>
      <MyDivider
        style={{ backgroundColor: myColors.divider2, marginHorizontal: 16 }}
      />
      <View style={styles.priceTotalConteiner}>
        <MyText style={styles.priceTotalText}>Total</MyText>
        <AnimatedText style={styles.priceTotalText}>
          {total ?? money('0')}
        </AnimatedText>
      </View>
      <MyDivider style={[styles.divider, { marginTop: 4 }]} />
      <MyTouchable
        onPress={() => routing.navigate('/cupons')}
        style={styles.cupomConteiner}>
        <MyIcon name='ticket-percent' size={48} />
        <View style={styles.cupomTextConteiner}>
          <MyText style={{ color: myColors.text5, fontSize: 16 }}>Cupom</MyText>
          <MyText style={{ color: myColors.text4 }}>Insira um código</MyText>
        </View>
        <MyIcon
          name='chevron-right'
          size={36}
          color={myColors.grey2}
          style={styles.rightIcon}
        />
      </MyTouchable>
      <MyDivider style={styles.divider} />
      <View style={styles.prodListTopbar}>
        <Image
          style={{ height: 48, width: 48, borderRadius: 48 }}
          source={{ uri: getImageUrl('market', activeMarket.market_id) }}
        />
        <MyText style={styles.marketName}>{activeMarket.name}</MyText>
      </View>
    </View>
  );

  return (
    <View style={[{ backgroundColor: myColors.background, flex: 1 }]}>
      <CartHeader
        entregar={entregar}
        setEntregar={setEntregar}
        setIsLoading={setIsLoading}
      />
      <ProdListHorizontal
        hideMarketLogo
        style={{
          paddingTop: device.web ? 56 : 0,
          paddingBottom: device.iOS ? 98 : 66,
        }}
        header={ListHeader}
        data={prodList}
      />
      <MyButton
        title={buttonText}
        disabled={!ready}
        buttonStyle={styles.buttonConteiner}
        onPress={() => makePayment().catch(() => setIsLoading(false))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonsConteiner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 52,
  },
  indicator: {
    marginTop: -2,
    height: 2,
    backgroundColor: myColors.primaryColor,
    marginLeft: 52,
  },
  headerButtons1: {
    height: 56,
    width: 80 + extraWidth,
    justifyContent: 'center',
  },
  headerButtons2: {
    height: 56,
    width: 70 + extraWidth,
    justifyContent: 'center',
  },
  divider: {
    height: 2,
  },
  divider2: {
    backgroundColor: myColors.divider2,
    marginHorizontal: 16,
  },
  addressConteiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 12,
  },
  topText: {
    color: myColors.text4,
  },
  addressText: {
    marginRight: 48,
    fontSize: 16,
    color: myColors.text5,
  },
  addressSubtext: {
    marginRight: 48,
    color: myColors.text,
  },
  scheduleText: {
    marginLeft: 16,
    top: device.iOS ? 6 : 2,
    color: myColors.text5,
    fontSize: 16,
  },
  scheduleButton: {
    marginLeft: 16,
    top: 8.5,
    color: myColors.text5,
    fontSize: 16,
  },
  scheduleConteiner: {
    paddingRight: 8,
  },
  scheduleCardBase: {
    marginLeft: 8,
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 92,
    borderRadius: 10,
  },
  scheduleCardActive: {
    borderColor: myColors.primaryColor,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
  },
  scheduleCardInactive: {
    borderColor: myColors.divider,
    backgroundColor: myColors.background,
    borderWidth: 1,
  },
  orderTooText: {
    height: 30,
    marginLeft: 16,
    paddingTop: 8,
    color: myColors.text5,
    fontSize: 16,
  },
  priceConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  priceTotalConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  priceText: {
    fontSize: 16,
    color: myColors.text4,
  },
  priceTotalText: {
    fontSize: 20,
    color: myColors.text5,
  },
  cupomConteiner: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cupomTextConteiner: {
    marginLeft: 8,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
  prodListTopbar: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  marketName: {
    color: myColors.text4,
    fontSize: 20,
    marginLeft: 16,
    fontFamily: 'Medium',
  },
  buttonConteiner: {
    width: '95%',
    position: (device.web ? 'fixed' : 'absolute') as any,
    bottom: device.iOS ? 36 : 6,
    alignSelf: 'center',
    height: 58,
  },
});

export default Cart;
