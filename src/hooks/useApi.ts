import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import { Notification } from "@utils/notification"
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
interface ApiOptions {
  url: string
  method?: ApiMethod
  headers?: Record<string, string>
  withAuth?: boolean
}

// get token
const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken")
}

// save token
export const setAuthToken = (token: string) => {
    localStorage.setItem("authToken", token)
}

// remove token
export const clearAuthToken = () => {
    localStorage.removeItem("authToken")
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
    const token = getAuthToken()
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
  options: ApiOptions,
  queryOptions?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<T, Error>({
    queryKey: [options.url],
    queryFn: () => fetchApi<T>(options),
    ...queryOptions,
  })
}

export function useApiMutation<T>(
  options: ApiOptions,
  mutationOptions?: Omit<UseMutationOptions<T, Error, any>, "mutationFn">,
) {
  return useMutation<T, Error, any>({
    mutationFn: (variables) => fetchApi<T>(options, variables),
    onSuccess:()=>{
      Notification("success", "Success: Data loaded successfully!")
    },
    onError:(error)=>{
      Notification("error", `Error: ${error.message}`)
    },
    ...mutationOptions,
  })
}

