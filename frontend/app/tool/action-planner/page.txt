'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Upload, Send, PlusCircle, Menu, MessageSquare } from 'lucide-react'
import { RoadmapGuide } from './roadmap-guide'
import { ExpandableSidebar } from '@/components/tool-comp/common-comp/expandable-sidebar'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hi there! I'd like to learn about building a chatbot from scratch.", sender: "user" },
    { id: 2, content: "Great! I'd be happy to help you with that. I've prepared a roadmap guide for building a chatbot from scratch. You can find it on the right side of the screen. Each step includes resource cards with valuable information. Would you like me to walk you through it?", sender: "ai" },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, content: inputMessage, sender: "user" }])
      setInputMessage("")
    }
  }

  return (
    <>
        <ExpandableSidebar />
        <div className="flex h-screen overflow-hidden bg-gray-400 text-white pl-20">
        {/* Left Sidebar */}
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
                <Menu className="h-4 w-4" />
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="h-full py-6 pl-6 pr-0">
                <LeftSidebar />
            </div>
            </SheetContent>
        </Sheet>
        <aside className="w-64 bg-gray-400 text-black hidden md:block overflow-y-auto">
            <div className="h-full p-4">
            <LeftSidebar />
            </div>
        </aside>

        {/* Chat Playground */}
        <main className="flex-1 flex flex-col md:w-1/4">
            <header className="bg-gray-300 text-gray-800 p-4 text-center">
            <h1 className="text-2xl font-bold">Thesius.ai Cross domain research</h1>
            </header>
            <ScrollArea className="flex-1 p-4 bg-gray-100">
            {messages.map((message) => (
                <Card key={message.id} className={`mb-4 ${message.sender === 'user' ? 'ml-auto bg-gray-400' : 'mr-auto bg-green-400'} max-w-[70%] text-white border-none`}>
                <CardContent className="p-3 flex items-start gap-3">
                    <Avatar>
                    <AvatarFallback className='text-black font-bold'>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    <AvatarImage src={message.sender === 'user' ? '/placeholder.svg?height=40&width=40' : '/placeholder.svg?height=40&width=40'} />
                    </Avatar>
                    <p>{message.content}</p>
                </CardContent>
                </Card>
            ))}
            </ScrollArea>
            <div className="p-4 text-black bg-green-500/50">
            <div className="flex gap-2">
                <Input
                value={inputMessage}
                className='text-lg'
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button className='' onClick={handleSendMessage}>
                    <Send className="w-6 h-6" />
                </Button>
            </div>
            </div>
        </main>

        {/* Right Sidebar - GenUI Section */}
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50 md:hidden">
                <MessageSquare className="h-4 w-4" />
            </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="h-full py-6 pl-6 pr-0">
                <ScrollArea className="h-full">
                <RoadmapGuide />
                </ScrollArea>
            </div>
            </SheetContent>
        </Sheet>
        <aside className="hidden md:block md:w-[30%] bg-gray-400 overflow-y-auto">
            <ScrollArea className="h-full p-4">
            <RoadmapGuide />
            </ScrollArea>
        </aside>
        </div>
    </>
  )
}

function LeftSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold mb-4">Options</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Upload File</h3>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-600" />
                <span className="mt-2 block text-sm text-gray-600">Click to upload</span>
              </div>
              <input id="file-upload" type="file" className="hidden" />
            </label>
          </div>
          <div>
            <h3 className="text-sm mb-2 font-bold">Context</h3>
            <Textarea className='bg-gray-200' placeholder="Add context for the conversation..." rows={4} />
          </div>
          <Button className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>
    </div>
  )
}