import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n.ts'
import Root from './router/index.tsx'
createRoot(document.getElementById('root')!).render(
    <Root />
)
