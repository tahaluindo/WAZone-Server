import { Contact as ContactWa } from "@adiwajshing/baileys";
import { db } from "..";

type Opts = {
  botId: string;
  contacts: ContactWa[];
};

export const saveContactUpsert = async ({ botId, contacts }: Opts) => {
  const results = await db.$transaction(
    contacts.map((contact) => {
      return db.contact.create({
        data: {
          name: contact.name! ?? contact.notify,
          waId: contact.id,
          botId,
        },
      });
    })
  );

  return results;
};
