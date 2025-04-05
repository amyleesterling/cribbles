import { apiRequest } from "./queryClient";

// Chat with the AI assistant
export async function sendChatMessage(message: string, userId: number) {
  const response = await apiRequest('POST', '/api/chat', { message, userId });
  return response.json();
}

// Generate an inspirational image based on a prompt
export async function generateImage(prompt: string) {
  const response = await apiRequest('POST', '/api/generate-image', { prompt });
  return response.json();
}
