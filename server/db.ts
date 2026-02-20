import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, collages } from "@shared/schema";

// Database connection
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/collage_app";

// Create the connection with timeout settings
const client = postgres(connectionString, { 
  prepare: false,
  connect_timeout: 5,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
});

export const db = drizzle(client);
