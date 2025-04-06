import OpenAI from "openai";

// Initialize OpenAI client if API key exists
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false
}) : null;

// Log OpenAI configuration status
console.log(`OpenAI client initialized: ${!!openai}`);

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  let currentRetry = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      // Log detailed error information
      console.error("OpenAI API error details:", {
        error: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
        param: error.param,
        stack: error.stack
      });
      
      // If it's an insufficient quota error, no need to retry
      if (error.code === 'insufficient_quota' || 
          error.error?.code === 'insufficient_quota' ||
          error.message?.includes("exceeded your current quota")) {
        console.error("OpenAI API quota exceeded. Please check your billing details.");
        throw new Error("API quota exceeded. The application has limited functionality until the quota is renewed.");
      }
      
      // If we've used all our retries, or it's not a rate limit error, rethrow
      if (
        currentRetry >= retries || 
        (error.status !== 429 && !error.message?.includes("rate limit"))
      ) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, currentRetry);
      console.log(`Rate limited, retrying in ${delay}ms. Retry ${currentRetry + 1}/${retries}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increment retry counter
      currentRetry++;
    }
  }
}

// Generate daily boost
export async function generateDailyBoost(userInfo: { 
  name: string;
  recentMoods?: Array<{ score: number; date: Date; notes?: string }>;
  preferences?: {
    wellnessGoals?: string[];
    topicPreferences?: string[];
  };
}): Promise<{ content: string; tags: string[] }> {
  try {
    const prompt = `
      Create a personalized wellness boost for ${userInfo.name}.
      
      ${userInfo.recentMoods && userInfo.recentMoods.length > 0 
        ? `Recent mood data: ${JSON.stringify(userInfo.recentMoods)}` 
        : 'No recent mood data available.'}
      
      ${userInfo.preferences?.wellnessGoals?.length 
        ? `Wellness goals: ${userInfo.preferences.wellnessGoals.join(', ')}` 
        : 'No specific wellness goals set.'}
        
      ${userInfo.preferences?.topicPreferences?.length 
        ? `Topic preferences: ${userInfo.preferences.topicPreferences.join(', ')}` 
        : 'No topic preferences set.'}
      
      Create an uplifting, scientifically-backed daily boost that is personalized to the user's situation.
      Keep it concise (under 150 words), positive, and actionable.
      
      Return the response in JSON format with the following structure:
      {
        "content": "The daily boost text",
        "tags": ["tag1", "tag2", "tag3"]
      }
      
      Tags should be relevant wellness categories like Mindfulness, Productivity, Joy, etc.
    `;

    const response = await retryWithBackoff(() => 
      openai.chat.completions.create({
        model: "gpt-4o",  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    );

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      content: result.content || "Start your day with a positive mindset. Research shows that just 2 minutes of mindfulness practice in the morning can set a peaceful tone for your entire day.",
      tags: result.tags || ["Mindfulness", "Morning Routine", "Positivity"]
    };
  } catch (error: any) {
    console.error("Error generating daily boost:", error);
    if (error?.status === 429) {
      console.log("Rate limit hit for daily boost generation. Using fallback message.");
    }
    return {
      content: "Today, try to take a few mindful minutes for yourself. Small pauses throughout your day can significantly improve your mental clarity and emotional wellbeing.",
      tags: ["Mindfulness", "Self-care", "Balance"]
    };
  }
}

// Generate image for inspiration
export async function generateInspirationImage(prompt: string): Promise<string> {
  try {
    const enhancedPrompt = `Create a calming, inspirational image that evokes mindfulness and wellbeing: ${prompt}. Use soft colors, gentle natural imagery, and create a serene atmosphere.`;
    
    const response = await retryWithBackoff(() => 
      openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      })
    );

    return response.data[0].url || "";
  } catch (error: any) {
    console.error("Error generating inspiration image:", error);
    throw new Error("Could not generate inspiration image");
  }
}

// Chat with the AI wellness coach
export async function chatWithCoach(
  userId: number,
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const systemPrompt = {
      role: "system",
      content: `You are a supportive, empathetic AI wellness coach named Cribbles. 
      Your purpose is to be a friend who helps users improve their mental wellbeing through science-backed techniques.
      Be warm, encouraging, and provide actionable guidance.
      Focus on joy, mindfulness, personal growth, and emotional resilience.
      Ask users about their life and their thoughts to build a relationship with them.
      Keep responses concise and personalized. Never diagnose medical conditions.
      When providing recommendations, briefly reference the scientific backing.`
    };
    
    const messages = [
      systemPrompt,
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await retryWithBackoff(() => 
      openai.chat.completions.create({
        model: "gpt-4o",  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500
      })
    );

    return response.choices[0].message?.content || "I'm here as your friend on this wellness journey. How can I help today?";
  } catch (error: any) {
    console.error("Error in chat with coach:", error);
    if (error?.status === 429) {
      return "I'm a bit tired right now and need a moment to rest. Let's continue our conversation in a little while.";
    }
    return "I'm having trouble processing that right now. Let's try a different approach to support your wellness today.";
  }
}

// Analyze journal entry for insights
export async function analyzeJournalEntry(
  journalContent: string
): Promise<{ insights: string; emotionalTone: string; recommendations: string[] }> {
  try {
    const prompt = `
      Analyze the following journal entry for wellness insights:
      
      "${journalContent}"
      
      Provide a thoughtful, empathetic analysis that includes emotional patterns, potential stressors, and positive elements.
      Do not diagnose any conditions but offer gentle observations.
      
      Return the analysis in JSON format with the following structure:
      {
        "insights": "Brief, empathetic insights about emotional patterns or themes",
        "emotionalTone": "Overall emotional tone (positive, negative, mixed, neutral)",
        "recommendations": ["1-3 specific, actionable recommendations for wellbeing"]
      }
    `;

    const response = await retryWithBackoff(() => 
      openai.chat.completions.create({
        model: "gpt-4o",  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    );

    return JSON.parse(response.choices[0].message?.content || '{}');
  } catch (error: any) {
    console.error("Error analyzing journal entry:", error);
    return {
      insights: "Your journal shows your thoughtful reflection process.",
      emotionalTone: "balanced",
      recommendations: ["Consider a brief mindfulness practice", "Reflect on what brought you joy today", "Connect with nature for a few minutes"]
    };
  }
}

// Generate profile picture based on description
export async function generateProfilePicture(description: string): Promise<string> {
  if (!openai) throw new Error("OpenAI API key not configured");
  
  const enhancedPrompt = `A profile picture avatar based on this description: ${description}. 
Style: Friendly, approachable, stylized portrait in a simple, minimal design.
Clean background, soft colors, warm and inviting. Suitable for a wellness app profile.
The avatar should be a creative interpretation, not photorealistic.`;

  try {
    const response = await retryWithBackoff(() => 
      openai.images.generate({
        model: "dall-e-3", // Using DALL-E 3 for higher quality
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      })
    );
    
    if (!response.data[0].url) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    return response.data[0].url;
  } catch (error: any) {
    console.error("Failed to generate profile picture:", error);
    throw error;
  }
}