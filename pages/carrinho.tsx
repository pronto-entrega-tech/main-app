import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import IconButton from '~/components/IconButton';
import MyTouchable from '~/components/MyTouchable';
import MyButton from '~/components/MyButton';
import ProdList from '~/components/ProdList';
import ProdListHorizontal from '~/components/ProdListHorizontal';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import {
  Address,
  Coords,
  Market,
  OrderPayment,
  OrderSchedule,
  Product,
  Profile,
  SetState,
  ShoppingList,
  weekDayNames,
} from '~/core/models';
import MyText from '~/components/MyText';
import MyHeader from '~/components/MyHeader';
import {
  getImageUrl,
  addToArray,
  stringifyShortAddress,
  isScheduleEqual,
  omit,
} from '~/functions/converter';
import { isMarketOpen } from '~/functions/marketOpenness';
import { Money, money } from '~/functions/money';
import Loading from '~/components/Loading';
import Errors, { MyErrors } from '~/components/Errors';
import useRouting from '~/hooks/useRouting';
import MyDivider from '~/components/MyDivider';
import { useConnection } from '~/functions/connection';
import MyIcon from '~/components/MyIcon';
import AnimatedText from '~/components/AnimatedText';
import { useCartContext } from '~/contexts/CartContext';
import { useAuthContext } from '~/contexts/AuthContext';
import { useAddressContext } from '~/contexts/AddressContext';
import { useOrderContext } from '~/contexts/OrderContext';
import { ChangeModal } from '~/screens/PaymentOnDelivery';
import { saveConfirmationToken } from '~/core/dataStorage';
import { api } from '~/services/api';
import { appOrSite } from '~/constants/device';
import { WithToast } from '~/components/Layout';
import { range } from '~/functions/range';
import HeaderContainer from '~/components/HeaderContainer';
import useMyContext from '~/core/MyContext';
import { minute, hour } from '~/constants/time';

type OrderDto = {
  accessToken: string;
  market: Market;
  address: Address;
  coords: Coords;
  payment: OrderPayment;
  shoppingList: ShoppingList;
  activeSchedule: OrderSchedule;
};

const extraWidth = device.android ? 0 : 10;

const CartHeader = ({
  isDelivery,
  setIsDelivery,
  setIsExiting,
}: {
  isDelivery: boolean;
  setIsDelivery: SetState<boolean>;
  setIsExiting: SetState<boolean>;
}) => {
  const routing = useRouting();
  const { cleanCart } = useCartContext();
  const tabState = useRef({
    indicator: new Animated.Value(0),
  }).current;

  useEffect(() => {
    Animated.timing(tabState.indicator, {
      toValue: isDelivery ? 0 : 80 + extraWidth,
      duration: 175,
      useNativeDriver: !device.web,
    }).start();
  }, [isDelivery, tabState.indicator]);

  const emptyCard = () => {
    setIsExiting(true);

    cleanCart();
    routing.goBack();
  };

  return (
    <HeaderContainer
      style={[globalStyles.notch, { backgroundColor: myColors.background }]}>
      <View style={styles.headerContainer}>
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => routing.goBack()}
        />
        <View style={styles.headerButtonsContainer}>
          <MyButton
            onPress={() => setIsDelivery(true)}
            title='Entregar'
            type='clear'
            titleStyle={{
              color: isDelivery ? myColors.primaryColor : myColors.grey,
            }}
            buttonStyle={styles.headerButtons1}
          />
          <MyButton
            onPress={() => setIsDelivery(false)}
            title='Retirar'
            type='clear'
            titleStyle={{
              color: !isDelivery ? myColors.primaryColor : myColors.grey,
            }}
            buttonStyle={styles.headerButtons2}
          />
        </View>
        <MyButton
          onPress={emptyCard}
          titleStyle={{ color: myColors.primaryColor }}
          title='Esvaziar'
          type='clear'
        />
      </View>
      <MyDivider style={{ marginTop: -1 }} />
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: tabState.indicator }],
            width: (isDelivery ? 80 : 70) + extraWidth,
          },
        ]}
      />
    </HeaderContainer>
  );
};

type MarketTime = ReturnType<typeof getUpdatedSchedule>['marketTime'];

