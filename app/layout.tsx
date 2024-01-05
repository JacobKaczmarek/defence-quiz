import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import TRPCProvider from './_trpc/TRPCProvider'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TRPCProvider>
            <div className='h-screen container mx-auto flex flex-col'>
              <Navbar />
              <main className='flex-1 my-4'>
                {children}
              </main>
            </div>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}