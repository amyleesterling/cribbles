import ChatInterface from "@/components/chat/chat-interface";

export default function DataChat() {
  return (
    <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] lg:h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Data Chat</h1>
        <p className="text-gray-500">Talk with your AI wellness coach about your journey</p>
      </div>
      
      <div className="flex-grow">
        <ChatInterface />
      </div>
    </div>
  );
}
