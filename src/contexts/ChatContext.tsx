import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { io } from 'socket.io-client';
import { createContext, useContextSelector } from 'use-context-selector';
import { Urls } from '~/constants/urls';
import { ChatMsg } from '~/core/models';
import { createUseContext } from '~/contexts/createUseContext';
import { transformCreatedAt } from '~/functions/transform';
import { api } from '~/services/api';
import { useAuthContext } from './AuthContext';
import { useOrderContext } from './OrderContext';

const useProviderValues = () => {
  const { accessToken } = useAuthContext();
  const { orders } = useOrderContext();
  const [allChats, setAllChats] = useState(
    new Map<string, Map<string, ChatMsg>>(),
  );
  const [allIsLoaded, setAllIsLoaded] = useState(new Map<string, boolean>());

  const updateChat = useCallback((market_id: string, msgs: ChatMsg[]) => {
    setAllChats((oldAllChats) => {
      const newChat = new Map(oldAllChats.get(market_id));

      msgs.forEach((msg) => newChat.set(msg.id, transformCreatedAt(msg)));

      return new Map(oldAllChats).set(market_id, newChat);
    });
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(Urls.API_WS, {
      transports: ['websocket'],
      auth: { token: accessToken },
    });
    socket.on('chatMsg', (msg: ChatMsg) => {
      updateChat(msg.market_id, [msg]);

      if (msg.author === 'CUSTOMER') return;

      const marketName = orders?.find((v) => v.order_id === msg.order_id)
        ?.market.name;

      Notifications.scheduleNotificationAsync({
        content: { title: marketName || 'Mensagem nova', body: msg.message },
        trigger: null,
      });
    });

    orders?.forEach(({ order_id }) => {
      socket.emit('subscribeToChatMsgs', order_id);
    });

    return () => {
      socket.close();
    };
  }, [accessToken, orders, updateChat]);

  const loadChat = useCallback(
    async (accessToken: string, market_id: string) => {
      const msgs = await api.chats.getOldMsgs(accessToken, market_id);

      updateChat(market_id, msgs);
      setAllIsLoaded((v) => new Map(v).set(market_id, true));
    },
    [updateChat],
  );

  return { allChats, loadChat, allIsLoaded };
};

type ChatContextValues = ReturnType<typeof useProviderValues>;

const ChatContext = createContext({} as ChatContextValues);

export const useChatContext = createUseContext(ChatContext);

export const useChatItemContext = (market_id: string) => ({
  msgs:
    useContextSelector(ChatContext, (v) => v.allChats.get(market_id)) ??
    new Map<string, ChatMsg>(),
  isLoaded: useContextSelector(ChatContext, (v) =>
    v.allIsLoaded.get(market_id),
  ),
});

export const ChatProvider = (props: { children: ReactNode }) => (
  <ChatContext.Provider value={useProviderValues()} {...props} />
);
