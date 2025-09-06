import type { Metadata } from 'next'
import { Inter, Poppins, Lato } from 'next/font/google'
import './globals.css'
import { ChatProvider } from '@/components/etw/chat-provider'
import { FloatingChat } from '@/components/etw/floating-chat'
import { GlobalChat } from '@/components/etw/global-chat'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins' 
})
const lato = Lato({ 
  subsets: ['latin'], 
  weight: ['300', '400', '700'],
  variable: '--font-lato' 
})

export const metadata: Metadata = {
  title: 'ETW - Escape The Weakness',
  description: 'Transform your life through discipline, strength, and community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ⬇️ AJOUTE cette ligne pour le favicon dans public/ */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${lato.variable} antialiased`}>
        <ChatProvider>
          {children}
          <GlobalChat />
        </ChatProvider>
      </body>
    </html>
  )
}