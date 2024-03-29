import useSWR, { SWRConfiguration, useSWRConfig } from "swr";

import { getCollection } from "../firestore";
import { Document, DocumentOptions, CollectionQuery } from "../types";

export type UseCollectionOptions<Doc extends Document = Document> =
  DocumentOptions & {
    /** Query constraints for collection */
    query?: CollectionQuery<Doc>;
    /** Optionally configure SWR in the scope of this hook */
    swrConfig?: SWRConfiguration;
  };

function useCollection<
  Data extends object = {},
  Doc extends Document = Document<Data>
>(path: string, options: UseCollectionOptions = {}) {
  const { query, parseDates, swrConfig } = options;

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

  const { data, isValidating, isLoading, error, mutate: revalidate } = swr;

  return {
    data,
    isLoading,
    isValidating,
    error,
    empty: data && data.length === 0,
    revalidate,
  };
}

export default useCollection;
