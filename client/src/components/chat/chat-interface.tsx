import { useState, useEffect, useRef } from "react";
import { useChat } from "@/lib/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Send, Heart, Smile, Sun } from "lucide-react";
import MotionDot from "../ui/motion-dot";
import { motion, AnimatePresence } from "framer-motion";
import { type ChatMessage } from "@shared/schema";

// Conversation starters - these create a more natural flow
const initialConversationFlow = [
  "Hi there! I'm Cribbles, your friend for zenful joy. What's your name?",
  "It's wonderful to meet you! How are you feeling today?",
  "I'd love to get to know you better. What brings you joy in life?",
  "That's beautiful. What's something you're curious about or would like to explore in our conversations?",
];

// Personal questions that build friendship
const personalQuestions = [
  "What made you smile today?",
  "Is there something you're looking forward to this week?",
  "What's a small thing that brought you happiness recently?",
  "If you could be anywhere right now, where would you be?",
  "What's something you're proud of about yourself?",
  "What's a simple pleasure you enjoy?",
  "Is there something new you'd like to learn?",
  "What's a place that makes you feel peaceful?",
  "Who or what inspires you lately?",
  "What's a dream you have for your future?",
];

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const [companionName, setCompanionName] = useState("Cribbles");
  const [userName, setUserName] = useState("");
  const [conversationStage, setConversationStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isTyping, isLoading, isQuotaExceeded } = useChat();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Start the conversation flow if there are no messages
  useEffect(() => {
    if (messages.length === 0 && !isLoading && !isTyping) {
      // Simulate AI sending the first message with a slight delay
      setTimeout(() => {
        sendMessage(initialConversationFlow[0]);
      }, 1000);
    }
  }, [messages, isLoading, isTyping, sendMessage]);

  // Track conversation progress and detect user's name
  useEffect(() => {
    if (messages.length >= 3 && messages[messages.length - 1].role === "user") {
      const lastUserMessage = messages[messages.length - 1].content;
      const previousAiMessage = messages[messages.length - 2].content;
      
      // Check if we just asked for the user's name
      if (previousAiMessage.includes("What's your name?") && !userName) {
        // Extract potential name from user's message
        const words = lastUserMessage.split(/\s+/);
        if (words.length === 1) {
          setUserName(words[0]);
        } else if (lastUserMessage.toLowerCase().includes("my name is")) {
          const nameMatch = lastUserMessage.match(/my name is\s+(\w+)/i);
          if (nameMatch && nameMatch[1]) {
            setUserName(nameMatch[1]);
          } else {
            // Try to get the last word if it might be a name
            const lastWord = words[words.length - 1];
            if (lastWord && lastWord.length > 1 && !lastWord.includes(".")) {
              setUserName(lastWord);
            }
          }
        } else if (lastUserMessage.toLowerCase().includes("i'm ") || lastUserMessage.toLowerCase().includes("i am ")) {
          const nameMatch = lastUserMessage.match(/(i'm|i am)\s+(\w+)/i);
          if (nameMatch && nameMatch[2]) {
            setUserName(nameMatch[2]);
          }
        }
        
        // Advance the conversation
        setTimeout(() => {
          sendMessage(initialConversationFlow[1].replace("you", userName || "you"));
          setConversationStage(1);
        }, 1000);
      }
      
      // Continue the conversation flow based on stage
      else if (conversationStage > 0 && conversationStage < initialConversationFlow.length - 1) {
        setTimeout(() => {
          sendMessage(initialConversationFlow[conversationStage + 1]);
          setConversationStage(conversationStage + 1);
        }, 1500);
      }
      
      // After initial flow, ask occasional personal questions
      else if (conversationStage >= initialConversationFlow.length - 1 && messages.length % 4 === 0) {
        const randomQuestion = personalQuestions[Math.floor(Math.random() * personalQuestions.length)];
        setTimeout(() => {
          sendMessage(randomQuestion);
        }, 1500);
      }
    }
  }, [messages, userName, conversationStage, sendMessage]);
  
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-skyBlue to-blue-500 flex items-center justify-center text-white overflow-hidden shadow-md">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Heart className="h-5 w-5" />
            </motion.div>
          </div>
          <div className="ml-3">
            <CardTitle className="font-display font-semibold text-xl">{companionName}</CardTitle>
            <p className="text-xs text-gray-500">Your friend for zenful joy</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 flex-grow overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-center p-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-skyBlue to-blue-400 flex items-center justify-center mb-6 shadow-md">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <Smile className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">Starting a new conversation...</h3>
            <p className="text-gray-600 mb-4">
              I'm excited to get to know you! I'll ask about your life, listen to your thoughts, and we'll build a meaningful friendship.
            </p>
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
                  <div className="text-sm text-gray-500">{companionName} is thinking...</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gray-200/30 flex flex-col">
        {isQuotaExceeded && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <div className="flex items-start">
              <Sun className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">AI is taking a break</p>
                <p className="mt-1">I'm resting for a moment. Try our Visual Inspiration page for beautiful AI-generated imagery while I recharge.</p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center w-full">
          <Input
            type="text"
            placeholder={messages.length === 0 ? "Conversation starting soon..." : "Share your thoughts, feelings, or ask me anything..."}
            className="flex-1 py-2 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-skyBlue"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping || messages.length === 0 || isQuotaExceeded}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="ml-2 p-2 bg-skyBlue text-white rounded-full hover:bg-skyBlue/90"
            disabled={isTyping || !inputMessage.trim() || messages.length === 0 || isQuotaExceeded}
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
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
