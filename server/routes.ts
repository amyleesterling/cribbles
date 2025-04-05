import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDailyBoost, chatWithCoach, generateInspirationImage, analyzeJournalEntry } from "./openai";
import { insertUserSchema, insertMoodSchema, insertJournalSchema, insertChatMessageSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      // Generate response
      const assistantResponse = await chatWithCoach(userId, content, conversationHistory);
      
      // Save assistant response
      const assistantMessage = await storage.createChatMessage({
        userId,
        role: "assistant",
        content: assistantResponse
      });
      
      res.json(assistantMessage);
    } catch (error) {
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
      const updatedPreferences = await storage.updateUserPreferences(userId, req.body);
      if (!updatedPreferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(updatedPreferences);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Visual Inspiration API
  app.post("/api/inspiration", async (req, res) => {
    const schema = z.object({
      prompt: z.string().min(1)
    });
    
    try {
      const { prompt } = schema.parse(req.body);
      const imageUrl = await generateInspirationImage(prompt);
      res.json({ imageUrl });
    } catch (error) {
      res.status(400).json({ message: "Could not generate inspiration image" });
    }
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
