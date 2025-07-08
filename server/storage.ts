import { users, gameProgress, gameResults, type User, type InsertUser, type GameProgress, type InsertGameProgress, type GameResult, type InsertGameResult } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGameProgress(userId: number): Promise<GameProgress | undefined>;
  updateGameProgress(userId: number, progress: Partial<InsertGameProgress>): Promise<GameProgress>;
  
  saveGameResult(result: InsertGameResult): Promise<GameResult>;
  getGameResults(userId: number): Promise<GameResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameProgress: Map<number, GameProgress>;
  private gameResults: Map<number, GameResult[]>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentResultId: number;

  constructor() {
    this.users = new Map();
    this.gameProgress = new Map();
    this.gameResults = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentResultId = 1;
  }

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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create initial game progress
    const initialProgress: GameProgress = {
      id: this.currentProgressId++,
      userId: id,
      totalScore: 0,
      level: 1,
      completedChallenges: 0,
      currentStreak: 0,
      badges: [],
      lastPlayed: new Date(),
    };
    this.gameProgress.set(id, initialProgress);
    
    return user;
  }

  async getGameProgress(userId: number): Promise<GameProgress | undefined> {
    return this.gameProgress.get(userId);
  }

  async updateGameProgress(userId: number, progress: Partial<InsertGameProgress>): Promise<GameProgress> {
    const existing = this.gameProgress.get(userId);
    if (!existing) {
      throw new Error("Game progress not found");
    }
    
    const updated: GameProgress = {
      ...existing,
      ...progress,
      lastPlayed: new Date(),
    };
    
    this.gameProgress.set(userId, updated);
    return updated;
  }

  async saveGameResult(result: InsertGameResult): Promise<GameResult> {
    const gameResult: GameResult = {
      ...result,
      id: this.currentResultId++,
      userId: result.userId || null,
      timeSpent: result.timeSpent || null,
      completedAt: new Date(),
    };
    
    const userResults = this.gameResults.get(result.userId!) || [];
    userResults.push(gameResult);
    this.gameResults.set(result.userId!, userResults);
    
    return gameResult;
  }

  async getGameResults(userId: number): Promise<GameResult[]> {
    return this.gameResults.get(userId) || [];
  }
}

export const storage = new MemStorage();
