'use client'

import { FloatingChat } from './floating-chat'
import { useChat } from './chat-provider'

export function GlobalChat() {
  const { isChatOpen, toggleChat } = useChat()

  return <FloatingChat isOpen={isChatOpen} onToggle={toggleChat} />
}
