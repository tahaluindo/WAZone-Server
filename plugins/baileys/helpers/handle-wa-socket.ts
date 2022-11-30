import { DisconnectReason } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { useSleep } from "../../../helpers/use-sleep";
import { saveContactUpsert } from "../../prisma/functions/save-contact-upsert";
import { updateIsContactSynced } from "../../prisma/functions/update-is-contact-synced";
import { connectionUpdate } from "../events/connection-update";
import { contactsUpsert } from "../events/contacts-upsert";
import { messagesUpsert } from "../events/messages-upsert";
import { CreateWaSocket } from "./create-wa-socket";

export type HandleWaSocketOpts = CreateWaSocket & {
  onReconnect: () => Promise<void>;
  onRelog: () => Promise<void>;
};

export const handleWaSocket = (opts: HandleWaSocketOpts) => {
  const { sock } = opts;

  sock.ev.on(
    "connection.update",
    async (update) => await connectionUpdate({ ...opts, update })
  );

  sock.ev.on(
    "messages.upsert",
    async (event) => await messagesUpsert({ ...opts, event })
  );

  sock.ev.on("contacts.set", async ({ contacts, isLatest }) => {
    const isPersonalContact = contacts.some((contact) => contact.notify);
    if (isPersonalContact) {
      await contactsUpsert({ ...opts, contacts });
      await updateIsContactSynced({ botId: sock.id, isContactSynced: true });
    }
    // console.log("isLatest:", isLatest);
    // console.log("isPersonalContact:", isPersonalContact);
    // console.log("contacts.set:", contacts.length);
  });

  // sock.ev.on("contacts.upsert", async (contacts) => {
  //   console.log("contacts.upsert", contacts);
  //   await contactsUpsert({ ...opts, contacts });
  // });
};
