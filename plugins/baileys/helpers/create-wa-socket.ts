import makeWASocket, {
  AnyWASocket,
  makeInMemoryStore,
  useMultiFileAuthState,
} from "@adiwajshing/baileys";
import { getPath } from "./get-path";
import pino from "pino";
import { SetWaOpts } from "../../..";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

export type WaStore = ReturnType<typeof makeInMemoryStore>;
export type WaSock = AnyWASocket & {
  id: string;
  opts?: SetWaOpts;
};

export type CreateWaSocket = {
  sock: WaSock;
  store: WaStore;
};

export type CreateWaSocketOpts = {
  name?: string;
  onReconnect?: () => Promise<void>;
  onRelog?: () => Promise<void>;
};

export const createWaSocket = async (
  id: string,
  opts: CreateWaSocketOpts = {}
): Promise<CreateWaSocket> => {
  opts = {
    name: "WAZONE",
    ...opts,
  };

  const { authPath, storePath } = getPath(id);
  // Auth
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  // Store
  const store = makeInMemoryStore({});
  store.readFromFile(storePath);
  setInterval(async () => {
    const folderPath = storePath.split("/").slice(0, -1).join("/");
    if (!existsSync(folderPath)) await mkdir(folderPath, { recursive: true });
    store.writeToFile(storePath);
  }, 10_000);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    keepAliveIntervalMs: 1000 * 60 * 15,
    browser: [opts.name!, "MacOs", "1.0.0"],
    logger: pino({ level: "silent" }),
  });

  (sock as WaSock).id = id;
  (sock as WaSock).opts = { name: opts.name! };

  // Save Auth
  sock.ev.on("creds.update", saveCreds);

  // Bind Sore
  store.bind(sock.ev);

  return {
    sock: sock as WaSock,
    store: store as WaStore,
  };
};
