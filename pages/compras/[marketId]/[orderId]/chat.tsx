import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import styled, { css } from 'styled-components/native';
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
import { GlobalStyles } from '~/constants/globalStyles';
import { zIndex } from '~/constants/zIndex';
import { formatTime } from '~/functions/format';
import { useChatContext, useChatItemContext } from '~/contexts/ChatContext';

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
    <HeaderContainer>
      <Avatar
        source={{ uri: order && getImageUrl('market', order.market_id) }}
        size='medium'
        rounded
      />
      <Name>{order?.market.name ?? 'Mercado'}</Name>
    </HeaderContainer>
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
    <MsgsListContainer contentContainerStyle={{ padding: 16 }}>
      {[...msgs.values()].reverse().map((msg, index, allMsgs) => (
        <MsgItem key={msg.id} {...{ msg, index, allMsgs }} />
      ))}
    </MsgsListContainer>
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
    <MsgItemContainer {...{ direction, pad }}>
      <MsgBody>
        {msg.message}
        {' '.repeat(12)}
      </MsgBody>
      <MsgTime>{formatTime(msg.created_at)}</MsgTime>
    </MsgItemContainer>
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
    <Row>
      <MyInput
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendMsg}
        placeholder='Digite uma mensagem'
        maxLength={300}
        multiline
        containerStyle={{ flex: 1 }}
      />
      <IconButton
        disabled={!accessToken}
        onPress={sendMsg}
        icon='send'
        type='clear'
      />
    </Row>
  );
};

const HeaderContainer = styled.View`
  ${GlobalStyles.elevation3}
  background-color: white;
  flex-direction: row;
  align-items: center;
  z-index: ${zIndex.Header};
  padding: 16px;
`;

const Name = styled(MyText)`
  font-size: 18px;
  margin-left: 16px;
`;

const MsgsListContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  /* flex: 1; */
  transform: scaleY(-1);
`;

const LeftMsgStyle = css`
  align-self: flex-start;
  border-bottom-left-radius: 0px;
  border-color: #eee;
  border-style: solid;
  border-width: 2px;
`;
const RightMsgStyle = css`
  align-self: flex-end;
  border-bottom-right-radius: 0px;
  background-color: #eee;
`;

type MsgProps = { direction: 'left' | 'right'; pad: boolean };

const MsgItemContainer = styled.View.attrs<unknown, MsgProps>({} as any)`
  ${(p) => (p.direction === 'left' ? LeftMsgStyle : RightMsgStyle)}
  transform: scaleY(-1);
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 10px;
  border-radius: 16px;
  max-width: 75%;
  margin-top: ${(p) => (p.pad ? 8 : 4)}px;
`;

const MsgBody = styled(MyText)`
  flex-shrink: 1;
  font-size: 16px;
`;

const MsgTime = styled(MyText)`
  font-size: 12px;
  position: absolute;
  align-self: flex-end;
  bottom: 6px;
  right: 12px;
`;

const Row = styled.View`
  ${GlobalStyles.elevation3}
  background-color: white;
  flex-direction: row;
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 0px;
`;

export default Chat;
