import { db } from "..";

type Opts = {
  botId: string;
  qrCode: string;
};

export const saveQrCode = async ({ botId, qrCode }: Opts) => {
  const data = await db.bot.update({
    where: {
      id: botId,
    },
    data: {
      qrCode,
      qrCodeCreatedAt: new Date(),
    },
  });

  return data;
};
