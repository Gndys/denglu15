import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

// 订阅状态枚举
export const subscriptionStatus = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
} as const;

// 付款类型枚举
export const paymentTypes = {
  ONE_TIME: "one_time",
  SUBSCRIPTION: "subscription",
} as const;

// 用户订阅表
export const subscriptions = pgTable("subscriptions", {
  // 基本信息
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  planId: varchar("plan_id", { length: 50 }).notNull(), // e.g., 'free', 'pro', 'enterprise'
  status: varchar("status", { length: 20 }).default(subscriptionStatus.ACTIVE).notNull(),

  // 付款类型
  paymentType: varchar("payment_type", { length: 20 }).default(paymentTypes.ONE_TIME).notNull(),
  
  // 有效期
  startDate: timestamp("start_date", { withTimezone: true }).defaultNow().notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  
  // 交易信息 (用于一次性付款)
  transactionId: varchar("transaction_id", { length: 255 }),
  amount: varchar("amount", { length: 50 }),
  currency: varchar("currency", { length: 10 }),
  
  // 时间戳
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 会话表 (用于用户登录管理)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}); 