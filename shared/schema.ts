import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
});

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: text("mood").notNull(),
  score: integer("score").notNull(),
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  creativityScore: integer("creativity_score"),
  date: timestamp("date").notNull().defaultNow(),
});

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  promptId: integer("prompt_id").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const reflectionPrompts = pgTable("reflection_prompts", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  description: text("description"),
  category: text("category"),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  preferences: json("preferences").notNull(),
});

export const dailyBoosts = pgTable("daily_boosts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  affirmation: text("affirmation").notNull(),
  tip: text("tip").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  mood: true,
  score: true,
  notes: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  userId: true,
  title: true,
  content: true,
  mood: true,
  creativityScore: true,
});

export const insertReflectionSchema = createInsertSchema(reflections).pick({
  userId: true,
  promptId: true,
  content: true,
});

export const insertReflectionPromptSchema = createInsertSchema(reflectionPrompts).pick({
  prompt: true,
  description: true,
  category: true,
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  content: true,
  category: true,
  tags: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  preferences: true,
});

export const insertDailyBoostSchema = createInsertSchema(dailyBoosts).pick({
  userId: true,
  affirmation: true,
  tip: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;
export type InsertReflectionPrompt = z.infer<typeof insertReflectionPromptSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertDailyBoost = z.infer<typeof insertDailyBoostSchema>;

export type User = typeof users.$inferSelect;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type Reflection = typeof reflections.$inferSelect;
export type ReflectionPrompt = typeof reflectionPrompts.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type DailyBoost = typeof dailyBoosts.$inferSelect;
