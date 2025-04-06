import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";

export function useChat() {
  const [isTyping, setIsTyping] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch
  } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        return await apiRequest("POST", "/api/chat", { content });
      } catch (error: any) {
        // Check if the error is related to API quota
        if (error?.message?.includes("quota") || 
            error?.message?.includes("exceeded") ||
            error?.status === 429) {
          setIsQuotaExceeded(true);
          throw new Error("API quota exceeded");
        }
        throw error;
      }
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      // Add a slight delay to make the typing indicator feel more natural
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    },
    onError: (error: any) => {
      setIsTyping(false);
      
      if (error?.message?.includes("quota") || isQuotaExceeded) {
        toast({
          title: "AI Service Unavailable",
          description: "Our AI is taking a little break. Try our other features while we restore service.",
          variant: "default",
        });
        
        // Automatically create a simulated response
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
      console.error("Chat error:", error);
    },
  });
  
  const sendMessage = (content: string) => {
    if (content.trim() === "") return;
    
    sendMessageMutation.mutate(content);
  };
  
  useEffect(() => {
    // On first load, if there are no messages, we'll display a welcome message
    if (!isLoading && !isError && messages.length === 0) {
      // This is handled by the component with a placeholder welcome message
    }
  }, [isLoading, isError, messages]);
  
  return {
    messages,
    sendMessage,
    isTyping,
    isLoading,
    isError,
    refetch,
  };
}
