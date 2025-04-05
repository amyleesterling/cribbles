import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(), // 1-5 scale
  notes: text("notes"),
  date: timestamp("date").defaultNow(),
});

export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyBoosts = pgTable("daily_boosts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  tags: text("tags").array(),
  seenAt: timestamp("seen_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  preferences: json("preferences").notNull().$type<{
    notificationTime?: string;
    topicPreferences?: string[];
    wellnessGoals?: string[];
  }>(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMoodSchema = createInsertSchema(moods).omit({ id: true });
export const insertJournalSchema = createInsertSchema(journals).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertDailyBoostSchema = createInsertSchema(dailyBoosts).omit({ id: true, createdAt: true, seenAt: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type InsertJournal = z.infer<typeof insertJournalSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertDailyBoost = z.infer<typeof insertDailyBoostSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  moods: many(moods),
  journals: many(journals),
  chatMessages: many(chatMessages),
  dailyBoosts: many(dailyBoosts),
  preferences: one(userPreferences),
}));

export const moodsRelations = relations(moods, ({ one }) => ({
  user: one(users, {
    fields: [moods.userId],
    references: [users.id],
  }),
}));

export const journalsRelations = relations(journals, ({ one }) => ({
  user: one(users, {
    fields: [journals.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const dailyBoostsRelations = relations(dailyBoosts, ({ one }) => ({
  user: one(users, {
    fields: [dailyBoosts.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Mood = typeof moods.$inferSelect;
export type Journal = typeof journals.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type DailyBoost = typeof dailyBoosts.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
