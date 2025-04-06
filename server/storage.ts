import { 
  users, type User, type InsertUser,
  moods, type Mood, type InsertMood,
  journals, type Journal, type InsertJournal,
  chatMessages, type ChatMessage, type InsertChatMessage,
  dailyBoosts, type DailyBoost, type InsertDailyBoost,
  userPreferences, type UserPreferences, type InsertUserPreferences,
  inspirationImages, type InspirationImage, type InsertInspirationImage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined>;
  
  // Mood operations
  getMoodsByUserId(userId: number): Promise<Mood[]>;
  getMoodByDate(userId: number, date: Date): Promise<Mood | undefined>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // Journal operations
  getJournalsByUserId(userId: number): Promise<Journal[]>;
  getJournalById(id: number): Promise<Journal | undefined>;
  createJournal(journal: InsertJournal): Promise<Journal>;
  
  // Chat operations
  getChatMessagesByUserId(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Daily boosts operations
  getDailyBoostsByUserId(userId: number): Promise<DailyBoost[]>;
  getLatestDailyBoost(userId: number): Promise<DailyBoost | undefined>;
  createDailyBoost(boost: InsertDailyBoost): Promise<DailyBoost>;
  markDailyBoostAsSeen(id: number): Promise<void>;
  
  // User preferences operations
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  setUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences['preferences']>): Promise<UserPreferences | undefined>;
  
  // Inspiration images operations
  getInspirationImagesByUserId(userId: number): Promise<InspirationImage[]>;
  getDailyInspirationImage(userId: number): Promise<InspirationImage | undefined>;
  saveInspirationImage(image: InsertInspirationImage): Promise<InspirationImage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moods: Map<number, Mood>;
  private journals: Map<number, Journal>;
  private chatMessages: Map<number, ChatMessage>;
  private dailyBoosts: Map<number, DailyBoost>;
  private userPreferences: Map<number, UserPreferences>;
  private inspirationImages: Map<number, InspirationImage>;
  
  private currentUserId: number;
  private currentMoodId: number;
  private currentJournalId: number;
  private currentChatMessageId: number;
  private currentDailyBoostId: number;
  private currentUserPreferencesId: number;
  private currentInspirationImageId: number;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.journals = new Map();
    this.chatMessages = new Map();
    this.dailyBoosts = new Map();
    this.userPreferences = new Map();
    this.inspirationImages = new Map();
    
    this.currentUserId = 1;
    this.currentMoodId = 1;
    this.currentJournalId = 1;
    this.currentChatMessageId = 1;
    this.currentDailyBoostId = 1;
    this.currentUserPreferencesId = 1;
    this.currentInspirationImageId = 1;
    
    // Adding a demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: 'sophia',
      password: 'password123',
      name: 'Sophia Chen',
      role: 'Creative Designer',
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Mood operations
  async getMoodsByUserId(userId: number): Promise<Mood[]> {
    return Array.from(this.moods.values()).filter(
      (mood) => mood.userId === userId,
    );
  }
  
  async getMoodByDate(userId: number, date: Date): Promise<Mood | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.moods.values()).find(mood => {
      if (mood.userId !== userId) return false;
      
      const moodDate = new Date(mood.date);
      moodDate.setHours(0, 0, 0, 0);
      
      return moodDate.getTime() === targetDate.getTime();
    });
  }
  
  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = this.currentMoodId++;
    const mood: Mood = { ...insertMood, id };
    this.moods.set(id, mood);
    return mood;
  }
  
  // Journal operations
  async getJournalsByUserId(userId: number): Promise<Journal[]> {
    return Array.from(this.journals.values())
      .filter((journal) => journal.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getJournalById(id: number): Promise<Journal | undefined> {
    return this.journals.get(id);
  }
  
  async createJournal(insertJournal: InsertJournal): Promise<Journal> {
    const id = this.currentJournalId++;
    const journal: Journal = { ...insertJournal, id, createdAt: new Date() };
    this.journals.set(id, journal);
    return journal;
  }
  
  // Chat operations
  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { ...insertMessage, id, createdAt: new Date() };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Daily boosts operations
  async getDailyBoostsByUserId(userId: number): Promise<DailyBoost[]> {
    return Array.from(this.dailyBoosts.values())
      .filter((boost) => boost.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getLatestDailyBoost(userId: number): Promise<DailyBoost | undefined> {
    const boosts = await this.getDailyBoostsByUserId(userId);
    return boosts.length > 0 ? boosts[0] : undefined;
  }
  
  async createDailyBoost(insertBoost: InsertDailyBoost): Promise<DailyBoost> {
    const id = this.currentDailyBoostId++;
    const boost: DailyBoost = { 
      ...insertBoost, 
      id, 
      seenAt: null, 
      createdAt: new Date() 
    };
    this.dailyBoosts.set(id, boost);
    return boost;
  }
  
  async markDailyBoostAsSeen(id: number): Promise<void> {
    const boost = this.dailyBoosts.get(id);
    if (boost) {
      boost.seenAt = new Date();
      this.dailyBoosts.set(id, boost);
    }
  }
  
  // User preferences operations
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (prefs) => prefs.userId === userId,
    );
  }
  
  async setUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.currentUserPreferencesId++;
    const preferences: UserPreferences = { ...insertPreferences, id };
    
    // If preferences already exist for this user, update the ID
    const existingPrefs = await this.getUserPreferences(insertPreferences.userId);
    if (existingPrefs) {
      this.userPreferences.delete(existingPrefs.id);
      preferences.id = existingPrefs.id;
    }
    
    this.userPreferences.set(preferences.id, preferences);
    return preferences;
  }
  
  async updateUserPreferences(userId: number, preferencesUpdate: Partial<InsertUserPreferences['preferences']>): Promise<UserPreferences | undefined> {
    const existingPrefs = await this.getUserPreferences(userId);
    
    if (!existingPrefs) return undefined;
    
    const updatedPreferences: UserPreferences = {
      ...existingPrefs,
      preferences: {
        ...existingPrefs.preferences,
        ...preferencesUpdate
      }
    };
    
    this.userPreferences.set(existingPrefs.id, updatedPreferences);
    return updatedPreferences;
  }
  
  // Inspiration images operations
  async getInspirationImagesByUserId(userId: number): Promise<InspirationImage[]> {
    return Array.from(this.inspirationImages.values())
      .filter((image) => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getDailyInspirationImage(userId: number): Promise<InspirationImage | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.inspirationImages.values()).find(image => {
      if (image.userId !== userId || !image.isDaily) return false;
      
      const imageDate = new Date(image.createdAt);
      imageDate.setHours(0, 0, 0, 0);
      
      return imageDate.getTime() === today.getTime();
    });
  }
  
  async saveInspirationImage(insertImage: InsertInspirationImage): Promise<InspirationImage> {
    const id = this.currentInspirationImageId++;
    const image: InspirationImage = { ...insertImage, id, createdAt: new Date() };
    this.inspirationImages.set(id, image);
    return image;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  // Mood operations
  async getMoodsByUserId(userId: number): Promise<Mood[]> {
    return db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.date));
  }
  
  async getMoodByDate(userId: number, date: Date): Promise<Mood | undefined> {
    // Convert Date to format without time component for comparison
    const dateStr = date.toISOString().split('T')[0];
    
    const [mood] = await db
      .select()
      .from(moods)
      .where(
        and(
          eq(moods.userId, userId),
          sql`DATE(${moods.date}) = ${dateStr}`
        )
      );
    
    return mood || undefined;
  }
  
  async createMood(insertMood: InsertMood): Promise<Mood> {
    const [mood] = await db
      .insert(moods)
      .values(insertMood)
      .returning();
    return mood;
  }
  
  // Journal operations
  async getJournalsByUserId(userId: number): Promise<Journal[]> {
    return db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt));
  }
  
  async getJournalById(id: number): Promise<Journal | undefined> {
    const [journal] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id));
    return journal || undefined;
  }
  
  async createJournal(insertJournal: InsertJournal): Promise<Journal> {
    const [journal] = await db
      .insert(journals)
      .values(insertJournal)
      .returning();
    return journal;
  }
  
  // Chat operations
  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt);
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  // Daily boosts operations
  async getDailyBoostsByUserId(userId: number): Promise<DailyBoost[]> {
    return db
      .select()
      .from(dailyBoosts)
      .where(eq(dailyBoosts.userId, userId))
      .orderBy(desc(dailyBoosts.createdAt));
  }
  
  async getLatestDailyBoost(userId: number): Promise<DailyBoost | undefined> {
    const [boost] = await db
      .select()
      .from(dailyBoosts)
      .where(eq(dailyBoosts.userId, userId))
      .orderBy(desc(dailyBoosts.createdAt))
      .limit(1);
    
    return boost || undefined;
  }
  
  async createDailyBoost(insertBoost: InsertDailyBoost): Promise<DailyBoost> {
    const [boost] = await db
      .insert(dailyBoosts)
      .values(insertBoost)
      .returning();
    return boost;
  }
  
  async markDailyBoostAsSeen(id: number): Promise<void> {
    await db
      .update(dailyBoosts)
      .set({ seenAt: new Date() })
      .where(eq(dailyBoosts.id, id));
  }
  
  // User preferences operations
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    
    return prefs || undefined;
  }
  
  async setUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    // Check if preferences already exist for this user
    const existingPrefs = await this.getUserPreferences(insertPreferences.userId);
    
    if (existingPrefs) {
      // Update existing preferences
      const [updatedPrefs] = await db
        .update(userPreferences)
        .set({ preferences: insertPreferences.preferences })
        .where(eq(userPreferences.id, existingPrefs.id))
        .returning();
      return updatedPrefs;
    } else {
      // Create new preferences
      const [prefs] = await db
        .insert(userPreferences)
        .values({
          userId: insertPreferences.userId,
          preferences: insertPreferences.preferences
        })
        .returning();
      return prefs;
    }
  }
  
  async updateUserPreferences(
    userId: number, 
    preferencesUpdate: Partial<InsertUserPreferences['preferences']>
  ): Promise<UserPreferences | undefined> {
    const existingPrefs = await this.getUserPreferences(userId);
    
    if (!existingPrefs) {
      return undefined;
    }
    
    const newPreferences = {
      ...existingPrefs.preferences,
      ...preferencesUpdate
    };
    
    const [updatedPrefs] = await db
      .update(userPreferences)
      .set({ preferences: newPreferences })
      .where(eq(userPreferences.id, existingPrefs.id))
      .returning();
    
    return updatedPrefs;
  }
  
  // Inspiration images operations
  async getInspirationImagesByUserId(userId: number): Promise<InspirationImage[]> {
    return db
      .select()
      .from(inspirationImages)
      .where(eq(inspirationImages.userId, userId))
      .orderBy(desc(inspirationImages.createdAt));
  }
  
  async getDailyInspirationImage(userId: number): Promise<InspirationImage | undefined> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    const [image] = await db
      .select()
      .from(inspirationImages)
      .where(
        and(
          eq(inspirationImages.userId, userId),
          eq(inspirationImages.isDaily, true),
          sql`DATE(${inspirationImages.createdAt}) = ${dateStr}`
        )
      );
      
    return image || undefined;
  }
  
  async saveInspirationImage(insertImage: InsertInspirationImage): Promise<InspirationImage> {
    const [image] = await db
      .insert(inspirationImages)
      .values(insertImage)
      .returning();
    return image;
  }
}

// Initialize database storage for Cribbles app
export const storage = new DatabaseStorage();
