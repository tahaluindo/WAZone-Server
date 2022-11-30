import { WAConnectionState } from "@adiwajshing/baileys";
import { db } from "..";
import { getWa } from "../../..";

type Opts = {
  botId: string;
  connection: WAConnectionState | undefined;
};

export const updateConnection = async ({ botId, connection }: Opts) => {
  if (!botId) return null;

  const wa = getWa(botId);
  if (!wa?.sock) return null;

  const bot = await db.bot.findFirst({
    where: {
      id: botId,
    },
  });

  if (!bot) return null;

  const data = await db.bot.update({
    where: {
      id: botId,
    },
    data: {
      connectionStatus: connection,
    },
  });

  return data;
};