const getUpdatedSchedule = ({
  business_hours,
  min_time,
  max_time,
  schedule_mins_interval,
  schedule_max_days,
}: Market) => {
  const date = new Date();
  const hoursNow = date.getHours();
  const minsNow = date.getMinutes();
  const today = date.getDay();

  const { isOpen, nextHour, intervals } = isMarketOpen(
    business_hours,
    schedule_max_days,
  );

  const activeSchedule = (() => {
    if (!isOpen) return;

    const [{ close_time }] = intervals;
    const closeHour = +close_time.split(':')[0];
    const isToday = hoursNow < closeHour;

    const schedule: OrderSchedule = {
      dayText: isToday ? 'Hoje' : 'Amanhã',
      dayNumber: isToday ? today : (today + 1) % 7,
      hours: `${min_time} - ${max_time} min`,
      scheduled: false,
    };
    return schedule;
  })();

  const scheduleList = (() => {
    if (!schedule_mins_interval) return;

    const toMins = (time: string) => {
      const [hours, mins] = time.split(':');
      return +hours * 60 + +mins;
    };
    const formatMin = (mins: number) =>
      `${Math.trunc(mins / 60)}:${`${mins % 60}`.padStart(2, '0')}`;

    const delay = 60;
    const step = schedule_mins_interval;

    const minsList = intervals.map((interval) => {
      const { day, open_time, close_time } = interval;

      const first = intervals.find((v) => v.day === day);
      const _delay = interval === first ? delay : 0;

      return {
        day,
        mins: range(toMins(open_time) + _delay, toMins(close_time), step),
      };
    });

    const deliverableHour = (hoursNow + (minsNow + min_time) / 60) % 12;

    return minsList.reduce((list, { day, mins }) => {
      const item = mins.slice(1).reduce((list, min, i) => {
        const hour = min / 60;

        if (hour > deliverableHour || day !== today) {
          const startTime = formatMin(mins[i] ?? mins[1]);
          const endTime = formatMin(mins[i + 1]);

          const dayText =
            {
              [today]: 'Hoje',
              [(today + 1) % 7]: 'Amanhã',
            }[day] ?? weekDayNames[day];

          return list.concat({
            dayText,
            dayNumber: day,
            hours: `${startTime} - ${endTime}`,
            scheduled: true,
          });
        }

        return list;
      }, [] as OrderSchedule[]);
      return list.concat(item);
    }, [] as OrderSchedule[]);
  })();

  return {
    schedules: [...addToArray(activeSchedule), ...(scheduleList ?? [])],
    marketTime: { isOpen, open_time: nextHour },
  };
};

const marketAddress = (a: Market['address']) => `${a.street}, ${a.number}`;

