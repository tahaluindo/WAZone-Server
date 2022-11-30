import { Router } from "express";
import { getWaFromRequest } from "../..";
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
    const data = await db.contact.findMany({
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

export { router as contactsRouter };
