import { Router } from "express";
import { getWaFromRequest } from "../..";
import { sendMessage } from "../../plugins/baileys/helpers/send-message";
import { db } from "../../plugins/prisma";
import { waErrorHandler } from "../middlewares/wa-error-handler";

const router = Router();

router.get("/", async (req, res) => {
  const { wa, botId } = getWaFromRequest(req);
  if (!wa) {
    return res.status(404).json({
      message: `Bot ${botId} not found`,
    });
  }

  try {
    const data = await db.message.findMany({
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

router.get("/:chatId", async (req, res) => {
  const { wa, botId } = getWaFromRequest(req);
  const { chatId }: any = req.params;
  if (!wa) {
    return res.status(404).json({
      message: `Bot ${botId} not found`,
    });
  }

  try {
    const data = await db.message.findMany({
      where: {
        botId,
        chatId,
      },
    });

    res.json({
      data,
    });
  } catch (error) {
    return await waErrorHandler({ botId, error, req, res });
  }
});

router.post("/", async (req, res) => {
  const { wa, botId } = getWaFromRequest(req);

  if (!wa) {
    return res.status(404).json({
      message: `Bot ${botId} not found`,
    });
  }

  try {
    const { phoneNumber, content } = req.body;
    const result = await sendMessage({ sock: wa.sock, phoneNumber, content });

    res.json(result);
  } catch (error) {
    return await waErrorHandler({ botId, error, req, res });
  }
});

export { router as messagesRouter };
