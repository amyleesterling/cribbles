import {
  users, type User, type InsertUser,
  moodEntries, type MoodEntry, type InsertMoodEntry,
  journalEntries, type JournalEntry, type InsertJournalEntry,
  reflections, type Reflection, type InsertReflection,
  reflectionPrompts, type ReflectionPrompt, type InsertReflectionPrompt,
  resources, type Resource, type InsertResource,
  userPreferences, type UserPreferences, type InsertUserPreferences,
  dailyBoosts, type DailyBoost, type InsertDailyBoost
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood entry operations
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]>;
  createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Journal entry operations
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  createJournalEntry(journalEntry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Reflection operations
  getReflections(userId: number): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
  
  // Reflection prompt operations
  getReflectionPrompts(): Promise<ReflectionPrompt[]>;
  getRandomReflectionPrompt(): Promise<ReflectionPrompt | undefined>;
  createReflectionPrompt(reflectionPrompt: InsertReflectionPrompt): Promise<ReflectionPrompt>;
  
  // Resource operations
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // User preferences operations
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(userPreferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: any): Promise<UserPreferences | undefined>;
  
  // Daily boost operations
  getDailyBoost(userId: number): Promise<DailyBoost | undefined>;
  createDailyBoost(dailyBoost: InsertDailyBoost): Promise<DailyBoost>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodEntries: Map<number, MoodEntry>;
  private journalEntries: Map<number, JournalEntry>;
  private reflections: Map<number, Reflection>;
  private reflectionPrompts: Map<number, ReflectionPrompt>;
  private resources: Map<number, Resource>;
  private userPreferences: Map<number, UserPreferences>;
  private dailyBoosts: Map<number, DailyBoost>;
  
  userIdCounter: number;
  moodEntryIdCounter: number;
  journalEntryIdCounter: number;
  reflectionIdCounter: number;
  reflectionPromptIdCounter: number;
  resourceIdCounter: number;
  userPreferencesIdCounter: number;
  dailyBoostIdCounter: number;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.journalEntries = new Map();
    this.reflections = new Map();
    this.reflectionPrompts = new Map();
    this.resources = new Map();
    this.userPreferences = new Map();
    this.dailyBoosts = new Map();
    
    this.userIdCounter = 1;
    this.moodEntryIdCounter = 1;
    this.journalEntryIdCounter = 1;
    this.reflectionIdCounter = 1;
    this.reflectionPromptIdCounter = 1;
    this.resourceIdCounter = 1;
    this.userPreferencesIdCounter = 1;
    this.dailyBoostIdCounter = 1;
    
    // Initialize with some reflection prompts
    this.initializeReflectionPrompts();
    this.initializeResources();
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
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Mood entry operations
  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).filter(
      (entry) => entry.userId === userId,
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).filter(
      (entry) => {
        const entryDate = new Date(entry.date);
        return (
          entry.userId === userId && 
          entryDate >= startDate && 
          entryDate <= endDate
        );
      }
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMoodEntry(insertMoodEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.moodEntryIdCounter++;
    const moodEntry: MoodEntry = { 
      ...insertMoodEntry, 
      id, 
      date: new Date()
    };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }
  
  // Journal entry operations
  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).filter(
      (entry) => entry.userId === userId,
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getJournalEntry(id: number): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }
  
  async createJournalEntry(insertJournalEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.journalEntryIdCounter++;
    const journalEntry: JournalEntry = { 
      ...insertJournalEntry, 
      id, 
      date: new Date()
    };
    this.journalEntries.set(id, journalEntry);
    return journalEntry;
  }
  
  // Reflection operations
  async getReflections(userId: number): Promise<Reflection[]> {
    return Array.from(this.reflections.values()).filter(
      (reflection) => reflection.userId === userId,
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const id = this.reflectionIdCounter++;
    const reflection: Reflection = { 
      ...insertReflection, 
      id, 
      date: new Date()
    };
    this.reflections.set(id, reflection);
    return reflection;
  }
  
  // Reflection prompt operations
  async getReflectionPrompts(): Promise<ReflectionPrompt[]> {
    return Array.from(this.reflectionPrompts.values());
  }
  
  async getRandomReflectionPrompt(): Promise<ReflectionPrompt | undefined> {
    const prompts = Array.from(this.reflectionPrompts.values());
    if (prompts.length === 0) return undefined;
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
  
  async createReflectionPrompt(insertReflectionPrompt: InsertReflectionPrompt): Promise<ReflectionPrompt> {
    const id = this.reflectionPromptIdCounter++;
    const reflectionPrompt: ReflectionPrompt = { ...insertReflectionPrompt, id };
    this.reflectionPrompts.set(id, reflectionPrompt);
    return reflectionPrompt;
  }
  
  // Resource operations
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }
  
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.category === category,
    );
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }
  
  // User preferences operations
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (preferences) => preferences.userId === userId,
    );
  }
  
  async createUserPreferences(insertUserPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.userPreferencesIdCounter++;
    const userPreferences: UserPreferences = { ...insertUserPreferences, id };
    this.userPreferences.set(id, userPreferences);
    return userPreferences;
  }
  
  async updateUserPreferences(userId: number, preferences: any): Promise<UserPreferences | undefined> {
    const existingPreferences = await this.getUserPreferences(userId);
    
    if (!existingPreferences) return undefined;
    
    const updatedPreferences: UserPreferences = {
      ...existingPreferences,
      preferences: preferences
    };
    
    this.userPreferences.set(existingPreferences.id, updatedPreferences);
    return updatedPreferences;
  }
  
  // Daily boost operations
  async getDailyBoost(userId: number): Promise<DailyBoost | undefined> {
    // Get the most recent daily boost for the user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.dailyBoosts.values())
      .filter(boost => {
        const boostDate = new Date(boost.date);
        boostDate.setHours(0, 0, 0, 0);
        return boost.userId === userId && boostDate.getTime() === today.getTime();
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
  
  async createDailyBoost(insertDailyBoost: InsertDailyBoost): Promise<DailyBoost> {
    const id = this.dailyBoostIdCounter++;
    const dailyBoost: DailyBoost = { 
      ...insertDailyBoost, 
      id, 
      date: new Date()
    };
    this.dailyBoosts.set(id, dailyBoost);
    return dailyBoost;
  }
  
  // Initialize some default reflection prompts
  private initializeReflectionPrompts() {
    const prompts: InsertReflectionPrompt[] = [
      {
        prompt: "What creative challenge are you most proud of overcoming this week?",
        description: "Reflecting on our wins, even small ones, can boost confidence and creativity.",
        category: "creativity"
      },
      {
        prompt: "How did you practice self-care today?",
        description: "Taking care of yourself is essential for maintaining wellbeing.",
        category: "self-care"
      },
      {
        prompt: "What brought you joy today?",
        description: "Recognizing moments of joy helps train our minds to notice the positive.",
        category: "gratitude"
      },
      {
        prompt: "What is one thing you're grateful for right now?",
        description: "Gratitude practice has been shown to increase happiness and satisfaction.",
        category: "gratitude"
      },
      {
        prompt: "What's one small step you can take tomorrow toward your goals?",
        description: "Breaking down goals into small steps makes them more achievable.",
        category: "goals"
      }
    ];
    
    prompts.forEach(prompt => {
      const id = this.reflectionPromptIdCounter++;
      const reflectionPrompt: ReflectionPrompt = { ...prompt, id };
      this.reflectionPrompts.set(id, reflectionPrompt);
    });
  }
  
  // Initialize some default resources
  private initializeResources() {
    const resources: InsertResource[] = [
      {
        title: "5-Minute Breathing Exercise",
        description: "A quick breathing technique to reduce stress and improve focus.",
        content: "Find a comfortable position. Breathe in slowly through your nose for a count of 4. Hold for a count of 2. Exhale slowly through your mouth for a count of 6. Repeat for 5 minutes.",
        category: "meditation",
        tags: ["breathing", "stress", "beginner"]
      },
      {
        title: "Gratitude Practice",
        description: "Scientific research shows gratitude can improve mental health and wellbeing.",
        content: "Each day, write down 3 things you're grateful for. Be specific and reflect on why these things bring you joy or appreciation. Try to find new things each day.",
        category: "mindfulness",
        tags: ["gratitude", "positive psychology", "journaling"]
      },
      {
        title: "Morning Affirmations",
        description: "Start your day with positive intentions and mindset.",
        content: "Repeat these affirmations each morning: 'I am capable and strong', 'I approach challenges with curiosity', 'I deserve peace and joy', 'My creativity flows freely today'.",
        category: "affirmations",
        tags: ["morning routine", "positivity", "self-talk"]
      },
      {
        title: "Digital Detox Guide",
        description: "How to mindfully disconnect from technology to improve mental clarity.",
        content: "Choose specific times each day to check emails and social media. Turn off notifications during deep work. Keep devices out of the bedroom. Schedule a full day each month without screens.",
        category: "lifestyle",
        tags: ["digital wellness", "productivity", "focus"]
      },
      {
        title: "Body Scan Meditation",
        description: "A practice to reconnect with your body and release tension.",
        content: "Lie down in a comfortable position. Starting from your toes, bring attention to each part of your body moving upward. Notice sensations without judgment. If you find tension, breathe into that area and imagine releasing it as you exhale.",
        category: "meditation",
        tags: ["body awareness", "relaxation", "stress release"]
      }
    ];
    
    resources.forEach(resource => {
      const id = this.resourceIdCounter++;
      const resourceItem: Resource = { ...resource, id };
      this.resources.set(id, resourceItem);
    });
  }
}

export const storage = new MemStorage();
