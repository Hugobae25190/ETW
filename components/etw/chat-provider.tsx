'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ChatContextType {
  isChatOpen: boolean
  toggleChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Persist chat state in localStorage
  useEffect(() => {
    const savedChatState = localStorage.getItem('etw-chat-open')
    if (savedChatState === 'true') {
      setIsChatOpen(true)
    }
  }, [])

  const toggleChat = () => {
    const newState = !isChatOpen
    setIsChatOpen(newState)
    localStorage.setItem('etw-chat-open', newState.toString())
  }

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
