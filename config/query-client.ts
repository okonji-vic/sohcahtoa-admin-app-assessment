import {
    isServer,
    MutationCache,
    QueryCache,
    QueryClient,
  } from "@tanstack/react-query";
  import { AxiosError } from "axios";
  import { toast } from "sonner";
  
  const handleError = (error: AxiosError) => {
    if (isServer) return;
  
    toast.error(error.name, {
      description: error.message || "Error",
    });
  };
  
  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  
    queryCache: new QueryCache({
      onError: (error) => handleError(error as AxiosError),
    }),
  
    mutationCache: new MutationCache({
      onError: (error) => handleError(error as AxiosError),
    }),
  });
  
  export const invalidateQuery = (key: string[]) => {
    queryClient.invalidateQueries({ queryKey: key });
  };