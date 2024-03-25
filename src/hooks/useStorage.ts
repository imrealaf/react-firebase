import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
  StorageError,
  deleteObject,
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

  // States
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<StorageError | null>(null);

  const reset = () => {
    setProgress(0);
    setError(null);
    setIsPending(false);
  };

  /**
   * onUploadProgress
   * @param snapshot
   */
  const onUploadProgress = (snapshot: UploadTaskSnapshot) => {
    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  };

  /**
   * upload
   * @returns Download URL
   */
  const uploadFile = (file: File, name?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      reset();
      setIsPending(true);

      // Sort out filename and get reference
      const fileName =
        name ||
        (autoGenerateFilenames
          ? generateFilename((file as File).name)
          : (file as File).name);
      const storageRef = ref(getStorage(), `${basePath}/${fileName}`);

      /**
       * Start upload process
       */
      uploadBytesResumable(storageRef, file).on(
        "state_changed",

        // On progess
        onUploadProgress,

        // On error
        (error) => {
          setError(error);
          setIsPending(false);
          reject(error);
        },

        // On complete
        async () => {
          const url = await getDownloadURL(storageRef);
          setIsPending(false);
          resolve(url);
        }
      );
    });
  };

  /**
   * remove
   */
  const deleteFile = async (filePath: string) => {
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
  };

  return {
    isPending,
    progress,
    error,
    uploadFile,
    deleteFile,
  };
}

export default useStorage;
