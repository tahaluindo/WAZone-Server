import { db } from "..";

type Opts = {
  botId: string;
  isContactSynced: boolean;
};

export const updateIsContactSynced = async ({
  botId,
  isContactSynced = false,
}: Opts) => {
  const data = db.bot.update({
    where: {
      id: botId,
    },
    data: {
      isContactSynced,
    },
  });

  return data;
};
