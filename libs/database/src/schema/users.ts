import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

// 用户角色枚举
export const userRoles = {
  ADMIN: "admin",
  USER: "user",
} as const;

// 用户表
export const users = pgTable("users", {
  // 基本信息
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 20 }).default(userRoles.USER).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  // OAuth2 相关字段
  provider: varchar("provider", { length: 50 }),
  providerId: varchar("provider_id", { length: 255 }),
  
  // 时间戳
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}); 