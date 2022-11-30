import {
  createWaSocket,
  CreateWaSocketOpts,
  WaSock,
  WaStore,
} from "./helpers/create-wa-socket";
import { handleWaSocket } from "./helpers/handle-wa-socket";

export type UseBaileysOpts = CreateWaSocketOpts;

export const useBaileys = async (id: string, opts: UseBaileysOpts = {}) => {
  let _sock: WaSock;
  let _store: WaStore;

  const setSockAndStore = async () => {
    const { sock, store } = await createWaSocket(id, opts);
    _sock = sock;
    _store = store;
  };

  await setSockAndStore();

  handleWaSocket({
    sock: _sock!,
    store: _store!,
    onReconnect: async () => await opts?.onReconnect?.(),
    onRelog: async () => await opts?.onRelog?.(),
  });

  return {
    sock: _sock!,
    store: _store!,
  };
};
