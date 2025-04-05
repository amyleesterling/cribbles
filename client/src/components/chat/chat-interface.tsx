import { useState, useEffect, useRef } from "react";
import { useChat } from "@/lib/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Send } from "lucide-react";
import MotionDot from "../ui/motion-dot";
import { motion, AnimatePresence } from "framer-motion";
import { type ChatMessage } from "@shared/schema";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isTyping, isLoading } = useChat();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };
  
  if (isLoading) {
    return <ChatInterfaceSkeleton />;
  }
  
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200/30">
        <div className="flex items-center">
          <MotionDot />
          <CardTitle className="font-display font-semibold text-xl ml-2">Chat with Your AI Coach</CardTitle>
        </div>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 flex-grow overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-center p-6">
            <div className="h-12 w-12 rounded-full bg-skyBlue/10 flex items-center justify-center mb-4">
              <MotionDot />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Welcome to InsightFlow</h3>
            <p className="text-gray-600 mb-4">
              I'm your AI wellness coach. How can I help your creative journey today?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
              <Button variant="outline" onClick={() => sendMessage("Tell me a mindfulness technique for creative focus")}>
                Mindfulness techniques
              </Button>
              <Button variant="outline" onClick={() => sendMessage("How can I improve my creative energy?")}>
                Improve creative energy
              </Button>
              <Button variant="outline" onClick={() => sendMessage("Give me a quick stress relief exercise")}>
                Quick stress relief
              </Button>
              <Button variant="outline" onClick={() => sendMessage("How does sleep affect creativity?")}>
                Sleep and creativity
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center mt-4"
                >
                  <div className="w-8 h-8 rounded-full bg-skyBlue flex items-center justify-center mr-2">
                    <TypingIndicator />
                  </div>
                  <div className="text-sm text-gray-500">InsightFlow is thinking...</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gray-200/30">
        <form onSubmit={handleSubmit} className="flex items-center w-full">
          <Input
            type="text"
            placeholder="Ask something about wellness or creativity..."
            className="flex-1 py-2 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-skyBlue"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="ml-2 p-2 bg-skyBlue text-white rounded-full hover:bg-skyBlue/90"
            disabled={isTyping || !inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

interface ChatMessageProps {
  message: ChatMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gray-200 text-gray-800 rounded-tr-none' 
            : 'bg-skyBlue text-white rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">
          {message.content}
        </p>
        <div className="text-xs mt-1 opacity-70 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <motion.div
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
        className="h-1.5 w-1.5 rounded-full bg-white"
      />
      <motion.div
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        className="h-1.5 w-1.5 rounded-full bg-white"
      />
      <motion.div
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
        className="h-1.5 w-1.5 rounded-full bg-white"
      />
    </div>
  );
}

function ChatInterfaceSkeleton() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200/30">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <Skeleton className="h-6 w-40 ml-2" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </CardHeader>
      
      <CardContent className="p-6 flex-grow">
        <div className="space-y-4">
          <Skeleton className="h-20 w-3/4 rounded-2xl rounded-tl-none" />
          <div className="flex justify-end">
            <Skeleton className="h-12 w-1/2 rounded-2xl rounded-tr-none" />
          </div>
          <Skeleton className="h-24 w-4/5 rounded-2xl rounded-tl-none" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gray-200/30">
        <div className="flex items-center w-full">
          <Skeleton className="flex-1 h-10 rounded-full" />
          <Skeleton className="ml-2 h-10 w-10 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
