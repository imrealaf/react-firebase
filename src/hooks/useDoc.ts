import { useCallback, useState } from "react";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  FieldValue,
  DocumentData,
  FirestoreError,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import useSWR, { SWRConfiguration } from "swr";
import { unset } from "lodash";
import { merge } from "ts-deepmerge";

import { Document, AllowType, DocumentOptions } from "../types";
import { getDocument, withDocumentDataSanitized } from "../firestore";

export type UseDocOptions = DocumentOptions & {
  /** SWR configuration options */
  swrConfig?: SWRConfiguration;
};

const defaultOptions: UseDocOptions = {
  sanitize: {},
};

function useDoc<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(initialPath: string | null = null, options: UseDocOptions = {}) {
  const { parseDates, swrConfig, sanitize } = merge(defaultOptions, options);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  const swr = useSWR<Doc | null>(
    initialPath,
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

  const { data, isLoading, isValidating, mutate: revalidate } = swr;

  const add = useCallback(
    async (
      collectionName: string,
      id: string | undefined,
      newData: Partial<AllowType<DocumentData, FieldValue>>
    ) => {
      if (!collectionName) return;

      setError(null);
      setIsPending(true);

      const finalData = withDocumentDataSanitized(newData, sanitize);

      try {
        (await id)
          ? setDoc(doc(getFirestore(), collectionName, id as string), finalData)
          : addDoc(collection(getFirestore(), collectionName), finalData);
        // @ts-ignore
        revalidate((prevState = {}) => {
          return {
            ...prevState,
            ...finalData,
          };
        });
      } catch (error) {
        console.log(error);
        setError(error as FirestoreError);
      } finally {
        setIsPending(false);
      }
    },
    [revalidate]
  );

  /**
   * update
   * @description used for updating a document. Updates swr state upon success
   */
  const update = useCallback(
    async (updatedData: Partial<AllowType<DocumentData, FieldValue>>) => {
      if (!initialPath) return;

      setError(null);
      setIsPending(true);

      const id = updatedData.id || data?.id;
      const ref = doc(getFirestore(), initialPath);
      try {
        await setDoc(ref, withDocumentDataSanitized(updatedData, sanitize));
        /* istanbul ignore next */
        // @ts-ignore
        revalidate((prevState = {}) => {
          const newState = {
            ...prevState,
            ...updatedData,
          };
          if (id) newState.id = id;
          return newState;
        });
      } catch (error) {
        console.log(error);
        setError(error as FirestoreError);
      } finally {
        setIsPending(false);
      }
    },
    [initialPath, revalidate]
  );

  /**
   * remove
   * @description delete a document with given path. Uses initial path if path is not provided
   */
  const remove = useCallback(
    async (path?: string) => {
      let removePath = initialPath || path || "";
      if (!removePath) return;

      setError(null);
      setIsPending(true);

      const ref = doc(getFirestore(), removePath);
      try {
        await deleteDoc(ref);
        return true;
      } catch (error) {
        console.log(error);
        setError(error as FirestoreError);
      } finally {
        setIsPending(false);
      }
    },
    [initialPath]
  );

  return {
    data,
    isLoading,
    isPending,
    isValidating,
    is404: data === null,
    exists: Boolean(data),
    error,
    add,
    update,
    remove,
    revalidate,
  };
}

export default useDoc;
