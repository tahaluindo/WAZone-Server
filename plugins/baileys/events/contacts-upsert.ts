import { Contact } from "@adiwajshing/baileys";
import { saveContactUpsert } from "../../prisma/functions/save-contact-upsert";
import { updateIsContactSynced } from "../../prisma/functions/update-is-contact-synced";
import { HandleWaSocketOpts } from "../helpers/handle-wa-socket";

type Opts = HandleWaSocketOpts & {
  contacts: Contact[];
};

export const contactsUpsert = async (opts: Opts) => {
  // console.log("contactsUpsert start");
  const { contacts, sock } = opts;

  await saveContactUpsert({ botId: sock.id, contacts });
  // console.log("contactsUpsert finished");

  await updateIsContactSynced({ botId: sock.id, isContactSynced: true });
};
