import { db } from "..";

type Opts = {
  botId: string;
};

export const deleteAllContact = async ({ botId }: Opts) => {
  const data = await db.contact.deleteMany({
    where: {
      botId,
    },
  });

  return data;
};
