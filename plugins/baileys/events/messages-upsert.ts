import { MessageUpsertType, proto } from "@adiwajshing/baileys";
import { saveMessage } from "../../prisma/functions/save-message";
import { HandleWaSocketOpts } from "../helpers/handle-wa-socket";
import { parseMessage } from "../helpers/parse-message";

type Opts = HandleWaSocketOpts & {
  event: {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
  };
};

type DtoOpts = {
  botId: string;
  event: Opts["event"];
};

export type WaMessage = Awaited<ReturnType<typeof upsertMessageDto>>;

const upsertMessageDto = async ({ botId, event }: DtoOpts) => {
  const { messages, type } = event;
  const message = messages[0];

  return {
    message: await parseMessage({ m: message, botId }),
    type,
  };
};

export const messagesUpsert = async (opts: Opts) => {
  const { event, sock } = opts;

  const message = await upsertMessageDto({ event, botId: sock.id });
  // console.log("message:", message);

  await saveMessage({ botId: sock.id, waMessage: message });
};
