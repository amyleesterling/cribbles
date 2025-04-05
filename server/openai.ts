import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-key" });

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      content: result.content || "Start your day with a positive mindset. Research shows that just 2 minutes of mindfulness practice in the morning can set a peaceful tone for your entire day.",
      tags: result.tags || ["Mindfulness", "Morning Routine", "Positivity"]
    };
  } catch (error) {
    console.error("Error generating daily boost:", error);
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
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error) {
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
      content: `You are a supportive, empathetic AI wellness coach named InsightFlow. 
      Your purpose is to help users improve their mental wellbeing through science-backed techniques.
      Be warm, encouraging, and provide actionable guidance.
      Focus on positive psychology, mindfulness, stress reduction, and emotional resilience.
      Keep responses concise and personalized. Never diagnose medical conditions.
      When providing recommendations, briefly reference the scientific backing.`
    };
    
    const messages = [
      systemPrompt,
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message?.content || "I'm here to support your wellness journey. How can I help today?";
  } catch (error) {
    console.error("Error in chat with coach:", error);
    return "I'm having trouble processing that request. Let's try a different approach to support your wellness today.";
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message?.content || '{}');
  } catch (error) {
    console.error("Error analyzing journal entry:", error);
    return {
      insights: "Your journal shows your thoughtful reflection process.",
      emotionalTone: "balanced",
      recommendations: ["Consider a brief mindfulness practice", "Reflect on what brought you joy today", "Connect with nature for a few minutes"]
    };
  }
}
