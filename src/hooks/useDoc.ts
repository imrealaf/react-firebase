import { useCallback } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  FieldValue,
  DocumentData,
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

  /**
   * Get document on mount with SWR
   */
  const swr = useSWR<Doc | null>(
    path,
    async (path: string) => {
      const data = await getDocument<Doc>(path, { parseDates });
      return data;
    },
    swrConfig
  );

  const { data, error, isLoading, isValidating, mutate: connectedMutate } = swr;

  /**
   * set
   * @description used for updating a document. Updates swr cache as well
   */
  const set = useCallback(
    (data: Partial<AllowType<DocumentData, FieldValue>>) => {
      // @ts-ignore
      connectedMutate((prevState = {}) => {
        return {
          ...prevState,
          ...data,
        };
      });
      if (!path) return null;
      const ref = doc(getFirestore(), path);
      return setDoc(ref, data);
    },
    [path, connectedMutate]
  );

  return {
    data,
    isLoading,
    isValidating,
    error,
    set,
  };
}

export default useDoc;
