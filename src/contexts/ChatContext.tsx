import { useState, useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { io } from "socket.io-client";
import { Urls } from "~/constants/urls";
import { ChatMsg } from "~/core/models";
import { createContext } from "~/contexts/createContext";
import { transformCreatedAt } from "~/functions/transform";
import { api } from "~/services/api";
import { useAuthContext } from "./AuthContext";
import { useOrderContext } from "./OrderContext";

const useChat = () => {
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
      transports: ["websocket"],
      auth: { token: accessToken },
    });
    socket.on("chatMsg", (msg: ChatMsg) => {
      updateChat(msg.market_id, [msg]);

      if (msg.author === "CUSTOMER") return;

      const marketName = orders?.find((v) => v.order_id === msg.order_id)
        ?.market.name;

      Notifications.scheduleNotificationAsync({
        content: { title: marketName || "Mensagem nova", body: msg.message },
        trigger: null,
      });
    });

    orders?.forEach(({ order_id }) => {
      socket.emit("subscribeToChatMsgs", order_id);
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

export const [ChatProvider, useChatContext, useChatContextSelector] =
  createContext(useChat);

export const useChatItemContext = (market_id: string) => ({
  msgs:
    useChatContextSelector((v) => v.allChats.get(market_id)) ??
    new Map<string, ChatMsg>(),
  isLoaded: useChatContextSelector((v) => v.allIsLoaded.get(market_id)),
});
