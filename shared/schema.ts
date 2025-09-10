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

// AI Processing Types
export const AIEffectSchema = z.enum([
  'bg_remove',
  'style_transfer', 
  'face_enhance',
  'upscale',
  'colorization',
  'object_detection'
]);

export const AIProcessRequestSchema = z.object({
  imageData: z.string(), // base64 encoded image
  effect: AIEffectSchema,
  options: z.record(z.any()).optional(),
});

export const AIProcessResponseSchema = z.object({
  processedImage: z.string(),
  success: z.boolean(),
  message: z.string().optional(),
});

// Chat Assistant Types
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date().optional(),
});

export const AssistantActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('setLayout'), layoutId: z.string() }),
  z.object({ type: z.literal('applyFilter'), filter: z.string() }),
  z.object({ type: z.literal('removeBackground'), imageIndex: z.number() }),
  z.object({ type: z.literal('enhanceFace'), imageIndex: z.number() }),
  z.object({ type: z.literal('upscale'), imageIndex: z.number() }),
  z.object({ type: z.literal('save') }),
  z.object({ type: z.literal('download') }),
]);

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
  context: z.object({
    images: z.array(z.string()).optional(),
    layout: z.string().optional(), 
    filters: z.array(z.string()).optional(),
  }).optional(),
});

export const ChatResponseSchema = z.object({
  text: z.string(),
  actions: z.array(AssistantActionSchema).optional(),
});

export type AIEffect = z.infer<typeof AIEffectSchema>;
export type AIProcessRequest = z.infer<typeof AIProcessRequestSchema>;
export type AIProcessResponse = z.infer<typeof AIProcessResponseSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type AssistantAction = z.infer<typeof AssistantActionSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
