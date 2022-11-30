import { db } from "..";

type Opts = {
  botId: string;
};

export const deleteQrCode = async ({ botId }: Opts) => {
  const data = await db.bot.update({
    where: {
      id: botId,
    },
    data: {
      qrCode: "",
      qrCodeCreatedAt: null,
    },
  });

  return data;
};
