import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APIIC Admin',
  description: 'APIIC administrative dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </body>
    </html>
  )
}
