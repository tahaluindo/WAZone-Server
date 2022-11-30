import { Router } from "express";
import { deleteWa, getWaFromRequest, setWa } from "../..";
import { db } from "../../plugins/prisma";
import { waErrorHandler } from "../middlewares/wa-error-handler";

const router = Router();

router.get("/", async (req, res) => {
  const { botId } = getWaFromRequest(req);
  const data = await db.bot.findFirst({
    where: {
      id: botId,
    },
  });

  res.json({ data });
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const data = await db.bot.create({
      data: {
        name,
      },
    });

    if (data) {
      await setWa(data.id, { name: data.name });
    }

    res.json({
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message ?? "Unexpected error",
    });
  }
});

router.post("/up", async (req, res) => {
  const { botId, wa } = getWaFromRequest(req);
  const bot = await db.bot.findFirst({
    where: {
      id: botId,
    },
  });

  if (!bot) {
    return res.status(404).json({
      message: `Bot with id: ${botId} not found`,
    });
  }

  if (wa) {
    return res.json({
      message: `Bot ${botId} already up`,
    });
  }

  await setWa(botId, { name: bot.name });

  res.json({
    message: `Bot with id: ${botId} successfully up`,
  });
});

router.post("/down", async (req, res) => {
  const { botId, wa } = getWaFromRequest(req);
  try {
    if (!wa) {
      return res.status(404).json({
        message: `Bot ${botId} not found`,
      });
    }

    await wa.sock.logout();
    await deleteWa(botId);

    res.json({
      message: `Bot with id: ${botId} down`,
    });
  } catch (error) {
    return await waErrorHandler({ botId, error, req, res });
  }
});

export { router as botsRouter };
