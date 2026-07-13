import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ThemeProvider } from '@/hooks/use-theme'
import { ToasterProvider } from '@/hooks/use-toast'
import { queryClient } from '@/lib/query-client'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToasterProvider>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </ToasterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
