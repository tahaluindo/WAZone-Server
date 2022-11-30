import { Prisma } from "@prisma/client";
import { db } from "..";
import { WaMessage } from "../../baileys/events/messages-upsert";

type Opts = {
  waMessage: WaMessage;
  botId: string;
};

export const saveMessage = async ({ waMessage, botId }: Opts) => {
  const { message, type } = waMessage;

  if (message.messageType === "protocolMessage" || message.isStatus)
    return null;

  const args: Prisma.MessageCreateArgs = {
    data: {
      type,
      botId,
      isFromMe: message.isFromMe!,
      isGroup: message.isGroup!,
      isStatus: message.isStatus!,
      key: JSON.stringify(message.key),
      sender: JSON.stringify(message.sender),
      message: JSON.stringify(message.message),
      messageImage: JSON.stringify(message.messageImage),
      messageId: message.messageId!,
      messageText: message.messageText!,
      messageType: message.messageType!,
      messageTimestamp: message.messageTimestamp,
      chatId: null,
    },
  };

  // if (!message.isFromMe) {
  const hasChat = await db.chat.findFirst({
    where: {
      botId,
      senderId: message.sender.id!,
    },
  });

  if (hasChat) {
    args.data.chatId = hasChat.id;
  } else {
    const chat = await db.chat.create({
      data: {
        botId,
        senderId: message.sender.id!,
        senderName: message.sender.name,
      },
    });

    args.data.chatId = chat.id;
  }
  // }

  const data = await db.message.create(args);

  return data;
};
