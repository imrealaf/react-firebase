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
} from "firebase/firestore";
import useSWR, { SWRConfiguration } from "swr";
import { unset } from "lodash";

import { Document, AllowType, DocumentOptions } from "../types";
import { getDocument } from "../firestore";

export type UseDocOptions = DocumentOptions & {
  /** SWR configuration options */
  swrConfig?: SWRConfiguration;
};

function removeIdFromData<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(data: Doc) {
  const output = {};
  Object.keys(data)
    .filter((key) => key !== "id")
    .forEach((key) => {
      output;
    });
}

function useDoc<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(path: string | null = null, options: UseDocOptions = {}) {
  const { parseDates, swrConfig } = options;

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

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

  const add = useCallback(
    async (
      collectionName: string,
      id: string | undefined,
      newData: Partial<AllowType<DocumentData, FieldValue>>
    ) => {
      if (!collectionName) return;

      setError(null);
      setIsPending(true);

      try {
        (await id)
          ? setDoc(doc(getFirestore(), collectionName, id as string), newData)
          : addDoc(collection(getFirestore(), collectionName), newData);
        // @ts-ignore
        connectedMutate((prevState = {}) => {
          return {
            ...prevState,
            ...newData,
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

  /**
   * update
   * @description used for updating a document. Updates swr state upon success
   */
  const update = useCallback(
    async (updatedData: Partial<AllowType<DocumentData, FieldValue>>) => {
      if (!path) return;

      setError(null);
      setIsPending(true);

      const id = updatedData.id || data?.id;
      const ref = doc(getFirestore(), path);
      try {
        // Make sure id is removed
        unset(updatedData, "id");

        await setDoc(ref, updatedData);
        // @ts-ignore
        connectedMutate((prevState = {}) => {
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
    add,
    update,
  };
}

export default useDoc;