const Cart = () => {
  const routing = useRouting();
  const { isAuth, accessToken } = useAuthContext();
  const { address } = useAddressContext();
  const {
    subtotal,
    totalOff,
    total,
    shoppingList,
    revalidateCart,
    cleanCart,
    activeMarketId,
    activeMarket: market,
    setActiveMarket,
    payment,
    setPayment,
    loadLastPayment,
    activeSchedule,
    setActiveSchedule,
    schedules,
    setSchedules,
  } = useCartContext();
  const { createOrder } = useOrderContext();
  const { alert } = useMyContext();
  const [buyTooList, setBuyTooList] = useState<Product[]>();
  const [marketTime, setMarketTime] = useState<MarketTime>();
  const [isDelivery, setIsDelivery] = useState(true);
  const [tryAgain, setTryAgain] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<MyErrors>(null);
  const [profile, setProfile] = useState<Profile>();

  const insufficientChange =
    payment?.change && money.isLess(payment.change, total);

  const prodList =
    shoppingList && [...shoppingList.values()].map((v) => v.item);

  const hasInternet = useConnection();
  const connectErr = hasInternet === false ? 'connection' : undefined;

  useEffect(() => {
    if (accessToken) {
      loadLastPayment(accessToken);
      api.customers.find(accessToken).then(setProfile);
    }
  }, [accessToken, loadLastPayment]);

  useEffect(() => {
    let canceled = false;
    let updateScheduleTimer: NodeJS.Timer;

    (async () => {
      const { market_id: marketId, city_slug: citySlug } = activeMarketId;

      if (!marketId || !citySlug) return;
      setError(null);

      const market = await api.markets.findOne(citySlug, marketId);
      if (!market) return setError('nothing_market');

      setActiveMarket(market);

      const products = await api.products.findMany(citySlug, { marketId });
      setBuyTooList(products);

      const updateSchedules = () => {
        const { schedules, marketTime } = getUpdatedSchedule(market);

        if (marketTime.isOpen)
          setActiveSchedule((activeSchedule) => {
            const isActiveScheduleAvailable = () =>
              !!schedules.find((s) => isScheduleEqual(s, activeSchedule));

            return !activeSchedule || !isActiveScheduleAvailable()
              ? schedules[0]
              : activeSchedule;
          });
        setSchedules(schedules);
        setMarketTime(marketTime);
      };
      updateSchedules();

      const updateSchedulesTask = () => {
        const minTimeInMs = market.min_time * minute;

        updateScheduleTimer = setTimeout(
          () => {
            if (canceled) return;

            updateSchedules();
            updateSchedulesTask();
          },
          hour - ((Date.now() + minTimeInMs) % hour),
        );
      };
      updateSchedulesTask();
    })().catch(() => setError('server'));

    return () => {
      canceled = true;
      if (updateScheduleTimer) clearInterval(updateScheduleTimer);
    };
  }, [
    tryAgain,
    activeMarketId,
    setActiveMarket,
    setActiveSchedule,
    setSchedules,
  ]);

  const _error = connectErr ?? error;
  if (_error)
    return (
      <>
        <MyHeader />
        <Errors error={_error} onPress={() => setTryAgain(!tryAgain)} />
      </>
    );

  if (!isExiting && prodList && !prodList.length)
    return (
      <>
        <MyHeader />
        <View
          style={[
            globalStyles.centralizer,
            { backgroundColor: myColors.background },
          ]}>
          <MyText style={{ fontSize: 15, color: myColors.text2 }}>
            Carrinho vazio
          </MyText>
        </View>
      </>
    );

  if (!market || !marketTime || isExiting) return <Loading />;
  if (!shoppingList) return null;

  const needDocument =
    payment?.method === 'PIX' && payment?.inApp && !profile?.document;

  const [buttonText, dto] = ((): [string, OrderDto?] => {
    const isTotalBelowMin = money.isLess(subtotal ?? 0, market.order_min);
    const orderMin = money.toString(market.order_min, 'R$');

    if (!schedules?.length) return ['Fechado'];

    if (!activeSchedule) return ['Escolha um agendamento'];

    if (accessToken == null) return ['Entre ou cadastre-se'];

    if (isTotalBelowMin) return [`Subtotal mínimo de ${orderMin}`];

    if (!address?.street) return ['Escolha um endereço'];

    if (!address.number) return ['Endereço falta o numero'];
    if (!address.district) return ['Endereço falta o bairro'];
    if (!address.city) return ['Endereço falta a cidade'];
    if (!address.state) return ['Endereço falta o estado'];
    if (!address.coords) return ['Endereço falta coordenadas'];

    if (!payment) return ['Escolha um meio de pagamento'];

    if (needDocument) return ['Salve seu CPF'];

    const dto = {
      accessToken,
      market,
      address,
      coords: address.coords,
      payment,
      shoppingList,
      activeSchedule,
    };
    return ['Fazer pedido', dto];
  })();

  const MissingInfo = ({ title = '', buttonTitle = '', screen = '' }) => (
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
        <MyText style={{ marginTop: 8, color: myColors.text, fontSize: 16 }}>
          {title}
        </MyText>
        <MyButton
          title={buttonTitle}
          screen={screen}
          buttonStyle={{ marginTop: 12 }}
        />
      </View>
      <MyDivider style={styles.divider} />
    </>
  );

  const ListHeader = (
    <View>
      {!isAuth && (
        <MissingInfo
          title='Para concluir o pedido, precisamos que você se identifique primeiro.'
          buttonTitle='Entrar ou cadastrar-se'
          screen='SignIn'
        />
      )}

      {needDocument && (
        <MissingInfo
          title={`Para pagar com Pix pelo ${appOrSite}, salve seu CPF primeiro.`}
          buttonTitle='Salvar CPF'
          screen='MyProfile'
        />
      )}

      <MyTouchable
        disabled={!isDelivery}
        screen='Addresses'
        style={styles.addressContainer}>
        <MyIcon
          name={isDelivery ? 'home-map-marker' : 'map-marker-radius'}
          size={28}
          style={{ marginLeft: -2 }}
        />
        <View style={{ marginLeft: 8 }}>
          <MyText style={styles.topText}>
            {isDelivery ? 'Entregar' : 'Retirar'} em
          </MyText>
          <MyText style={styles.addressText}>
            {isDelivery
              ? !address
                ? 'Carregando...'
                : stringifyShortAddress(address) || 'Escolha um endereço' // `||` filter empty strings
              : marketAddress(market?.address)}
          </MyText>
          {
            <MyText style={styles.addressSubtext}>
              {isDelivery ? address?.district : market?.address.district}
            </MyText>
          }
        </View>
        {isDelivery && (
          <MyIcon
            name='chevron-right'
            size={36}
            color={myColors.grey2}
            style={styles.rightIcon}
          />
        )}
      </MyTouchable>

      <MyDivider style={styles.divider2} />

      {isAuth && (
        <>
          <MyTouchable screen='Payment' style={styles.addressContainer}>
            <MyIcon name='credit-card-outline' size={28} />
            <View style={{ marginLeft: 8 }}>
              <MyText style={styles.topText}>Meio de pagamento</MyText>
              <MyText style={styles.addressText}>
                {payment?.description ?? 'Escolha um meio de pagamento'}
              </MyText>
              {payment && (
                <MyText style={styles.addressSubtext}>
                  {payment.method === 'CASH'
                    ? payment.change
                      ? `Troco para ${money.toString(payment.change, 'R$')}`
                      : 'Sem Troco'
                    : payment.inApp
                    ? `Pelo ${appOrSite}`
                    : 'Na entrega'}
                </MyText>
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
          {activeSchedule
            ? `${activeSchedule.dayText}, ${activeSchedule.hours}`
            : schedules?.length
            ? 'Escolha um agendamento'
            : ''}
        </MyText>
        {!!schedules?.length && (
          <MyButton
            title='Ver horários'
            type='clear'
            screen='Schedule'
            titleStyle={{ color: myColors.primaryColor }}
            buttonStyle={{
              minHeight: 0,
              marginBottom: -4,
              height: 36,
              paddingHorizontal: 16,
            }}
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scheduleContainer}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {!marketTime.isOpen && (
          <View
            style={[
              { borderRadius: 10 },
              styles.scheduleCardBase,
              styles.scheduleCardInactive,
              globalStyles.elevation1,
            ]}>
            <>
              <MyText
                style={{
                  color: myColors.text2,
                  fontFamily: myFonts.Bold,
                }}>
                Fechado
              </MyText>
              <MyText
                style={{
                  color: myColors.text4,
                  fontSize: 15,
                  paddingVertical: 4,
                }}>
                {marketTime.open_time &&
                  `Abre amanhã ás ${marketTime.open_time}`}
              </MyText>
            </>
          </View>
        )}
        {schedules?.map((item, index) => {
          const active = isScheduleEqual(item, activeSchedule);
          return (
            <View key={index} style={{ borderRadius: 10 }}>
              <MyTouchable
                onPress={() => setActiveSchedule(item)}
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
                    {item.scheduled ? 'Agendar' : 'Padrão'}
                  </MyText>
                  <MyText style={{ color: myColors.text4, fontSize: 15 }}>
                    {item.dayText}
                  </MyText>
                  <MyText style={{ color: myColors.text4 }}>
                    {item.hours}
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
            refreshLess
            hideMarketLogo
            style={{ paddingRight: 8, paddingTop: 8 }}
            data={buyTooList}
          />
        )}
      </View>

      <MyDivider style={[styles.divider, { marginBottom: 4 }]} />
      <View style={styles.priceContainer}>
        <MyText style={styles.priceText}>Subtotal</MyText>
        <AnimatedText style={styles.priceText} distance={10}>
          {subtotal}
        </AnimatedText>
      </View>
      <View style={styles.priceContainer}>
        <MyText style={styles.priceText}>Economizado</MyText>
        <AnimatedText
          style={[styles.priceText, { color: '#E00000' }]}
          distance={10}>
          {totalOff}
        </AnimatedText>
      </View>
      <View style={styles.priceContainer}>
        <MyText style={styles.priceText}>
          {isDelivery ? 'Taxa de entrega' : 'Retirada'}
        </MyText>
        <MyText
          style={[
            styles.priceText,
            (money.isEqual(market.delivery_fee, 0) || !isDelivery) && {
              color: '#109c00',
            },
          ]}>
          {money.isEqual(market.delivery_fee, 0) || !isDelivery
            ? 'Grátis'
            : money.toString(market.delivery_fee, 'R$')}
        </MyText>
      </View>
      <MyDivider
        style={{ backgroundColor: myColors.divider2, marginHorizontal: 16 }}
      />
      <View style={styles.priceTotalContainer}>
        <MyText style={styles.priceTotalText}>Total</MyText>
        <AnimatedText style={styles.priceTotalText}>{total}</AnimatedText>
      </View>
      <MyDivider style={[styles.divider, { marginTop: 4 }]} />
      <MyTouchable screen='Cupons' style={styles.cupomContainer}>
        <MyIcon name='ticket-percent' size={48} />
        <View style={styles.cupomTextContainer}>
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
      <View style={styles.prodListTopBar}>
        <Image
          style={{ height: 48, width: 48, borderRadius: 48 }}
          source={{ uri: getImageUrl('market', market.market_id) }}
        />
        <MyText style={styles.marketName}>{market.name}</MyText>
      </View>
    </View>
  );

  const makeOrder = (total: Money, dto: OrderDto) => {
    setIsExiting(true);

    createOrder(dto.accessToken, {
      market_id: market.market_id,
      address_street: dto.address.street,
      address_number: dto.address.number,
      address_district: dto.address.district,
      address_city: dto.address.city,
      address_state: dto.address.state,
      address_complement: dto.address.complement ?? undefined,
      address_latitude: dto.coords.lat,
      address_longitude: dto.coords.lng,
      paid_in_app: dto.payment.inApp,
      payment_method: dto.payment.method,
      payment_description: dto.payment.description,
      payment_change: money.toValue(dto.payment.change),
      card_id: dto.payment.cardId,
      items: [...dto.shoppingList].map(([item_id, { quantity }]) => ({
        item_id,
        quantity,
      })),
      is_scheduled: dto.activeSchedule.scheduled,
      //schedule_hours: dto.activeSchedule.hours,
      client_total: money.toValue(total) ?? '',
    })
      .then(async (order) => {
        saveConfirmationToken({
          order_id: order.order_id,
          token: order.confirmation_token,
        });

        cleanCart();
        if (dto.payment.change) setPayment(omit(dto.payment, 'change'));

        routing.replace('OrderDetails', {
          marketId: order.market_id,
          orderId: order.order_id,
        });
      })
      .catch((err) => {
        if (!axios.isAxiosError(err)) throw err;
        const { total } = err.response?.data;

        if (total)
          return alert(
            `Valor da compra mudou para ${money.toString(total, 'R$')}`,
            'O mercado atualizou preço dos produtos',
            {
              confirmTitle: 'Continuar',
              onConfirm: () => makeOrder(money(total), dto),
              cancelTitle: 'Voltar',
              onCancel: async () => {
                await revalidateCart();
                setIsExiting(false);
              },
            },
          );

        alert('Error ao fazer o pedido');
        setIsExiting(false);
      });
  };

  return (
    <View style={[{ backgroundColor: myColors.background, flex: 1 }]}>
      <CartHeader
        isDelivery={isDelivery}
        setIsDelivery={setIsDelivery}
        setIsExiting={setIsExiting}
      />
      <ProdListHorizontal
        hideMarketLogo
        style={{ paddingBottom: device.iOS ? 98 : 66 }}
        header={ListHeader}
        data={prodList}
      />
      <MyButton
        title={buttonText}
        disabled={!dto}
        buttonStyle={styles.buttonContainer}
        onPress={dto ? () => makeOrder(total, dto) : undefined}
      />
      <ChangeModal
        valuePrefix='Valor da compra aumentou para'
        state={{ isVisible: !!insufficientChange }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonsContainer: {
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
  addressContainer: {
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
  scheduleContainer: {
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  priceTotalContainer: {
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
  cupomContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cupomTextContainer: {
    marginLeft: 8,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
  prodListTopBar: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  marketName: {
    color: myColors.text4,
    fontSize: 20,
    marginLeft: 16,
    fontFamily: myFonts.Medium,
  },
  buttonContainer: {
    width: '95%',
    position: device.web ? ('fixed' as any) : 'absolute',
    bottom: device.iOS ? 36 : 6,
    alignSelf: 'center',
    height: 58,
  },
});

export default WithToast(Cart);
