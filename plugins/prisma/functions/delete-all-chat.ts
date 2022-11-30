import { db } from "..";

type Opts = {
  botId: string;
};

export const deleteAllChat = async ({ botId }: Opts) => {
  const data = await db.chat.deleteMany({
    where: {
      botId,
    },
  });

  return data;
};
