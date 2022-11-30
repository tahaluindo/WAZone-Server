import { db } from "..";

type Opts = {
  botId: string;
};

export const deleteAllMessage = async ({ botId }: Opts) => {
  const data = await db.message.deleteMany({
    where: {
      botId,
    },
  });

  return data;
};
