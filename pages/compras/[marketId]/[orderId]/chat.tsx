import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import Errors from '~/components/Errors';
import IconButton from '~/components/IconButton';
import Loading from '~/components/Loading';
import MyInput from '~/components/MyInput';
import MyHeader from '~/components/MyHeader';
import MyText from '~/components/MyText';
import IOSKeyboardAvoidingView from '~/components/IOSKeyboardAvoidingView';
import { useAuthContext } from '~/contexts/AuthContext';
import { useOrderContext } from '~/contexts/OrderContext';
import { ChatMsg } from '~/core/models';
import { getImageUrl } from '~/functions/converter';
import useRouting from '~/hooks/useRouting';
import { api } from '~/services/api';
import globalStyles from '~/constants/globalStyles';
import { zIndex } from '~/constants/zIndex';
import { formatTime } from '~/functions/format';
import { useChatContext, useChatItemContext } from '~/contexts/ChatContext';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';

const Chat = () => {
  const { isAuth } = useAuthContext();

  if (isAuth === false) return <Errors error='missing_auth' />;

  return (
    <IOSKeyboardAvoidingView>
      <MyHeader title='Conversa' />
      <Header />
      <MsgsList />
      <SendMsgInput />
    </IOSKeyboardAvoidingView>
  );
};

const Header = () => {
  const { params } = useRouting();
  const { orders } = useOrderContext();

  const order = orders?.find((v) => v.order_id === params.orderId);

  return (
    <View style={[globalStyles.elevation3, styles.headerContainer]}>
      <Avatar
        source={{ uri: order && getImageUrl('market', order.market_id) }}
        size='medium'
        rounded
      />
      <MyText style={styles.name}>{order?.market.name ?? 'Mercado'}</MyText>
    </View>
  );
};

const MsgsList = () => {
  const {
    params: { marketId },
  } = useRouting();
  const { accessToken } = useAuthContext();
  const { loadChat } = useChatContext();
  const { msgs, isLoaded } = useChatItemContext(marketId);

  useEffect(() => {
    if (accessToken && !isLoaded) loadChat(accessToken, marketId);
  }, [accessToken, isLoaded, marketId, loadChat]);

  useEffect(() => {
    Notifications.dismissAllNotificationsAsync();
  }, [msgs]);

  if (!isLoaded) return <Loading />;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ transform: 'scaleY(-1)' }}
      contentContainerStyle={{ padding: 16 }}>
      {[...msgs.values()].reverse().map((msg, index, allMsgs) => (
        <MsgItem key={msg.id} {...{ msg, index, allMsgs }} />
      ))}
    </ScrollView>
  );
};

const MsgItem = ({
  msg,
  index,
  allMsgs,
}: {
  msg: ChatMsg;
  index: number;
  allMsgs: ChatMsg[];
}) => {
  const direction = msg.author === 'CUSTOMER' ? 'right' : 'left';
  const pad = allMsgs[index - 1]?.author !== msg.author;

  return (
    <View
      style={[
        { marginTop: pad ? 8 : 4 },
        direction === 'left' ? styles.leftMsg : styles.rightMsg,
      ]}>
      <MyText style={styles.msgBody}>
        {msg.message}
        {' '.repeat(12)}
      </MyText>
      <MyText style={styles.msgTime}>{formatTime(msg.created_at)}</MyText>
    </View>
  );
};

const SendMsgInput = () => {
  const {
    params: { marketId: market_id, orderId: order_id },
  } = useRouting();
  const { accessToken } = useAuthContext();
  const [input, setInput] = useState('');

  const sendMsg = () => {
    if (!accessToken || !input) return;

    api.chats.create(accessToken, { market_id, order_id, message: input });
    setInput('');
  };

  return (
    <View style={[globalStyles.elevation3, styles.row]}>
      <MyInput
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendMsg}
        placeholder='Digite uma mensagem'
        maxLength={300}
        multiline
        enterKeyHint='send'
        containerStyle={{ flex: 1 }}
      />
      <IconButton disabled={!accessToken} onPress={sendMsg} icon='send' />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: zIndex.Header,
    padding: 16,
  },
  name: {
    fontSize: 18,
    marginLeft: 16,
  },
  msgItemContainer: {
    transform: 'scaleY(-1)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 16,
    maxWidth: '75%',
  },
  leftMsg: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
    borderColor: '#eee',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  rightMsg: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
    backgroundColor: '#eee',
  },
  msgBody: {
    flexShrink: 1,
    fontSize: 16,
  },
  msgTime: {
    fontSize: 12,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 6,
    right: 12,
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 8,
    paddingTop: 12,
    paddingBottom: 0,
  },
});

export default Chat;
