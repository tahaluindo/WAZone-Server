import {
  downloadMediaMessage,
  MessageType,
  WAMessage,
} from "@adiwajshing/baileys";
import { writeFile, mkdir } from "fs/promises";
import { db } from "../../prisma";
import { getPath } from "./get-path";

export type Sender = {
  id: string;
  name: string;
};

type Opts = {
  botId: string;
  m: WAMessage;
};

export const parseMessage = async ({ botId, m }: Opts) => {
  const messageId = m.key.id;
  const messageType = Object.keys(m?.message ?? [])[0] as MessageType;
  let messageText =
    m.message?.extendedTextMessage?.text ?? m.message?.conversation ?? null;

  // @ts-ignore
  const context = m.message[messageType].contextInfo;
  let quotedMessage = context?.quotedMessage;
  const isQuotedMessage = !!quotedMessage;

  if (quotedMessage) {
    if (quotedMessage["ephemeralMessage"])
      quotedMessage = quotedMessage.ephemeralMessage.message;

    quotedMessage.id = context.stanzaId;
    quotedMessage.sender = context.participant;
    // quotedMessage.isFromMe = context.participant
    quotedMessage.messageType = Object.keys(quotedMessage)[0] as MessageType;
    quotedMessage.mentions = context.mentionedJid;
    quotedMessage.hasMentions = context.mentionedJid?.length > 0;
  }

  const buttonResponseMessage = m?.message?.buttonsResponseMessage;
  const isButtonResponseMessage = !!buttonResponseMessage;

  const listResponseMessage = m?.message?.listResponseMessage;
  const isListResponseMessage = !!listResponseMessage;

  const templateResponseMessage = m?.message?.templateButtonReplyMessage;
  const isTemplateResponseMessage = !!templateResponseMessage;

  let messageTimestamp = m.messageTimestamp;
  if ((messageTimestamp as any)?.low)
    messageTimestamp = (messageTimestamp as any).low;

  const isFromMe = m.key.fromMe;
  const sender = {
    id: m.key.remoteJid,
    name: m.pushName,
  };

  let messageImage: any = m.message?.imageMessage;
  if (messageImage) {
    const { caption, mimetype } = messageImage;
    messageText = caption ?? "";
    const extension = mimetype!.split("/")[1];
    const buffer = await downloadMediaMessage(m, "buffer", {});
    // save to file
    const { mediaPath } = getPath(botId);
    await mkdir(mediaPath, { recursive: true });
    const path = `${mediaPath}/${messageId}.${extension}`;
    await writeFile(path, buffer);

    messageImage = {
      caption,
      mimetype,
      extension,
      path,
    };
  }

  if (!sender.name) {
    const contact = await db.contact.findFirst({
      where: {
        botId,
        waId: sender.id!,
      },
    });

    if (contact) {
      sender.name = contact.name;
    }
  }

  return {
    isFromMe,
    isGroup: m.key.remoteJid?.endsWith("@g.us"),
    isStatus:
      m.message?.senderKeyDistributionMessage?.groupId === "status@broadcast",
    sender,
    key: m.key,
    messageId: m.key.id,
    messageType: messageType,
    messageText: messageText,
    messageImage: messageImage,
    messageTimestamp: messageTimestamp as number,
    message: m.message,
    // isQuotedMessage: isQuotedMessage,
    // quotedMessage: quotedMessage,
    // hasMentions: !!context?.mentionedJid?.length,
    // mentions: context?.mentionedJid ?? [],
    // isButtonResponseMessage,
    // buttonResponseMessage,
    // listResponseMessage,
    // isListResponseMessage,
    // templateResponseMessage,
    // isTemplateResponseMessage,
  };
};
