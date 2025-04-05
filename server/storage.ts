import { 
  users, type User, type InsertUser,
  moods, type Mood, type InsertMood,
  journals, type Journal, type InsertJournal,
  chatMessages, type ChatMessage, type InsertChatMessage,
  dailyBoosts, type DailyBoost, type InsertDailyBoost,
  userPreferences, type UserPreferences, type InsertUserPreferences
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moods: Map<number, Mood>;
  private journals: Map<number, Journal>;
  private chatMessages: Map<number, ChatMessage>;
  private dailyBoosts: Map<number, DailyBoost>;
  private userPreferences: Map<number, UserPreferences>;
  
  private currentUserId: number;
  private currentMoodId: number;
  private currentJournalId: number;
  private currentChatMessageId: number;
  private currentDailyBoostId: number;
  private currentUserPreferencesId: number;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.journals = new Map();
    this.chatMessages = new Map();
    this.dailyBoosts = new Map();
    this.userPreferences = new Map();
    
    this.currentUserId = 1;
    this.currentMoodId = 1;
    this.currentJournalId = 1;
    this.currentChatMessageId = 1;
    this.currentDailyBoostId = 1;
    this.currentUserPreferencesId = 1;
    
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
}

export const storage = new MemStorage();
