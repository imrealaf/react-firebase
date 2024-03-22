import useSWR, { SWRConfiguration } from "swr";

import { getCollection } from "../firestore";
import { Document, DocumentOptions, CollectionQuery } from "../types";

export type UseCollectionOptions = DocumentOptions & {
  /** Optionally configure SWR in the scope of this hook */
  swrConfig?: SWRConfiguration;
};

function useCollection<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(
  path: string,
  query: CollectionQuery<Doc> = {},
  options: UseCollectionOptions = {}
) {
  const { parseDates, swrConfig } = options;

  const swr = useSWR<Doc[] | null>(
    path,
    async (path: string) => {
      const data = await getCollection<Doc>(path, query, {
        parseDates,
      });
      return data;
    },
    swrConfig
  );

  const { data, isValidating, isLoading, error } = swr;

  return {
    data,
    isLoading,
    isValidating,
    error,
    empty: data && data.length === 0,
  };
}

export default useCollection;
