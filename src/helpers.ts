export const createRandomString = (length: number = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateFilename = (srcName: string) => {
  return `${createRandomString(18)}.${srcName.split(".")[1]}`;
};

export const getStoragePathRef = (path: string) => {
  return decodeURIComponent(path.split("/o/")[1].split("?")[0]);
};
