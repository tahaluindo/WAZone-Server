import { AnyMessageContent } from "@adiwajshing/baileys";
import { WaSock } from "./create-wa-socket";
import { toRecepientId } from "./to-recepient-id";

type SendMessageOpts = {
  sock: WaSock;
  phoneNumber: string;
  content: AnyMessageContent;
};

export const sendMessage = async (opts: SendMessageOpts) => {
  const { sock, phoneNumber, content } = opts;
  const recepientId = toRecepientId(phoneNumber);
  const result = await sock.sendMessage(recepientId, content);

  return result;
};
