import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import { Notification } from "@utils/notification"
import { getItem } from "@utils/storage-service"
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
interface ApiOptions {
  url: string
  method?: ApiMethod
  headers?: Record<string, string>
  withAuth?: boolean
}

async function fetchApi<T>(
  { url, method = "GET", headers = {}, withAuth = false }: ApiOptions,
  body?: any,
): Promise<T> {
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (withAuth) {
    const token = getItem('access_token')
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const options: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${url}`, options)

  if (!response.ok) {
    throw new Error("API request failed")
  }

  return response.json()
}

export function useApiQuery<T>(
  options: ApiOptions & { params?: { page: number; limit: number } }, // pagination object
  queryOptions?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">,
) {
  const { url, params, ...restOptions } = options;
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  return useQuery<T, Error>({
    queryKey: [url, params], // Pagination object queryKey ga kiritildi
    queryFn: () =>
      fetchApi<T>(
        { ...restOptions, url: `${url}?page=${page}&limit=${limit}` } // URL ichida pagination qo'shildi
      ),
    ...queryOptions,
  });
}

export function useApiMutation<T>(
  options: ApiOptions,
  mutationOptions?: Omit<UseMutationOptions<T, Error, any>, "mutationFn">,
) {
  return useMutation<T, Error, any>({
    mutationFn: (variables) => fetchApi<T>(options, variables),
    onSuccess:(data)=>{
      Notification("success", `Success: ${(data as any)?.message || 'Operation successful'}!`);
    },
    onError:(error)=>{
      Notification("error", `Error: ${error.message}`)
    },
    ...mutationOptions,
  })
}

