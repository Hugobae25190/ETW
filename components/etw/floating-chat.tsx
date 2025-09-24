'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MessageCircle, X, Minus, Maximize2, Send, Users, Hash, GripVertical, Briefcase, Apple, Dumbbell, ChevronDown, Heart, Reply, Flag, Smile, Plus, Paperclip } from 'lucide-react'
import { Rnd } from 'react-rnd'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'bookmark'
  reactions?: { emoji: string; count: number; users: string[] }[]
  replies?: Message[]
  isReply?: boolean
  parentId?: string
  files?: File[]
}

interface SubChat {
  id: string
  name: string
  description: string
  messages: Message[]
}

interface ChatRoom {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  subChats: SubChat[]
}

interface FloatingChatProps {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChat({ isOpen, onToggle }: FloatingChatProps) {
  // Initialisation des chats avec sous-chats
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: 'general',
      name: 'General',
      icon: <Hash className="h-4 w-4" />,
      description: 'Home Campus',
      subChats: [
        {
          id: 'general',
          name: 'General',
          description: 'Main discussion',
          messages: [
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
          ]
        }
      ]
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'Professional',
      subChats: [
        {
          id: 'help',
          name: 'Help',
          description: 'Support & Assistance',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Business Help! Get support for professional challenges.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        },
        {
          id: 'sops',
          name: 'SOPs',
          description: 'Standard Operating Procedures',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to SOPs chat! Share and discuss standard operating procedures.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        },
        {
          id: 'marketing',
          name: 'Marketing',
          description: 'Marketing Strategies',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Marketing chat! Share marketing strategies and campaigns.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: <Apple className="h-4 w-4" />,
      description: 'Health & Diet',
      subChats: [
        {
          id: 'fat-loss',
          name: 'Fat Loss',
          description: 'Weight Loss Strategies',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Fat Loss chat! Share tips and strategies for healthy weight loss.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        },
        {
          id: 'bulking',
          name: 'Bulking',
          description: 'Muscle Building Nutrition',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Bulking chat! Share nutrition tips for muscle building.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        }
      ]
    },
    {
      id: 'body',
      name: 'Body',
      icon: <Dumbbell className="h-4 w-4" />,
      description: 'Fitness & Training',
      subChats: [
        {
          id: 'workouts',
          name: 'Workouts',
          description: 'Training Routines',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Workouts chat! Share training routines and exercise tips.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        },
        {
          id: 'progress',
          name: 'Progress',
          description: 'Fitness Achievements',
          messages: [
            {
              id: '1',
              user: 'System',
              content: 'Welcome to Progress chat! Share your fitness achievements and milestones.',
              timestamp: new Date(),
              type: 'system'
            }
          ]
        }
      ]
    }
  ])

