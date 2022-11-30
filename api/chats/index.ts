import { Router } from "express";
import { getWaFromRequest } from "../..";
import { toRecepientId } from "../../plugins/baileys/helpers/to-recepient-id";
import { db } from "../../plugins/prisma";
import { waErrorHandler } from "../middlewares/wa-error-handler";

const router = Router();

router.get("/", async (req, res) => {
  const { botId } = getWaFromRequest(req);
  if (!botId) {
    return res.status(404).json({
      message: `Bot ${botId} not found`,
    });
  }

  try {
    const data = await db.chat.findMany({
      where: {
        botId,
      },
    });

    res.json({
      data,
    });
  } catch (error) {
    return await waErrorHandler({ botId, error, req, res });
  }
});

router.get("/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;
  const { botId } = getWaFromRequest(req);

  if (!botId) {
    return res.status(404).json({
      message: `Bot ${botId} not found`,
    });
  }

  try {
    const data = await db.chat.findFirst({
      where: {
        botId,
        senderId: toRecepientId(phoneNumber),
      },
    });

    res.json({
      data,
    });
  } catch (error) {
    return await waErrorHandler({ botId, error, req, res });
  }
});

export { router as chatsRouter };
