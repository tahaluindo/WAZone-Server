export const useSleep = async (ms: number = 2000) =>
  await new Promise((r) => setTimeout(r, ms));
