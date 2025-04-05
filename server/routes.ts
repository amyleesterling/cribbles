import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertMoodEntrySchema, 
  insertJournalEntrySchema,
  insertReflectionSchema,
  insertUserPreferencesSchema
} from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedUser = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedUser);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Mood entry routes
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedMoodEntry = insertMoodEntrySchema.parse(req.body);
      const moodEntry = await storage.createMoodEntry(validatedMoodEntry);
      res.status(201).json(moodEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/mood-entries", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const moodEntries = await storage.getMoodEntries(userId);
    res.json(moodEntries);
  });

  app.get("/api/users/:userId/mood-entries/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }
    
    const moodEntries = await storage.getMoodEntriesByDateRange(
      userId, 
      new Date(startDate as string), 
      new Date(endDate as string)
    );
    res.json(moodEntries);
  });

  // Journal entry routes
  app.post("/api/journal-entries", async (req, res) => {
    try {
      const validatedJournalEntry = insertJournalEntrySchema.parse(req.body);
      const journalEntry = await storage.createJournalEntry(validatedJournalEntry);
      res.status(201).json(journalEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/journal-entries", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const journalEntries = await storage.getJournalEntries(userId);
    res.json(journalEntries);
  });

  app.get("/api/journal-entries/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const journalEntry = await storage.getJournalEntry(id);
    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    res.json(journalEntry);
  });

  // Reflection routes
  app.post("/api/reflections", async (req, res) => {
    try {
      const validatedReflection = insertReflectionSchema.parse(req.body);
      const reflection = await storage.createReflection(validatedReflection);
      res.status(201).json(reflection);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/reflections", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const reflections = await storage.getReflections(userId);
    res.json(reflections);
  });

  // Reflection prompt routes
  app.get("/api/reflection-prompts", async (req, res) => {
    const reflectionPrompts = await storage.getReflectionPrompts();
    res.json(reflectionPrompts);
  });

  app.get("/api/reflection-prompts/random", async (req, res) => {
    const reflectionPrompt = await storage.getRandomReflectionPrompt();
    if (!reflectionPrompt) {
      return res.status(404).json({ message: "No reflection prompts found" });
    }
    res.json(reflectionPrompt);
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.get("/api/resources/category/:category", async (req, res) => {
    const category = req.params.category;
    const resources = await storage.getResourcesByCategory(category);
    res.json(resources);
  });

  app.get("/api/resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const resource = await storage.getResource(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  });

  // User preferences routes
  app.post("/api/user-preferences", async (req, res) => {
    try {
      const validatedUserPreferences = insertUserPreferencesSchema.parse(req.body);
      const userPreferences = await storage.createUserPreferences(validatedUserPreferences);
      res.status(201).json(userPreferences);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/preferences", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const userPreferences = await storage.getUserPreferences(userId);
    if (!userPreferences) {
      return res.status(404).json({ message: "User preferences not found" });
    }
    res.json(userPreferences);
  });

  app.put("/api/users/:userId/preferences", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const preferences = req.body.preferences;
    
    if (!preferences) {
      return res.status(400).json({ message: "Preferences are required" });
    }
    
    const updatedPreferences = await storage.updateUserPreferences(userId, preferences);
    if (!updatedPreferences) {
      return res.status(404).json({ message: "User preferences not found" });
    }
    res.json(updatedPreferences);
  });

  // Daily boost routes
  app.get("/api/users/:userId/daily-boost", async (req, res) => {
    const userId = parseInt(req.params.userId);
    let dailyBoost = await storage.getDailyBoost(userId);
    
    // If there's no daily boost yet for today, generate one
    if (!dailyBoost) {
      // Get recent mood entries to personalize the boost
      const recentMoods = await storage.getMoodEntries(userId);
      const userPreferences = await storage.getUserPreferences(userId);
      
      try {
        // Generate personalized boost with OpenAI
        const prompt = `
          Generate a personalized affirmation and wellness tip for a user.
          
          ${recentMoods.length > 0 ? `Recent moods: ${recentMoods.slice(0, 5).map(m => m.mood).join(', ')}` : ''}
          ${userPreferences ? `User preferences: ${JSON.stringify(userPreferences.preferences)}` : ''}
          
          Format the response as a valid JSON object with these properties:
          - affirmation: A short, positive affirmation tailored to the user's situation
          - tip: A practical wellness or mindfulness tip the user can apply today
          
          Make both the affirmation and tip uplifting, positive, and in second-person perspective.
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const response = JSON.parse(completion.choices[0].message.content);
        
        dailyBoost = await storage.createDailyBoost({
          userId,
          affirmation: response.affirmation,
          tip: response.tip
        });
      } catch (error) {
        // Fallback if OpenAI fails
        dailyBoost = await storage.createDailyBoost({
          userId,
          affirmation: "You are capable and worthy of joy and wellness in your life.",
          tip: "Take five deep breaths whenever you feel overwhelmed today."
        });
      }
    }
    
    res.json(dailyBoost);
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    
    try {
      // Get user data for context
      const recentMoods = await storage.getMoodEntries(parseInt(userId));
      const recentJournals = await storage.getJournalEntries(parseInt(userId));
      
      const prompt = `
        You are a compassionate AI wellness coach named "ZenJoy". Your goal is to help the user improve their wellbeing through positive psychology, mindfulness practices, and evidence-based techniques.
        
        When responding, use a warm, supportive tone. Provide practical advice when appropriate, but focus primarily on empowering the user with their own wisdom and resources. Use occasional emojis for warmth.
        
        ${recentMoods.length > 0 ? `Recent moods: ${recentMoods.slice(0, 3).map(m => `${m.mood} (${m.score}/10)`).join(', ')}` : ''}
        ${recentJournals.length > 0 ? `Recent journal topics: ${recentJournals.slice(0, 2).map(j => j.title).join(', ')}` : ''}
        
        User message: ${message}
      `;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
      });
      
      res.json({ 
        message: completion.choices[0].message.content,
        source: "AI"
      });
    } catch (error) {
      res.status(500).json({ 
        message: "I'm having trouble connecting right now. Could you try again in a moment?",
        source: "error"
      });
    }
  });

  // Image generation endpoint for visual inspiration
  app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    
    try {
      const enhancedPrompt = `A calming, uplifting image showing: ${prompt}. Use bright sky blue colors and sunshine yellow accents. Gentle, soothing style with soft rounded elements.`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });
      
      res.json({ imageUrl: response.data[0].url });
    } catch (error) {
      res.status(500).json({ message: "Error generating image" });
    }
  });

  return httpServer;
}
