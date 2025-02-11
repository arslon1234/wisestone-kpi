import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n.ts'
import Root from './router/index.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import '@ant-design/v5-patch-for-react-19';
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <Root />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
)
