import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDailyBoost, chatWithCoach, generateInspirationImage, analyzeJournalEntry, generateProfilePicture } from "./openai";
import { sendDailyCheckinEmail } from "./email";
import {
  insertUserSchema,
  insertMoodSchema,
  insertJournalSchema,
  insertChatMessageSchema,
  insertUserPreferencesSchema,
  insertInspirationImageSchema
} from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<void> {
  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working!" });
  });

  // User APIs
  app.get("/api/users/me", async (req, res) => {
    // For demo purposes, always return the demo user
    const user = await storage.getUserByUsername('sophia');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.patch("/api/users/me", async (req, res) => {
    try {
      // For demo purposes, use the demo user
      const user = await storage.getUserByUsername('sophia');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Define allowed fields to update
      const schema = z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        phone: z.string().optional(),
        profilePicture: z.string().optional(),
        role: z.string().optional()
      });
      
      const updateData = schema.parse(req.body);
      const updatedUser = await storage.updateUser(user.id, updateData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const schema = z.object({
      username: z.string(),
      password: z.string()
    });
    
    try {
      const { username, password } = schema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Moods APIs
  app.get("/api/moods", async (req, res) => {
    const userId = 1; // Using demo user for now
    const moods = await storage.getMoodsByUserId(userId);
    res.json(moods);
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const moodData = insertMoodSchema.parse(req.body);
      const newMood = await storage.createMood(moodData);
      res.status(201).json(newMood);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood data" });
    }
  });
  
  // Journal APIs
  app.get("/api/journals", async (req, res) => {
    const userId = 1; // Using demo user for now
    const journals = await storage.getJournalsByUserId(userId);
    res.json(journals);
  });
  
  app.get("/api/journals/:id", async (req, res) => {
    const journalId = parseInt(req.params.id);
    if (isNaN(journalId)) {
      return res.status(400).json({ message: "Invalid journal ID" });
    }
    
    const journal = await storage.getJournalById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    
    res.json(journal);
  });
  
  app.post("/api/journals", async (req, res) => {
    try {
      const journalData = insertJournalSchema.parse(req.body);
      const newJournal = await storage.createJournal(journalData);
      res.status(201).json(newJournal);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal data" });
    }
  });
  
  app.post("/api/journals/analyze", async (req, res) => {
    const schema = z.object({
      content: z.string().min(1)
    });
    
    try {
      const { content } = schema.parse(req.body);
      const analysis = await analyzeJournalEntry(content);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Chat APIs
  app.get("/api/chat", async (req, res) => {
    const userId = 1; // Using demo user for now
    const messages = await storage.getChatMessagesByUserId(userId);
    res.json(messages);
  });
  
  app.post("/api/chat", async (req, res) => {
    const schema = z.object({
      content: z.string().min(1)
    });
    
    try {
      const { content } = schema.parse(req.body);
      const userId = 1; // Using demo user for now
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        role: "user",
        content
      });
      
      // Get conversation history
      const messages = await storage.getChatMessagesByUserId(userId);
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      
      try {
        // Generate response
        const assistantResponse = await chatWithCoach(userId, content, conversationHistory);
        
        // Save assistant response
        const assistantMessage = await storage.createChatMessage({
          userId,
          role: "assistant",
          content: assistantResponse
        });
        
        res.json(assistantMessage);
      } catch (error: any) {
        console.error("AI response error:", error);
        
        // If it's a quota error, provide a friendly fallback message
        let fallbackMessage = "I'm having a moment of reflection and need to pause. Let's continue our conversation shortly.";
        
        if (error?.code === 'insufficient_quota' || 
            error?.message?.includes("quota") || 
            error?.message?.includes("exceeded") ||
            error?.message?.includes("rate limit")) {
          fallbackMessage = "I need to recharge for a bit. In the meantime, have you explored the Visual Inspiration page? You might find some beautiful imagery there that resonates with you.";
        }
        
        // Save the fallback AI response
        const assistantMessage = await storage.createChatMessage({
          userId,
          role: "assistant",
          content: fallbackMessage
        });
        
        // Return the fallback message
        res.json(assistantMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Daily Boost APIs
  app.get("/api/daily-boost", async (req, res) => {
    const userId = 1; // Using demo user for now
    let boost = await storage.getLatestDailyBoost(userId);
    
    // Generate a new boost if none exists for today or the latest is too old
    if (!boost || isBoostOld(boost.createdAt)) {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const moods = await storage.getMoodsByUserId(userId);
      const preferences = await storage.getUserPreferences(userId);
      
      const { content, tags } = await generateDailyBoost({
        name: user.name,
        recentMoods: moods.slice(0, 5).map(m => ({ 
          score: m.score,
          date: m.date,
          notes: m.notes
        })),
        preferences: preferences?.preferences
      });
      
      boost = await storage.createDailyBoost({
        userId,
        content,
        tags
      });
    }
    
    res.json(boost);
  });
  
  app.post("/api/daily-boost/:id/seen", async (req, res) => {
    const boostId = parseInt(req.params.id);
    if (isNaN(boostId)) {
      return res.status(400).json({ message: "Invalid boost ID" });
    }
    
    await storage.markDailyBoostAsSeen(boostId);
    res.json({ success: true });
  });
  
  // User Preferences APIs
  app.get("/api/preferences", async (req, res) => {
    const userId = 1; // Using demo user for now
    const preferences = await storage.getUserPreferences(userId);
    res.json(preferences || { userId, preferences: {} });
  });
  
  app.post("/api/preferences", async (req, res) => {
    try {
      const preferencesData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.setUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });
  
  app.patch("/api/preferences", async (req, res) => {
    const userId = 1; // Using demo user for now
    
    try {
      // Get existing preferences
      let preferences = await storage.getUserPreferences(userId);
      
      // If preferences don't exist, create them first
      if (!preferences) {
        preferences = await storage.setUserPreferences({
          userId,
          preferences: {}
        });
      }
      
      // Now update the preferences
      const updatedPreferences = await storage.updateUserPreferences(userId, req.body.preferences);
      if (!updatedPreferences) {
        return res.status(500).json({ message: "Failed to update preferences" });
      }
      
      res.json(updatedPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Visual Inspiration API
  // Generate a new inspiration image
  app.post("/api/inspiration", async (req, res) => {
    const schema = z.object({
      prompt: z.string().min(1),
      vibe: z.string().optional(),
      isDaily: z.boolean().optional()
    });
    
    try {
      const { prompt, vibe, isDaily } = schema.parse(req.body);
      const userId = 1; // Using demo user for now
      
      try {
        // Generate the image
        const imageUrl = await generateInspirationImage(prompt);
        
        // Save to database
        const savedImage = await storage.saveInspirationImage({
          userId,
          prompt,
          imageUrl,
          vibe: vibe || "calm",
          isDaily: isDaily || false
        });
        
        res.json(savedImage);
      } catch (error: any) {
        console.error("OpenAI image generation error:", error);
        
        // Check if it's a quota error
        if (error?.code === 'insufficient_quota' || 
            error?.message?.includes("quota") || 
            error?.message?.includes("exceeded") ||
            error?.message?.includes("rate limit")) {
          
          // Return a more specific error for quota issues
          return res.status(429).json({ 
            message: "AI image service is currently unavailable. Please try again later.",
            errorType: "quota_exceeded"
          });
        }
        
        // For other errors
        res.status(500).json({ message: "Could not generate inspiration image" });
      }
    } catch (error) {
      console.error("Inspiration image validation error:", error);
      res.status(400).json({ message: "Invalid input for image generation" });
    }
  });
  
  // Get daily inspiration image
  app.get("/api/inspiration/daily", async (req, res) => {
    const userId = 1; // Using demo user for now
    let dailyImage = await storage.getDailyInspirationImage(userId);
    
    // If no daily image exists for today, generate one
    if (!dailyImage) {
      try {
        // Get a random calming prompt
        const prompts = [
          "A serene mountain lake at sunrise with gentle fog",
          "Cherry blossoms falling gently in a peaceful Japanese garden",
          "A cozy cabin in the woods with warm light glowing from within",
          "Sunlight filtering through tall trees in a misty forest",
          "A peaceful meadow of wildflowers at golden hour"
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        try {
          // Generate the image
          const imageUrl = await generateInspirationImage(randomPrompt);
          
          // Save to database
          dailyImage = await storage.saveInspirationImage({
            userId,
            prompt: randomPrompt,
            imageUrl,
            vibe: "calm",
            isDaily: true
          });
        } catch (error: any) {
          console.error("Daily OpenAI image generation error:", error);
          
          // If it's a quota error
          if (error?.code === 'insufficient_quota' || 
              error?.message?.includes("quota") || 
              error?.message?.includes("exceeded") ||
              error?.message?.includes("rate limit")) {
            
            // For daily images, try to use a previous one as a fallback
            const previousImages = await storage.getInspirationImagesByUserId(userId);
            if (previousImages.length > 0) {
              // Return the most recent image that exists
              dailyImage = previousImages[0];
            } else {
              // If there's no previous image either, return an error
              return res.status(429).json({ 
                message: "AI image service is currently unavailable. Please try again later.",
                errorType: "quota_exceeded"
              });
            }
          } else {
            // For non-quota errors
            return res.status(500).json({ message: "Could not generate daily inspiration image" });
          }
        }
      } catch (error) {
        console.error("Daily inspiration image error:", error);
        return res.status(500).json({ message: "Could not retrieve daily inspiration image" });
      }
    }
    
    res.json(dailyImage);
  });
  
  // Get user's gallery of saved inspiration images
  app.get("/api/inspiration/gallery", async (req, res) => {
    const userId = 1; // Using demo user for now
    const images = await storage.getInspirationImagesByUserId(userId);
    res.json(images);
  });
  
  // Generate profile picture based on description
  app.post("/api/profile/generate-picture", async (req, res) => {
    const schema = z.object({
      description: z.string().min(1)
    });
    
    try {
      const { description } = schema.parse(req.body);
      
      try {
        // Generate the profile picture
        const imageUrl = await generateProfilePicture(description);
        res.json({ imageUrl });
      } catch (error: any) {
        console.error("OpenAI profile picture generation error:", error);
        
        // Check if it's a quota error
        if (error?.code === 'insufficient_quota' || 
            error?.message?.includes("quota") || 
            error?.message?.includes("exceeded") ||
            error?.message?.includes("rate limit")) {
          
          // Return a more specific error for quota issues
          return res.status(429).json({ 
            message: "AI image service is currently unavailable. Please try again later.",
            errorType: "quota_exceeded"
          });
        }
        
        // For other errors
        res.status(500).json({ message: "Could not generate profile picture" });
      }
    } catch (error) {
      console.error("Profile picture validation error:", error);
      res.status(400).json({ message: "Invalid input for profile picture generation" });
    }
  });

  // Subscription APIs
  app.get("/api/subscriptions/me", async (req, res) => {
    const userId = 1;
    const sub = await storage.getSubscriptionByUserId(userId);
    res.json(sub || null);
  });

  app.post("/api/subscriptions", async (req, res) => {
    const schema = z.object({
      channel: z.enum(["email", "sms", "push"]),
      contact: z.string().min(1),
      time: z.string().min(1),
    });
    try {
      const data = schema.parse(req.body);
      const userId = 1;
      const sub = await storage.createSubscription({ userId, ...data });
      res.status(201).json(sub);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  app.delete("/api/subscriptions/me", async (req, res) => {
    const userId = 1;
    await storage.deleteSubscriptionByUserId(userId);
    res.json({ success: true });
  });

  // Send a test email immediately (useful for verifying Resend setup)
  app.post("/api/subscriptions/test-send", async (req, res) => {
    const userId = 1;
    const sub = await storage.getSubscriptionByUserId(userId);
    if (!sub || sub.channel !== "email") {
      return res.status(400).json({ message: "No email subscription found. Subscribe with email first." });
    }
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    try {
      await sendDailyCheckinEmail({ to: sub.contact, name: user.name });
      res.json({ success: true, sentTo: sub.contact });
    } catch (err: any) {
      console.error("Test send error:", err);
      res.status(500).json({ message: err?.message || "Failed to send email" });
    }
  });

  // Inspiration Image APIs
  app.post("/api/inspiration/generate", async (req, res) => {
    const schema = z.object({
      prompt: z.string().min(1)
    });
    
    try {
      const { prompt } = schema.parse(req.body);
      const userId = 1; // Using demo user for now
      
      const imageUrl = await generateInspirationImage(prompt);
      
      // Save the generated image
      const savedImage = await storage.saveInspirationImage({
        userId,
        prompt,
        imageUrl,
        vibe: "calm",
        isDaily: false
      });
      
      res.json(savedImage);
    } catch (error) {
      console.error("Error generating inspiration image:", error);
      res.status(400).json({ message: "Could not generate inspiration image" });
    }
  });
  
  app.get("/api/inspiration", async (req, res) => {
    const userId = 1; // Using demo user for now
    const images = await storage.getInspirationImagesByUserId(userId);
    res.json(images);
  });

  const httpServer = createServer(app);
  return httpServer;
}

function isBoostOld(date: Date): boolean {
  const now = new Date();
  const boostDate = new Date(date);
  
  // Check if the boost is from an earlier day
  return now.getDate() !== boostDate.getDate() || 
         now.getMonth() !== boostDate.getMonth() || 
         now.getFullYear() !== boostDate.getFullYear();
}
