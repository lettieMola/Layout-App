import { type User, type InsertUser, type Collage, type InsertCollage } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Collage operations
  createCollage(collage: InsertCollage): Promise<Collage>;
  getCollage(id: string): Promise<Collage | undefined>;
  updateCollage(id: string, updates: Partial<InsertCollage>): Promise<Collage | undefined>;
  deleteCollage(id: string): Promise<boolean>;
  getAllCollages(): Promise<Collage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private collages: Map<string, Collage>;

  constructor() {
    this.users = new Map();
    this.collages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCollage(insertCollage: InsertCollage): Promise<Collage> {
    const id = randomUUID();
    const collage: Collage = { 
      ...insertCollage,
      id, 
      layout: insertCollage.layout || null,
      filters: insertCollage.filters || null,
      mirrorSettings: insertCollage.mirrorSettings || null,
      createdAt: new Date() 
    };
    this.collages.set(id, collage);
    return collage;
  }

  async getCollage(id: string): Promise<Collage | undefined> {
    return this.collages.get(id);
  }

  async updateCollage(id: string, updates: Partial<InsertCollage>): Promise<Collage | undefined> {
    const existingCollage = this.collages.get(id);
    if (!existingCollage) return undefined;
    
    const updatedCollage: Collage = { ...existingCollage, ...updates };
    this.collages.set(id, updatedCollage);
    return updatedCollage;
  }

  async deleteCollage(id: string): Promise<boolean> {
    return this.collages.delete(id);
  }

  async getAllCollages(): Promise<Collage[]> {
    return Array.from(this.collages.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
}

export const storage = new MemStorage();
