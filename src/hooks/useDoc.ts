import { useCallback, useState } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  FieldValue,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";
import useSWR, { SWRConfiguration } from "swr";

import { Document, AllowType, DocumentOptions } from "../types";
import { getDocument } from "../firestore";

export type UseDocOptions = DocumentOptions & {
  /** Optionally configure SWR in the scope of this hook */
  swrConfig?: SWRConfiguration;
};

function useDoc<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(path: string, options: UseDocOptions = {}) {
  const { parseDates, swrConfig } = options;

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  /**
   * Get document on mount with SWR
   */
  const swr = useSWR<Doc | null>(
    path,
    async (path: string) => {
      setError(null);
      try {
        const data = await getDocument<Doc>(path, { parseDates });
        return data;
      } catch (error) {
        console.log(error);
        setError(error as FirestoreError);
        return null;
      }
    },
    swrConfig
  );

  const { data, isLoading, isValidating, mutate: connectedMutate } = swr;

  /**
   * update
   * @description used for updating a document. Updates swr cache as well
   */
  const update = useCallback(
    async (updatedData: Partial<AllowType<DocumentData, FieldValue>>) => {
      if (!path) return null;

      setError(null);
      setIsPending(true);

      const ref = doc(getFirestore(), path);
      try {
        await setDoc(ref, updatedData);
        // @ts-ignore
        connectedMutate((prevState = {}) => {
          return {
            ...prevState,
            ...updatedData,
          };
        });
      } catch (error) {
        console.log(error);
        setError(error as FirestoreError);
      } finally {
        setIsPending(false);
      }
    },
    [path, connectedMutate]
  );

  return {
    data,
    isLoading,
    isPending,
    isValidating,
    is404: data === null,
    exists: Boolean(data),
    error,
    update,
  };
}

export default useDoc;
