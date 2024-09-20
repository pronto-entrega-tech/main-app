import { ChatMsg, CreateChatMsgDto } from "~/core/models";
import { transformCreatedAt } from "~/functions/transform";
import Utils from "./utils";

const { ApiClient, authHeader } = Utils;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async create(token: string, dto: CreateChatMsgDto) {
    const { data } = await ApiClient.post<ChatMsg>(
      "/chats",
      dto,
      authHeader(token),
    );
    return transformCreatedAt(data);
  },

  async getOldMsgs(token: string, market_id: string) {
    const { data } = await ApiClient.get<ChatMsg[]>(
      `/chats/${market_id}`,
      authHeader(token),
    );
    return data.map(transformCreatedAt);
  },
};
