import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const collages = pgTable("collages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  images: jsonb("images").notNull(),
  layout: jsonb("layout"),
  filters: jsonb("filters"),
  mirrorSettings: jsonb("mirror_settings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCollageSchema = createInsertSchema(collages).pick({
  name: true,
  images: true,
  layout: true,
  filters: true,
  mirrorSettings: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCollage = z.infer<typeof insertCollageSchema>;
export type Collage = typeof collages.$inferSelect;

// Frontend-only types for the collage app
export interface CollageImage {
  id: string;
  uri: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface GridLayout {
  id: string;
  name: string;
  shape: "rect" | "heart" | "clover" | "hexagon" | "circle" | "custom";
  rows: number;
  cols: number;
  layout: number[][];
}

export interface MirrorLayout {
  type: "vertical" | "horizontal" | "quad";
  parts: 2 | 3 | 4;
}

export interface FilterOption {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: string;
}
