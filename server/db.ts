import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please set your PostgreSQL connection string.",
  );
}

// Create connection with postgres.js
const client = postgres(process.env.DATABASE_URL, { max: 1 });
export const db = drizzle(client, { schema });