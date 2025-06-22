import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lunch App',
  description: 'Check today\'s lunch menu at Unica restaurants.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  }
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
        </AuthProvider>
      </body>
    </html>
  )
}
