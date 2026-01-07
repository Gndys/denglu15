import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const feedback = pgTable("feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Feedback = typeof feedback.$inferSelect;
