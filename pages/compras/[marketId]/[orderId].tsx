import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Image } from 'react-native-elements/dist/image/Image';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { myColors, images, myFonts, globalStyles } from '~/constants';
import {
  canReview,
  fail,
  formatCardBrand,
  formatDeliveryTime,
  getImageUrl,
  getJwtExpiration,
  stringifyAddress,
  validateOrder,
} from '~/functions/converter';
import { BottomNav } from '~/components/Layout';
import MyDivider from '~/components/MyDivider';
import MyText from '~/components/MyText';
import MyIcon from '~/components/MyIcon';
import MyHeader from '~/components/MyHeader';
import Loading from '~/components/Loading';
import useRouting from '~/hooks/useRouting';
import {
  Order,
  OrderItem,
  PaymentCard,
  RetryPayment,
  Review,
  SetState,
} from '~/core/models';
import { api } from '~/services/api';
import { useAuthContext } from '~/contexts/AuthContext';
import { money } from '~/functions/money';
import Errors, { MyErrors, serverError } from '~/components/Errors';
import CenterModal from '~/components/CenterModal';
import { ModalState, useModalState } from '~/hooks/useModalState';
import MyTouchable from '~/components/MyTouchable';
import IconButton from '~/components/IconButton';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import useMyContext from '~/core/MyContext';
import { getConfirmationTokens } from '~/core/dataStorage';
import { appOrSite } from '~/constants/device';
import MyButton from '~/components/MyButton';
import Rating from '~/components/Rating';
import MyInput from '~/components/MyInput';
import BottomModal from '~/components/BottomModal';
import Portal from '~/core/Portal';
import OrderHelp from '~/screens/OrderHelp';
import OrderCancel from '~/screens/OrderCancel';
import { sleep } from '~/functions/sleep';
import { Urls } from '~/constants/urls';
import { lightFormat } from 'date-fns';
// Hi
const importPaymentMethodsBody = () =>
  import('@pages/meios-de-pagamento').then((mod) => mod.PaymentMethodsBody);
const PaymentMethodsBody = dynamic(importPaymentMethodsBody, {
  loading: () => <Loading />,
});

const importPaymentCardBody = () =>
  import('@pages/meios-de-pagamento/cartao').then((mod) => mod.PaymentCardBody);
const PaymentCardBody = dynamic(importPaymentCardBody, {
  loading: () => <Loading />,
});

const isCompleted = (order: Order) =>
  ['COMPLETING', 'COMPLETED'].includes(order.status);

export type OrderPages = 'OrderDetails' | 'OrderHelp' | 'OrderCancel';

const OrderDetails = () => {
  const { params, isReady } = useRouting();
  const { isAuth, accessToken } = useAuthContext();
  const [history, setHistory] = useState<OrderPages[]>(['OrderDetails']);
  const [order, setOrder] = useState<Order>();
  const [apiError, setApiError] = useState<MyErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);

  // JavaScriptCore don't support `array.at()`
  const selectedPage = history.slice(-1)[0] ?? 'OrderDetails';

  const navigate = useCallback(
    (page: OrderPages) =>
      setHistory((h) => (h.slice(-1)[0] !== page ? h.concat(page) : h)),
    []
  );
  const goBack = () => setHistory((h) => h.slice(0, -1));
  const orderId = params.orderId as string;
  const marketId = params.marketId as string;

  useEffect(() => {
    if (!isReady || !isAuth) return;

    try {
      const socket = io(Urls.API_WS, {
        transports: ['websocket'],
        auth: { token: accessToken },
      });
      socket.on('orders', (newOrder: Partial<Order>) => {
        setOrder((order) => validateOrder({ ...(order ?? {}), ...newOrder }));
      });
      socket.emit('orders', { order_id: orderId, market_id: marketId });
      return () => {
        socket.close();
      };
    } catch (err) {
      setApiError(api.isError('NotFound', err) ? 'nothing_order' : 'server');
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tryAgain, isReady, isAuth, orderId, marketId]);

  useEffect(() => {
    if (selectedPage === 'OrderCancel' && order && isCompleted(order))
      navigate('OrderDetails');
  }, [order, selectedPage, navigate]);

  if (apiError)
    return (
      <Errors
        error={apiError}
        onPress={() => {
          setApiError(null);
          setTryAgain(!tryAgain);
        }}
      />
    );

  if (!order) return <Loading />;

  switch (selectedPage) {
    case 'OrderDetails':
      return (
        <BottomNav>
          <OrderDetailsPage
            order={order}
            setOrder={setOrder}
            onNavigate={navigate}
          />
        </BottomNav>
      );
    case 'OrderHelp':
      return (
        <OrderHelp order={order} onNavigate={navigate} onGoBack={goBack} />
      );
    case 'OrderCancel':
      return (
        <OrderCancel order={order} onNavigate={navigate} onGoBack={goBack} />
      );
  }
};

