import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { Notification } from "@utils/notification"
import { getItem } from "@utils/storage-service"

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiOptions {
  url: string
  method?: ApiMethod
  headers?: Record<string, string>
}

async function fetchApi<T>(
  { url, method = "GET", headers = {} }: ApiOptions,
  body?: any
): Promise<T> {
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  const token = getItem("access_token")
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}), // ✅ Faqat POST yoki PUT bo‘lsa body qo‘shiladi
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, options)
    const responseBody = await response.text()

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${responseBody}`)
    }

    return responseBody ? (JSON.parse(responseBody) as T) : ({} as T) // ✅ Bo‘sh JSON bo‘lsa
  } catch (error) {
    console.error("fetchApi Error:", error)
    throw error
  }
}

export function useApiQuery<T>(
  options: ApiOptions & { params?: Record<string, string | number> }, 
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
  const queryClient = useQueryClient(); // ✅ QueryClient'ni olish

  return useMutation<T, Error, { data?: any; id?: string | number }>({
    mutationFn: async ({ data, id }) => {
      const url = id ? `${options.url}/${id}` : options.url; 
      return fetchApi<T>({ ...options, url }, data);
    },
    onSuccess: (data) => {
      Notification("success", `Success: ${(data as any)?.message || 'Operation successful'}!`);
      queryClient.invalidateQueries({ queryKey: [options.url] }); // ✅ Ma’lumotni yangilash
    },
    onError: (error) => {
      Notification("error", `Error: ${error.message}`);
    },
    ...mutationOptions,
  });
}