  const [activeChatId, setActiveChatId] = useState('general')
  const [activeSubChatId, setActiveSubChatId] = useState('general')
  const [newMessage, setNewMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [size, setSize] = useState({ width: 400, height: 500 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const [isHoveringSubmenu, setIsHoveringSubmenu] = useState(false)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null)
  const [previewScale, setPreviewScale] = useState(1)

  // Obtenir le chat et sous-chat actifs avec vérifications de sécurité
  const activeChat = chatRooms.find(chat => chat.id === activeChatId) || chatRooms[0]
  const activeSubChat = activeChat?.subChats?.find(subChat => subChat.id === activeSubChatId) || activeChat?.subChats?.[0]

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

  // Cleanup des timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Fermer le sélecteur d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && !(event.target as Element).closest('[data-emoji-picker]')) {
        setShowEmojiPicker(null)
      }
      if (showInputEmojiPicker && !(event.target as Element).closest('[data-input-emoji-picker]')) {
        setShowInputEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker, showInputEmojiPicker])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeSubChat?.messages])

  const handleSendMessage = () => {
    if ((newMessage.trim() || selectedFiles.length > 0) && activeChatId && activeSubChatId) {
      const message: Message = {
        id: Date.now().toString(),
        user: 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'message',
        reactions: [],
        replies: [],
        isReply: !!replyingToMessage,
        parentId: replyingToMessage?.id,
        files: selectedFiles.length > 0 ? selectedFiles : undefined
      }
      
      // Mettre à jour les messages du sous-chat actif
      setChatRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === activeChatId 
            ? {
                ...room,
                subChats: room.subChats?.map(subChat =>
                  subChat.id === activeSubChatId
                    ? { ...subChat, messages: [...(subChat.messages || []), message] }
                    : subChat
                ) || []
              }
            : room
        )
      )
      setNewMessage('')
      setReplyingToMessage(null)
      setSelectedFiles([])
      setShowInputEmojiPicker(false) // Fermer le sélecteur d'emojis après envoi
    }
  }

  const handleChatChange = (chatId: string) => {
    setActiveChatId(chatId)
    // Réinitialiser le sous-chat au premier du nouveau chat
    const newChat = chatRooms.find(chat => chat.id === chatId)
    if (newChat && newChat.subChats && newChat.subChats.length > 0) {
      setActiveSubChatId(newChat.subChats[0].id)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChatHover = (chatId: string) => {
    // Annuler tous les timeouts existants
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    
    // Programmer l'ouverture du sous-menu
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredChatId(chatId)
    }, 400)
  }

  const handleChatLeave = () => {
    // Annuler l'ouverture si on quitte avant le délai
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    // Programmer la fermeture seulement si on n'est pas en train de survoler le sous-menu
    if (!isHoveringSubmenu) {
      closeTimeoutRef.current = setTimeout(() => {
        setHoveredChatId(null)
      }, 200)
    }
  }

  const handleSubMenuEnter = () => {
    setIsHoveringSubmenu(true)
    // Annuler la fermeture programmée
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleSubMenuLeave = () => {
    setIsHoveringSubmenu(false)
    setHoveredChatId(null)
  }

  const handleSubChatClick = (chatId: string, subChatId: string) => {
    setActiveChatId(chatId)
    setActiveSubChatId(subChatId)
    setHoveredChatId(null)
    setIsHoveringSubmenu(false)
    setIsMainMenuOpen(false)
  }

  const handleMainMenuToggle = () => {
    setIsMainMenuOpen(!isMainMenuOpen)
    setHoveredChatId(null) // Fermer les sous-menus quand on ouvre/ferme le menu principal
    setIsHoveringSubmenu(false)
  }

  const handleMessageReaction = (messageId: string, emoji: string) => {
    setChatRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === activeChatId 
          ? {
              ...room,
              subChats: room.subChats?.map(subChat =>
                subChat.id === activeSubChatId
                  ? {
                      ...subChat,
                      messages: subChat.messages?.map(msg =>
                        msg.id === messageId
                          ? {
                              ...msg,
                              reactions: msg.reactions?.some(r => r.emoji === emoji)
                                ? msg.reactions?.map(r => 
                                    r.emoji === emoji 
                                      ? { ...r, count: r.count + 1, users: [...r.users, 'You'] }
                                      : r
                                  )
                                : [...(msg.reactions || []), { emoji, count: 1, users: ['You'] }]
                            }
                          : msg
                      ) || []
                    }
                  : subChat
              ) || []
            }
          : room
      )
    )
  }

  const handleReplyToMessage = (message: Message) => {
    setReplyingToMessage(message)
  }

  const handleReportMessage = (messageId: string) => {
    // Ici vous pouvez ajouter la logique de signalement
    console.log('Reporting message:', messageId)
    // Par exemple, ouvrir un modal de signalement ou envoyer une requête API
  }

  const handleInputEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    // Ne pas fermer le sélecteur automatiquement
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const isImageFile = (file: File) => {
    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    return imageTypes.includes(file.type)
  }

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😢', '😡', '🤯', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏']

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
      <div className="w-full h-full bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Barre de titre fixe */}
        <div className="chat-drag-handle flex items-center justify-between p-3 border-b border-border bg-muted rounded-t-lg cursor-move flex-shrink-0">
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
            {/* Menu déroulant avec clic et survol */}
            <div className="border-b border-border bg-background p-2 flex-shrink-0 relative">
              {/* Bouton principal - cliquable */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
                onClick={handleMainMenuToggle}
              >
                <div className="flex items-center gap-2">
                  {activeChat?.icon}
                  <span className="text-sm font-medium">{activeChat?.name || 'Loading...'}</span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-sm font-medium">{activeSubChat?.name || 'Loading...'}</span>
                  <Badge variant="secondary" className="text-xs">
                    {activeSubChat?.messages?.length || 0}
                  </Badge>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMainMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Menu déroulant principal - ouvert au clic */}
              {isMainMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
                  <div className="p-1">
                    {chatRooms.map((chat) => (
                      <div key={chat.id} className="relative">
                        {/* Chat principal avec survol pour les sous-menus */}
                        <div
                          onMouseEnter={() => handleChatHover(chat.id)}
                          onMouseLeave={handleChatLeave}
                          className="relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChatChange(chat.id)}
                            className="w-full justify-between text-sm font-semibold"
                          >
                            <div className="flex items-center gap-2">
                              {chat.icon}
                              <span>{chat.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {chat.subChats.reduce((total, subChat) => total + subChat.messages.length, 0)}
                            </Badge>
                          </Button>
                          
                          {/* Sous-menu au survol */}
                          {hoveredChatId === chat.id && (
                            <div 
                              data-submenu
                              className="absolute left-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[280px] max-w-[350px]"
                              onMouseEnter={handleSubMenuEnter}
                              onMouseLeave={handleSubMenuLeave}
                            >
                              <div className="p-2">
                                {chat.subChats.map((subChat) => (
                                  <Button
                                    key={subChat.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSubChatClick(chat.id, subChat.id)}
                                    className="w-full justify-between text-sm h-9 mb-1"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs">•</span>
                                      <span className="truncate">{subChat.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs h-4 px-1">
                                      {subChat.messages.length}
                                    </Badge>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informations du chat */}
            <div className="border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                {activeChat?.icon}
                <span>{activeChat?.name?.toLowerCase() || 'loading'}</span>
                <span>/</span>
                <span>{activeSubChat?.name?.toLowerCase() || 'loading'}</span>
                <Badge variant="outline" className="text-xs">{activeSubChat?.description || 'Loading...'}</Badge>
              </div>
            </div>

            {/* Zone des messages avec flex-grow */}
            <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  {activeSubChat?.messages?.map((message) => (
                    <div 
                      key={message.id} 
                      className="flex gap-2 group relative"
                      onMouseEnter={() => setHoveredMessageId(message.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.user === 'System' ? 'S' : message.user[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {/* Affichage du message original si c'est une réponse */}
                        {message.isReply && message.parentId && (
                          <div className="mb-2 p-2 bg-yellow-200/40 border-l-2 border-yellow-500 rounded-r-md">
                            <div className="flex items-center gap-1 mb-1">
                              <Reply className="h-3 w-3 text-yellow-700" />
                              <span className="text-xs font-medium text-yellow-900">
                                {activeSubChat?.messages?.find(m => m.id === message.parentId)?.user || 'Unknown'}
                              </span>
                            </div>
                            <p className="text-xs text-yellow-900 break-words">
                              {activeSubChat?.messages?.find(m => m.id === message.parentId)?.content || 'Message not found'}
                            </p>
                          </div>
                        )}
                        
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
                        
                        {/* Fichiers joints */}
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.files.map((file, index) => (
                              <div key={index}>
                                {isImageFile(file) ? (
                                  <div className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="max-w-[200px] max-h-[200px] rounded-md border border-border object-cover cursor-zoom-in"
                                      onClick={() => setPreviewImage({ url: URL.createObjectURL(file), name: file.name })}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-xs">
                                    <Paperclip className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <span className="text-muted-foreground">
                                      ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Réactions existantes */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {[...message.reactions]
                              .sort((a, b) => (b.count - a.count) || a.emoji.localeCompare(b.emoji))
                              .map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs hover:bg-muted/80 transition-colors"
                                  onClick={() => handleMessageReaction(message.id, reaction.emoji)}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </button>
                              ))}
                          </div>
                        )}
                        
                        {/* Barre d'actions au survol */}
                        {hoveredMessageId === message.id && message.type !== 'system' && (
                          <div className="absolute -top-8 left-0 bg-popover border border-border rounded-md shadow-lg p-1 flex items-center gap-1 z-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setShowEmojiPicker(message.id)}
                            >
                              <Smile className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReplyToMessage(message)}
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleReportMessage(message.id)}
                            >
                              <Flag className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Sélecteur d'emojis */}
                        {showEmojiPicker === message.id && (
                          <div 
                            data-emoji-picker
                            className="absolute -top-16 left-0 bg-popover border border-border rounded-md shadow-lg p-2 z-20"
                          >
                            <div className="grid grid-cols-4 gap-1">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded text-sm"
                                  onClick={() => {
                                    handleMessageReaction(message.id, emoji)
                                    setShowEmojiPicker(null)
                                  }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Sélecteur d'emojis dans la zone des messages */}
              {showInputEmojiPicker && (
                <div 
                  data-input-emoji-picker
                  className="absolute bottom-4 right-4 bg-popover border border-border rounded-md shadow-lg p-2 z-20"
                >
                  <div className="grid grid-cols-4 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded text-sm"
                        onClick={() => handleInputEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zone de saisie fixe */}
            <div className="border-t border-border p-3 flex-shrink-0">
              {/* Indicateur de réponse */}
              {replyingToMessage && (
                <div className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Replying to {replyingToMessage.user}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {replyingToMessage.content}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => setReplyingToMessage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index}>
                      {isImageFile(file) ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-16 h-16 rounded-md border border-border object-cover cursor-zoom-in"
                            onClick={() => setPreviewImage({ url: URL.createObjectURL(file), name: file.name })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={replyingToMessage ? `Reply to ${replyingToMessage.user}...` : "Type your message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-20"
                  />
                  
                  {/* Boutons dans l'input */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowInputEmojiPicker(!showInputEmojiPicker)}
                    >
                      <Smile className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

            </div>
          </>
        )}
      </div>
      {/* Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => {
          if (!open && previewImage) {
            URL.revokeObjectURL(previewImage.url)
            setPreviewImage(null)
            setPreviewScale(1)
          }
        }}
      >
        <DialogContent className="group max-w-[90vw] p-2 bg-transparent border-none shadow-none" overlayClassName="bg-black/60" showCloseButton={false}>
          {previewImage && (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative"
                onWheel={(e) => {
                  e.preventDefault()
                  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
                  const next = Math.min(5, Math.max(0.5, previewScale * zoomFactor))
                  setPreviewScale(next)
                }}
              >
                <div className="transition duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100 group-data-[state=closed]:scale-95 group-data-[state=closed]:opacity-0 will-change-transform drop-shadow-2xl">
                  <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="max-h-[85vh] max-w-full rounded-md object-contain block select-none"
                    style={{ transform: `scale(${previewScale})`, transformOrigin: 'center' }}
                    title="Scroll pour zoomer"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Rnd>
  )
}