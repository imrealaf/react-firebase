import { useCallback, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { merge } from "ts-deepmerge";

import { generateFilename, getStoragePathRef } from "../helpers";

export type UseStorageOptions = {
  basePath?: string;
  autoGenerateFilenames?: boolean;
};

/**
 * Default UseStorageOptions
 */
const defaultStorageOptions: UseStorageOptions = {
  basePath: "",
  autoGenerateFilenames: false,
};

/**
 * useStorage
 */
function useStorage(options: UseStorageOptions = {}) {
  // Merge options
  const { basePath, autoGenerateFilenames } = merge(
    defaultStorageOptions,
    options
  );

  const [isPending, setIsPending] = useState(false);

  /**
   * uploadFile
   * @returns
   */
  const uploadFile = useCallback(
    async (file: File, name?: string): Promise<string | undefined> => {
      setIsPending(true);

      // Sort out filename and get reference
      const fileName =
        name ||
        (autoGenerateFilenames
          ? generateFilename((file as File).name)
          : (file as File).name);
      const storageRef = ref(getStorage(), `${basePath}/${fileName}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
      } catch (error) {
        console.log(error);
      } finally {
        setIsPending(false);
      }
    },
    [getStorage, uploadBytes, getDownloadURL]
  );

  /**
   * deleteFile
   */
  const deleteFile = useCallback(
    async (filePath: string) => {
      const storageRef = ref(getStorage(), getStoragePathRef(filePath));
      setIsPending(true);
      try {
        await deleteObject(storageRef);
        return true;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        setIsPending(false);
      }
    },
    [getStorage, deleteObject]
  );

  return {
    isPending,
    uploadFile,
    deleteFile,
  };
}

export default useStorage;
