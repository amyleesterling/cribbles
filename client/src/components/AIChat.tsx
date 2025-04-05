import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendChatMessage } from "@/lib/openai";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSend, MdSmartToy, MdOutlineAutoAwesome } from "react-icons/md";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  userId: number;
}

export function AIChat({ userId }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI wellness coach. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessage, userId);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Could you try again in a moment?",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <motion.div
        className="shadow-lg rounded-full bg-sky-400 text-white w-14 h-14 flex items-center justify-center cursor-pointer hover:bg-sky-500 transition duration-300"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MdSmartToy size={24} />
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 bg-sky-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                </div>
                <h3 className="ml-2 font-medium text-gray-900">ZenJoy Coach</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                <MdClose size={20} />
              </Button>
            </div>
            
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end ${message.isUser ? "justify-end" : ""}`}
                  >
                    {!message.isUser && (
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                          <MdSmartToy className="text-sky-500" size={16} />
                        </div>
                      </div>
                    )}
                    <div 
                      className={`
                        p-3 rounded-lg max-w-xs shadow-sm
                        ${message.isUser 
                          ? "bg-sky-400 text-white rounded-br-none" 
                          : "bg-white text-gray-800 rounded-bl-none"
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.isUser && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {/* Placeholder for user avatar */}
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-500">
                            <path
                              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="7"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                        <MdSmartToy className="text-sky-500" size={16} />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-sky-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-sky-300 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-sky-300 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <Textarea
                  placeholder="How can I help you today?"
                  className="flex-1 resize-none p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 focus:outline-none text-sm min-h-0"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <Button
                  className="ml-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition duration-300"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                >
                  <MdSend size={18} />
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>Your personal wellness guide</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sky-400 hover:text-sky-500 p-0 h-auto flex items-center"
                >
                  <MdOutlineAutoAwesome size={14} className="mr-1" />
                  <span>Get a boost</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
