import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import TRPCProvider from './_trpc/TRPCProvider'
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from '@/components/ui/toaster'


export const metadata: Metadata = {
  title: 'Savage Academy',
  description: 'Aplikacja do przeprowadzania quizów dla zawodników',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TRPCProvider>
            <SessionProvider session={session}>
              <div className='h-screen container mx-auto flex flex-col'>
                <Navbar />
                <main className='flex-1 my-4'>
                  {children}
                </main>
              </div>
            </SessionProvider>
          </TRPCProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