const OrderDetailsPage = ({
  order,
  setOrder,
  onNavigate: navigate,
}: {
  order: Order;
  setOrder: SetState<Order | undefined>;
  onNavigate: (page: OrderPages) => void;
}) => {
  const routing = useRouting();
  const [pixModalState, openPixModal] = useModalState();
  const [paymentModalState, openPaymentModal] = useModalState();
  const [confirmModalState, openConfirmModal] = useModalState();
  const [reviewModalState, openReviewModal, closeReviewModal] = useModalState();

  const { payment } = order;

  const [, cardBrand] = payment.description.split(' ');
  const cardBrandIcon = () =>
    ({
      Mastercard: images.mastercard,
      Visa: images.visa,
      Elo: images.elo,
    }[cardBrand] ?? images.creditCard);

  const paymentIcon = {
    CASH: images.cash,
    PIX: images.pix,
    CARD: cardBrandIcon(),
  }[payment.method];

  const change = money.isGreater(payment.change, 0)
    ? ` - Troco para ${money.toString(payment.change, 'R$')}`
    : '';
  const subtotal = money.minus(order.total, order.delivery_fee);
  const hasDeliveryFee = !money.isEqual(order.delivery_fee, 0);

  const header = (
    <View>
      <StatusBar order={order} />
      <MyDivider style={styles.divider} />
      {order.status === 'PAYMENT_REQUIRE_ACTION' && (
        <>
          <MyTouchable
            onPress={openPixModal}
            style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              {...images.pix}
              resizeMode='contain'
              containerStyle={{ height: 24, width: 24, marginRight: 8 }}
            />
            <MyText style={styles.text}>Ver Pix QR Code</MyText>
          </MyTouchable>
          <MyDivider style={styles.divider} />
        </>
      )}
      {['PAYMENT_REQUIRE_ACTION', 'PAYMENT_FAILED'].includes(order.status) && (
        <>
          <MyTouchable
            onPress={openPaymentModal}
            style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <MyText style={styles.text}>
              {order.status === 'PAYMENT_FAILED'
                ? 'Tentar pagamento novamente'
                : 'Mudar meio de pagamento'}
            </MyText>
          </MyTouchable>
          <MyDivider style={styles.divider} />
        </>
      )}
      {order.status === 'DELIVERY_PENDING' && (
        <>
          <MyTouchable
            onPress={openConfirmModal}
            style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <MyIcon
              name='check-circle'
              color={myColors.green}
              size={24}
              style={{ marginRight: 8 }}
            />
            <MyText style={styles.text}>Ver Código de confirmação</MyText>
          </MyTouchable>
          <MyDivider style={styles.divider} />
        </>
      )}
      {isCompleted(order) &&
        (order.review ? (
          <>
            <View
              style={{
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MyText style={[styles.text, { marginRight: 8 }]}>
                Avaliação
              </MyText>
              <Rating value={order.review.rating} />
            </View>
            <MyDivider style={styles.divider} />
          </>
        ) : canReview(order) ? (
          <>
            <MyTouchable
              onPress={openReviewModal}
              style={{
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MyIcon
                name='star'
                color={myColors.rating}
                size={24}
                style={{ marginRight: 8 }}
              />
              <MyText style={styles.text}>Avaliar pedido</MyText>
            </MyTouchable>
            <MyDivider style={styles.divider} />
          </>
        ) : null)}
      {!isCompleted(order) && (
        <>
          <MyTouchable
            onPress={() => routing.navigate('Chat', routing.params)}
            style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <MyIcon name='message' size={24} style={{ marginRight: 8 }} />
            <MyText style={styles.text}>Entrar em contato com mercado</MyText>
          </MyTouchable>
          <MyDivider style={styles.divider} />
        </>
      )}
      <View style={styles.marketContainer}>
        <Image
          source={{ uri: getImageUrl('market', order.market_id) }}
          placeholderStyle={{ backgroundColor: 'white' }}
          containerStyle={{ borderRadius: 8, height: 65, width: 65 }}
        />
        <MyText style={styles.marketName}>{order.market.name}</MyText>
      </View>
      <View style={styles.infoContainer}>
        <MyText style={styles.text}>
          Realizado {lightFormat(order.created_at, 'dd/MM/yy - HH:mm')}
        </MyText>
        <MyText style={[styles.text, { textAlign: 'right' }]}>
          Pedido {order.market_order_id.padStart(3, '0')}
        </MyText>
      </View>
      <MyDivider style={styles.divider} />
      <View style={{ marginHorizontal: 16, marginVertical: 12 }}>
        <MyText style={[styles.text, styles.addressTitle]}>
          Endereço de entrega
        </MyText>
        <MyText style={styles.address}>
          {stringifyAddress(order.address)}
        </MyText>
      </View>
      <MyDivider style={styles.divider} />
      <View style={styles.paymentContainer}>
        <MyText style={styles.text}>
          {`Pagamento ${payment.in_app ? `pelo ${appOrSite}` : 'na entrega'}`}
        </MyText>
        <View style={{ flexShrink: 1 }}>
          <MyText style={styles.payment}>{payment.description + change}</MyText>
        </View>
        <Image
          {...paymentIcon}
          resizeMode='contain'
          containerStyle={styles.paymentIcon}
          childrenContainerStyle={{ top: 2 }}
        />
      </View>
      <MyDivider style={styles.divider} />
      <View style={[styles.priceContainer, { marginTop: 10 }]}>
        <MyText style={styles.price}>Subtotal</MyText>
        <MyText style={styles.price}>{money.toString(subtotal, 'R$')}</MyText>
      </View>
      <View style={styles.priceContainer}>
        <MyText style={styles.price}>Taxa de entrega</MyText>
        <MyText
          style={[styles.price, !hasDeliveryFee && { color: myColors.green }]}>
          {!hasDeliveryFee
            ? 'Grátis'
            : money.toString(order.delivery_fee, 'R$')}
        </MyText>
      </View>
      <MyDivider
        style={{ backgroundColor: myColors.divider3, marginHorizontal: 16 }}
      />
      <View style={styles.totalPriceContainer}>
        <MyText style={styles.totalPrice}>Total</MyText>
        <MyText style={styles.totalPrice}>
          {money.toString(order.total, 'R$')}
        </MyText>
      </View>
      <MyDivider style={styles.divider} />
    </View>
  );

  const setReview = (review: Review) => {
    setOrder((o) => o && { ...o, review });
    closeReviewModal();
  };

  const helpButton = (
    <IconButton
      icon='help-circle'
      type='prodIcons'
      onPress={() => navigate('OrderHelp')}
    />
  );

  return (
    <Portal.Host>
      <MyHeader title='Detalhes do pedido' rightIcon={helpButton} />
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        data={order.items}
        keyExtractor={(_, i) => `${i}`}
        ListHeaderComponent={header}
        renderItem={orderItem}
      />
      <PageModal state={paymentModalState}>
        <PaymentModal order={order} state={paymentModalState} />
      </PageModal>
      <CenterModal state={pixModalState}>
        <PixModal payment={payment} />
      </CenterModal>
      <CenterModal state={confirmModalState}>
        <ConfirmModal order={order} />
      </CenterModal>
      <CenterModal state={reviewModalState}>
        <ReviewModal order={order} onDismiss={setReview} />
      </CenterModal>
    </Portal.Host>
  );
};

const orderItem = ({ item }: { item: OrderItem }) => (
  <>
    <View style={styles.itemContainer}>
      <MyText style={styles.itemQuantity}>{item.quantity}x</MyText>
      <View style={{ marginLeft: 18 }}>
        <MyText style={styles.itemDescription}>
          {`${item.product.name} ${item.product.brand}`}
        </MyText>
        <MyText style={styles.itemPrice}>
          {money.toString(+item.price, 'R$')}
        </MyText>
        <MyText style={styles.itemWeight}>{item.product.quantity}</MyText>
      </View>
    </View>
    <MyDivider style={styles.itemDivider} />
  </>
);

const PageModal = ({
  state,
  ...props
}: {
  state: ModalState;
  children: React.ReactNode;
}) => {
  const { height } = useWindowDimensions();

  return (
    <BottomModal
      state={state}
      style={{ height: height - 56, padding: 0 }}
      {...props}
    />
  );
};

const PixModal = ({ payment }: { payment: Order['payment'] }) => {
  const { toast } = useMyContext();

  if (!payment.pix_code || !payment.pix_expires_at) return null;
  const { pix_code, pix_expires_at } = payment;

  const isValid = +pix_expires_at > Date.now();

  const timeLeft = new Date(+pix_expires_at - Date.now());

  const minsLeft = timeLeft.getUTCMinutes();
  const hoursLeft = timeLeft.getUTCHours();

  const plural = (n: number) => (n > 1 ? 's' : '');
  const hours = `${hoursLeft} hora${plural(hoursLeft)}`;
  const mins = `${minsLeft} minuto${plural(minsLeft)}`;

  const copyCode = async () => {
    const hasCopied = await Clipboard.setStringAsync(pix_code);
    toast(hasCopied ? 'Copiado' : 'Error ao copiar', {
      type: hasCopied ? 'Confirmation' : 'Error',
    });
  };

  return (
    <View style={globalStyles.centralizer}>
      <MyText style={[styles.text, { marginBottom: 12 }]}>
        {isValid ? `Pix expira em ${hours} e ${mins}` : 'Pix expirado'}
      </MyText>
      <QRCode size={200} value={pix_code} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <TextInput
          value={pix_code}
          editable={false}
          style={[styles.text, { width: '60%' }]}
        />
        <IconButton icon='content-copy' type='clear' onPress={copyCode} />
      </View>
    </View>
  );
};

const PaymentModal = ({
  order,
  state: { isVisible, onDismiss: dismiss },
}: {
  order: Order;
  state: ModalState;
}) => {
  const { alert } = useMyContext();
  const { accessToken } = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setLoading(false);
      setSelectedPage(0);
    }
  }, [isVisible]);

  if (isLoading || !accessToken) return <Loading />;

  const selectPayment = (dto: RetryPayment, card?: PaymentCard) => {
    const retryPayment = async () => {
      setLoading(true);
      try {
        await api.orders.retryPayment(accessToken, order, dto);
        dismiss();
      } catch {
        serverError(alert);
      }
      await sleep(300);
      setLoading(false);
    };

    const again = order.card_token === card?.asaas_id ? ' novamente' : '';
    const action =
      order.payment.method === dto.payment_method
        ? `Tentar${again} o`
        : 'Mudar meio de pagamento para';
    const method = { PIX: 'Pix', CARD: 'Cartão' }[dto.payment_method];
    const cardInfo = card
      ? `${card.nickname ?? formatCardBrand(card)} •••• ${card.last4}`
      : '';

    alert(`${action} ${method}?`, cardInfo, {
      onConfirm: retryPayment,
    });
  };

  const body = !selectedPage ? (
    <PaymentMethodsBody
      onPixPress={
        order.payment.method !== 'PIX'
          ? () => selectPayment({ payment_method: 'PIX' })
          : undefined
      }
      onCardPress={(card) =>
        selectPayment({ payment_method: 'CARD', card_id: card.id }, card)
      }
      onAddCard={() => setSelectedPage(1)}
    />
  ) : (
    <PaymentCardBody onDismiss={() => setSelectedPage(0)} />
  );

  return (
    <View style={[StyleSheet.absoluteFill, { paddingTop: 8 }]}>{body}</View>
  );
};

const ConfirmModal = ({ order }: { order: Order }) => {
  const { accessToken } = useAuthContext();
  const [confirmToken, setConfirmToken] = useState<string>();

  useEffect(() => {
    if (!accessToken || confirmToken) return;

    getConfirmationTokens().then(async (tokens) => {
      const { token: storeToken } =
        tokens.find((c) => c.order_id === order.order_id) ?? {};

      if (storeToken && getJwtExpiration(storeToken) > Date.now())
        return setConfirmToken(storeToken);

      const { token: apiToken } = await api.orders.getConfirmationToken(
        accessToken,
        order
      );
      setConfirmToken(apiToken);
    });
  }, [accessToken, confirmToken, order]);

  if (!confirmToken) return <Loading />;

  return (
    <View style={[globalStyles.centralizer, { paddingBottom: 16 }]}>
      <MyText style={[styles.text, { marginBottom: 12 }]}>
        Código de confirmação
      </MyText>
      <QRCode size={200} value={confirmToken} />
    </View>
  );
};

const ReviewModal = ({
  order: { order_id, market_id },
  onDismiss: dismiss,
}: {
  order: Order;
  onDismiss: (review: Review) => void;
}) => {
  const { alert } = useMyContext();
  const { accessToken } = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  if (isLoading) return <Loading />;

  const send = () =>
    api.orders.review(accessToken ?? fail(), {
      order_id,
      market_id,
      rating,
      message,
    });

  return (
    <View style={{ alignItems: 'center' }}>
      <MyText style={[styles.title, { marginBottom: 16 }]}>Avalie</MyText>
      <MyText style={[styles.text, { marginBottom: 12 }]}>
        Escolha de 1 a 5 estrelas
      </MyText>
      <Rating value={rating} onChange={setRating} size='big' />
      <MyInput
        value={message}
        onChangeText={setMessage}
        label='Escreva um comentário'
        labelStyle={{
          color: myColors.optionalInput,
          marginLeft: 8,
          marginBottom: 6,
        }}
        placeholder='Opcional'
        multiline
        maxLength={256}
        numberOfLines={2}
        containerStyle={{ marginTop: 24 }}
        inputContainerStyle={{ borderColor: 'transparent' }}
        inputStyle={{
          borderWidth: 2,
          borderRadius: 12,
          padding: 8,
          borderColor: myColors.divider3,
        }}
      />
      <MyButton
        title='Avaliar'
        disabled={!rating}
        onPress={async () => {
          setLoading(true);
          try {
            const review = await send();
            dismiss(review);
          } catch {
            setLoading(false);
            serverError(alert);
          }
        }}
        buttonStyle={{ marginTop: 24, minWidth: 210 }}
      />
    </View>
  );
};

const StatusBar = ({ order }: { order: Order }) => {
  const Unfinished = ({ msg = '', step = 0, color = '' }) => {
    const inProgress = !color;
    return (
      <>
        <View style={{ marginHorizontal: 16, marginVertical: 12 }}>
          <MyText style={styles.previsionMyText}>
            {order.is_scheduled ? 'Agendado para' : 'Previsão de entrega'}
          </MyText>
          <MyText style={styles.previsionTime}>
            {formatDeliveryTime(order)}
          </MyText>
        </View>
        <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
          <View style={{ flex: 1 }}>
            <ProgressBar
              indeterminate={inProgress && step === 1}
              color={myColors.colorAccent}
              progress={inProgress ? 1 : 0}
            />
          </View>
          <View style={{ flex: 3, marginLeft: 8 }}>
            <ProgressBar
              indeterminate={inProgress && step === 2}
              color={step >= 2 ? myColors.colorAccent : myColors.divider3}
              progress={step >= 2 ? 1 : 0}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ProgressBar
              indeterminate={inProgress && step === 3}
              color={step >= 3 ? myColors.colorAccent : myColors.divider3}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 16,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MyIcon name='circle' color={color || myColors.green} size={8} />
          <MyText style={styles.steps}>{msg}</MyText>
        </View>
      </>
    );
  };

  const Finished = ({ msg = '', Icon = CompletedIcon }) => (
    <View
      style={{
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon />
      <MyText style={styles.text}>{msg}</MyText>
    </View>
  );

  const createUnfinished =
    (...args: Parameters<typeof Unfinished>) =>
    () =>
      Unfinished(...args);

  const createFinished =
    (...args: Parameters<typeof Finished>) =>
    () =>
      Finished(...args);

  const CompletedIcon = () => (
    <MyIcon
      name='check-circle'
      color='green'
      size={24}
      style={{ marginRight: 8 }}
    />
  );
  const CanceledIcon = () => (
    <MyIcon
      name='close-circle'
      color='red'
      size={24}
      style={{ marginRight: 8 }}
    />
  );

  const finishedTime =
    order.finished_at && lightFormat(order.finished_at, 'HH:mm');

  const statusBar = {
    PAYMENT_PROCESSING: createUnfinished({
      msg: 'Processando pagamento',
      step: 1,
    }),
    PAYMENT_FAILED: createUnfinished({
      msg: 'Falha no pagamento',
      step: 1,
      color: 'red',
    }),
    PAYMENT_REQUIRE_ACTION: createUnfinished({
      msg: 'Pague o pix',
      step: 1,
      color: myColors.pending,
    }),
    APPROVAL_PENDING: createUnfinished({
      msg: 'Aguardado confirmação do mercado',
      step: 1,
    }),
    PROCESSING: createUnfinished({
      msg: 'Pedido sendo preparando',
      step: 2,
    }),
    DELIVERY_PENDING: createUnfinished({
      msg: 'Pedido saiu para entrega',
      step: 3,
    }),
    COMPLETING: createFinished({
      msg: 'Pedido sendo concluído',
      Icon: CompletedIcon,
    }),
    COMPLETED: createFinished({
      msg: `Pedido concluído às ${finishedTime}`,
      Icon: CompletedIcon,
    }),
    CANCELING: createFinished({
      msg: 'Pedido sendo cancelado',
      Icon: CanceledIcon,
    }),
    CANCELED: createFinished({
      msg: `Pedido cancelado às ${finishedTime}`,
      Icon: CanceledIcon,
    }),
  }[order.status];

  return statusBar?.() ?? null;
};

const styles = StyleSheet.create({
  divider: {
    height: 2,
  },
  smallDivider: {
    backgroundColor: myColors.divider2,
    marginHorizontal: 16,
  },
  title: {
    fontFamily: myFonts.Medium,
    color: myColors.text3,
    fontSize: 18,
  },
  text: {
    color: myColors.text4,
    fontSize: 16,
  },
  previsionMyText: {
    color: myColors.text3,
  },
  previsionTime: {
    fontFamily: myFonts.Medium,
    color: myColors.text3,
    fontSize: 24,
  },
  steps: {
    marginLeft: 8,
    fontFamily: myFonts.Medium,
    color: myColors.text2,
    fontSize: 14,
  },
  marketName: {
    marginLeft: 14,
    fontFamily: myFonts.Medium,
    color: myColors.text3,
    fontSize: 24,
  },
  marketContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  addressTitle: {
    marginBottom: 4,
    color: myColors.text_1,
  },
  address: {
    fontFamily: myFonts.Condensed,
    color: myColors.text5,
    fontSize: 16,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  payment: {
    color: myColors.text5,
    fontSize: 16,
    marginRight: 34,
    textAlign: 'right',
  },
  paymentIcon: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 28,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  price: {
    color: myColors.text4,
    fontSize: 16,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  totalPrice: {
    fontFamily: myFonts.Medium,
    color: myColors.text4,
    fontSize: 17,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  itemQuantity: {
    fontFamily: myFonts.Medium,
    color: myColors.text3,
    fontSize: 16,
  },
  itemDescription: {
    fontFamily: myFonts.Condensed,
    color: myColors.text4,
    fontSize: 14,
  },
  itemPrice: {
    fontFamily: myFonts.Medium,
    color: myColors.text3,
    fontSize: 16,
    marginTop: 4,
  },
  itemWeight: {
    fontFamily: myFonts.Regular,
    color: myColors.text4,
    fontSize: 14,
    marginTop: 2,
  },
  itemDivider: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: myColors.divider3,
  },
});

export default OrderDetails;
