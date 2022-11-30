import { db } from "..";

type Opts = {
  botId: string;
};

export const deleteBot = async ({ botId }: Opts) => {
  if (!botId) return;

  const bot = await db.bot.findFirst({
    where: {
      id: botId,
    },
  });
  if (!bot) return;

  const data = await db.bot.deleteMany({
    where: {
      id: botId,
    },
  });

  return data;
};
