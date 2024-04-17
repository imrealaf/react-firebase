import { useCallback, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { merge } from "ts-deepmerge";

import { Document } from "../types";
import { get } from "../database";

export type UseDbOptions = {
  /** SWR configuration options */
  swrConfig?: SWRConfiguration;
};

const defaultOptions: UseDbOptions = {};

function useDb<Data>(
  initialPath: string | null = null,
  options: UseDbOptions = {}
) {
  const { swrConfig } = merge(defaultOptions, options);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const swr = useSWR<Data | null>(
    initialPath,
    async (path: string) => {
      setError(null);
      try {
        const data = await get<Data>(path);
        return data;
      } catch (error) {
        console.log(error);
        setError(error);
        return null;
      }
    },
    swrConfig
  );

  const { data, isLoading, isValidating, mutate: revalidate } = swr;

  return {
    data,
    isLoading,
    isPending,
    isValidating,
    is404: data === null,
    exists: Boolean(data),
    error,
    revalidate,
  };
}

export default useDb;
