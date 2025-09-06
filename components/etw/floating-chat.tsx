'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, X, Minus, Maximize2, Send, Users, Hash, GripVertical } from 'lucide-react'
import { Rnd } from 'react-rnd'

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'bookmark'
}

interface FloatingChatProps {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChat({ isOpen, onToggle }: FloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'System',
      content: 'Welcome to ETW! Complete your daily tasks to earn strength points.',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '2',
      user: 'Hugo',
      content: 'Ready to escape the weakness! 💪',
      timestamp: new Date(),
      type: 'message'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [size, setSize] = useState({ width: 400, height: 500 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Position par défaut (bas droite)
  const getDefaultPosition = () => ({
    x: window.innerWidth - 450,
    y: window.innerHeight - 550 // Bas de l'écran au lieu de 100px du haut
  })

  // Initialize position on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Récupérer la position sauvegardée ou utiliser la position par défaut
      const savedPosition = sessionStorage.getItem('floatingChatPosition')
      
      if (savedPosition) {
        const parsed = JSON.parse(savedPosition)
        setPosition(parsed)
      } else {
        const defaultPos = getDefaultPosition()
        setPosition(defaultPos)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'message'
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Sauvegarder la position quand elle change (seulement en session)
  const handleDragStop = (e: any, d: any) => {
    const newPosition = { x: d.x, y: d.y }
    setPosition(newPosition)
    // Sauvegarder seulement pour la session courante
    sessionStorage.setItem('floatingChatPosition', JSON.stringify(newPosition))
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        })
        const newPosition = { x: position.x, y: position.y }
        setPosition(newPosition)
        // Sauvegarder aussi lors du resize
        sessionStorage.setItem('floatingChatPosition', JSON.stringify(newPosition))
      }}
      minWidth={300}
      minHeight={200}
      maxWidth={600}
      maxHeight={800}
      bounds="window"
      dragHandleClassName="chat-drag-handle"
      className="z-50"
    >
      <div className="w-full h-full bg-card border border-border rounded-lg shadow-xl overflow-hidden">
        <div className="chat-drag-handle flex items-center justify-between p-3 border-b border-border bg-muted rounded-t-lg cursor-move">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">ETW Chat</span>
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              247
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="border-b border-border">
              <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span>general</span>
                <Badge variant="outline" className="text-xs">Home Campus</Badge>
              </div>
            </div>

            <ScrollArea className="flex-1 p-3" style={{ height: size.height - 140 }}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.user === 'System' ? 'S' : message.user[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Rnd>
  )
}