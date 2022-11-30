import { db } from "..";

type Opts = {
  botId: string;
  error: any;
};

export const updateError = async ({ botId, error }: Opts) => {
  const stringifyError = error ? JSON.stringify(error) : "";
  const data = await db.bot.update({
    where: {
      id: botId,
    },
    data: {
      error: stringifyError,
      errorCreatedAt: error ? new Date() : null,
    },
  });

  return data;
};
