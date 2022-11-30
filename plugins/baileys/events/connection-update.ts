import { ConnectionState, DisconnectReason } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { useSleep } from "../../../helpers/use-sleep";
import { deleteQrCode } from "../../prisma/functions/delete-qr-code";
import { saveQrCode } from "../../prisma/functions/save-qr-code";
import { updateConnection } from "../../prisma/functions/update-connection";
import { updateError } from "../../prisma/functions/update-error";
import { HandleWaSocketOpts } from "../helpers/handle-wa-socket";

type Opts = HandleWaSocketOpts & {
  update: Partial<ConnectionState>;
};

export const connectionUpdate = async (opts: Opts) => {
  const { update, onReconnect, onRelog, sock } = opts;
  const { connection, lastDisconnect, qr: qrCode } = update;
  const botId = sock.id;
  const botOpts = sock.opts;

  if (qrCode) {
    await saveQrCode({ botId, qrCode });
  }

  if (connection === "close") {
    const output = (lastDisconnect?.error as Boom)?.output;
    const shouldReconnect = output?.statusCode !== DisconnectReason.loggedOut;
    const shouldRelog = output?.statusCode === DisconnectReason.loggedOut;

    await updateError({
      botId,
      error: { ...lastDisconnect?.error, shouldReconnect, shouldRelog },
    });

    // reconnect if not logged out
    if (shouldReconnect) {
      await useSleep(5);
      await onReconnect?.();
    }

    if (shouldRelog) {
      await useSleep(5);
      await onRelog?.();
    }
  }

  if (connection === "open") {
    await deleteQrCode({ botId });
    await updateError({
      botId,
      error: null,
    });
  }

  await updateConnection({ botId, connection });
};
