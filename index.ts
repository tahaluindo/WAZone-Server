import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

import { rm } from "node:fs/promises";
import { botsRouter } from "./api/bots";
import { chatsRouter } from "./api/chats";
import { contactsRouter } from "./api/contacts";
import { messagesRouter } from "./api/messages";
import { useSleep } from "./helpers/use-sleep";
import { useBaileys } from "./plugins/baileys";
import { WaSock, WaStore } from "./plugins/baileys/helpers/create-wa-socket";
import { getPath } from "./plugins/baileys/helpers/get-path";
import { useServer } from "./plugins/express";
import { deleteAllChat } from "./plugins/prisma/functions/delete-all-chat";
import { deleteAllContact } from "./plugins/prisma/functions/delete-all-contact";
import { deleteAllMessage } from "./plugins/prisma/functions/delete-all-message";
import { deleteBot } from "./plugins/prisma/functions/delete-bot";
import { updateIsContactSynced } from "./plugins/prisma/functions/update-is-contact-synced";

const port = process.env.PORT || 5000;

const main = async () => {
  const { app } = useServer({ port });

  app.use("/bots", botsRouter);
  app.use("/contacts", contactsRouter);
  app.use("/messages", messagesRouter);
  app.use("/chats", chatsRouter);

  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

// Handle WA Client -------------------------------------------------------------

export type Wa = { sock: WaSock; store: WaStore };
export type SetWaOpts = { name: string };

const waMap = new Map<string, Wa>();
export const getWa = (id: string) => waMap.get(id) as Wa;
export const setWa = async (
  id: string,
  opts: SetWaOpts = { name: "WAZONE" }
) => {
  const { name } = opts;
  const { sock, store } = await useBaileys(id, {
    name,
    onReconnect: async () => await setWa(id, opts),
    onRelog: async () => await deleteWa(id),
  });
  waMap.set(id, { sock, store });
};
export const deleteWa = async (id: string) => {
  await useSleep(200);
  waMap.delete(id);
  const { storePath, authPath, mediaPath } = getPath(id);
  await useSleep(200);
  await rm(authPath, { recursive: true, force: true });
  await rm(mediaPath, { recursive: true, force: true });
  await useSleep(200);
  await rm(storePath, { recursive: true, force: true });
  await deleteAllContact({ botId: id });
  await deleteAllMessage({ botId: id });
  await deleteAllChat({ botId: id });
  await deleteBot({ botId: id });
};
export const getWaFromRequest = (req: Request) => {
  const { "x-bot-id": botId }: any = req.headers;

  return { botId, wa: getWa(botId) };
};

main();
