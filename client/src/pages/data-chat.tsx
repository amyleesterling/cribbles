import ChatInterface from "@/components/chat/chat-interface";
import { motion } from "framer-motion";

export default function DataChat() {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] lg:h-screen flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Chat</h1>
          <p className="text-gray-500">Talk with your AI companion about your life, thoughts, and dreams</p>
        </motion.div>
        
        <div className="flex-grow">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
