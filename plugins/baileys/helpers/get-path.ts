export const getPath = (id: string) => {
  const storagePath = "./.storage";
  const storePath = `${storagePath}/store/${id}.json`;
  const authPath = `${storagePath}/auth/${id}`;
  const mediaPath = `${storagePath}/media/${id}`;

  return {
    storePath,
    authPath,
    storagePath,
    mediaPath,
  };
};
