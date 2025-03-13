import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { Notification } from "@utils/notification"
import { getItem } from "@utils/storage-service"

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
interface QueryParams {
  id?: any;
  type?: string; 
}

interface ApiOptions {
  url: string
  method?: ApiMethod
  headers?: Record<string, string>
  enabled?: boolean
}

async function fetchApi<T>(
  { url, method = "GET", headers = {} }: ApiOptions,
  body?: any
): Promise<T> {
  const requestHeaders: Record<string, string> = {
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }), // FormData bo‘lsa Content-Type bermaymiz
    ...headers,
  };

  const token = getItem("access_token");
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}), 
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, options);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${responseBody}`);
    }

    return responseBody ? (JSON.parse(responseBody) as T) : ({} as T);
  } catch (error) {
    console.error("fetchApi Error:", error);
    throw error;
  }
}


export function useApiQuery<T>(
  options: ApiOptions & { params?: any }, 
  queryOptions?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) {
  const { url, params, ...restOptions } = options;
  const queryString = params 
    ? "?" + new URLSearchParams(params as Record<string, string>).toString() 
    : "";

  return useQuery<T, Error>({
    queryKey: [url, params],
    queryFn: () => fetchApi<T>({ ...restOptions, url: `${url}${queryString}` }),
    ...queryOptions,
  });
}

export function useApiMutation<T>(
  options: ApiOptions,
  mutationOptions?: Omit<UseMutationOptions<T, Error, any>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, { data?: any; id?: string | number; isFile?: boolean }>({
    mutationFn: async ({ data, id, isFile }) => {
      const url = id ? `${options.url}/${id}` : options.url;

      // Fayl yuklash uchun `FormData`
      const body = isFile && data instanceof File ? new FormData() : data;
      if (body instanceof FormData) {
        body.append("file", data);
      }

      return fetchApi<T>({ ...options, url }, body);
    },
    onSuccess: (data) => {
      Notification("success", `Success: ${(data as any)?.message || "Operation successful"}!`);
      queryClient.invalidateQueries({ queryKey: [options.url] });
    },
    onError: (error) => {
      Notification("error", `Error: ${error.message}`);
    },
    ...mutationOptions,
  });
}


export function useSingleItem<T>(
  resourceUrl: string,
  params: QueryParams, 
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) {
  const queryParams = {
    ...(params.id !== undefined && { id: params.id }),
    ...(params.type !== undefined && { type: params.type }),
  };

  return useApiQuery<T>(
    {
      url: resourceUrl,
      method: "GET",
      params: queryParams,
    },
    {
      ...options,
      enabled: !!(params.id || params.type), 
    }
  );
}