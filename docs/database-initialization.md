# ShipEasy 数据库初始化指南

本文档提供了如何初始化和使用 ShipEasy 数据库的详细说明。

## 前提条件

请确保您已经：

1. 安装了 PostgreSQL（参见 `dev-environment-setup.md`）
2. 创建了 ShipEasy 数据库（参见 `dev-environment-setup.md`）
3. 配置了 `.env` 文件，包含有效的 `DATABASE_URL`

## 1. 安装数据库包依赖

首先，进入数据库包目录并安装所有依赖：

```bash
cd packages/database
pnpm install
```

## 2. 项目数据模型概述

ShipEasy 使用 Drizzle ORM 定义了以下数据模型：

- **用户 (Users)** - 管理用户信息和身份验证
  - 基本信息（email、name、image 等）
  - 身份验证相关数据（password、emailVerified 等）
  - OAuth2 相关字段（用于第三方登录）

- **订阅 (Subscriptions)** - 管理用户订阅和支付信息
  - 支持一次性付款和定期订阅
  - 跟踪订阅状态、开始和结束日期
  - 存储支付交易信息

- **会话 (Sessions)** - 管理用户登录会话
  - 跟踪会话过期时间
  - 存储用户代理和 IP 地址信息

## 3. 初始化数据库架构

### 选项 1：使用直接推送（开发环境）

在开发过程中，您可以直接将架构推送到数据库：

```bash
cd packages/database
pnpm run push
```

### 选项 2：使用迁移（生产环境）

对于生产环境，建议使用正式的迁移流程：

```bash
# 生成迁移文件
pnpm run generate

# 应用迁移
pnpm run migrate
```

## 4. 填充测试数据

ShipEasy 提供了种子脚本来填充测试数据：

```bash
# 运行种子脚本
pnpm run seed
```

这将创建：
- 一个演示用户 (email: demo@example.com, password: password123)
- 一个有效期 30 天的基本订阅

## 5. 在应用程序中使用数据库

导入数据库包并使用 Drizzle ORM API：

```typescript
import { db, users, subscriptions } from "@shipeasy/database";

// 查询用户
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, "user@example.com")
});

// 创建新订阅
await db.insert(subscriptions).values({
  userId: user.id,
  planId: "basic",
  paymentType: "one_time",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
  // 其他字段...
});
```

## 6. 验证订阅状态

要检查用户的订阅是否有效，可以使用以下逻辑：

```typescript
import { db, subscriptions } from "@shipeasy/database";
import { eq, and, gte } from "drizzle-orm";

async function isSubscriptionValid(userId: string) {
  const userSubscription = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq, and, gte }) => and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active"),
      gte(subscriptions.endDate, new Date())
    )
  });
  
  return !!userSubscription;
}
```

## 7. 管理一次性付款和订阅续费

### 一次性付款

对于一次性付款，每次新购买都应创建新的订阅记录：

```typescript
// 处理一次性付款
async function handleOneTimePayment(userId: string, planId: string) {
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  await db.insert(subscriptions).values({
    userId,
    planId,
    paymentType: "one_time",
    status: "active",
    startDate: today,
    endDate: thirtyDaysLater,
    // 其他字段...
  });
}
```

### 订阅续费

对于订阅，应更新现有记录：

```typescript
// 处理订阅续费
async function handleSubscriptionRenewal(subscriptionId: string) {
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  await db.update(subscriptions)
    .set({
      status: "active",
      endDate: thirtyDaysLater,
      updatedAt: today
    })
    .where(eq(subscriptions.id, subscriptionId));
}
```

## 常见问题解答

### 如何修改数据模型？

1. 编辑 `packages/database/src/schema` 目录下的相应模式文件
2. 运行 `pnpm run generate` 生成新的迁移文件
3. 运行 `pnpm run migrate` 应用迁移

### 遇到数据库连接问题怎么办？

1. 确认 PostgreSQL 服务正在运行
2. 验证 `.env` 文件中的 `DATABASE_URL` 配置正确
3. 使用 `psql` 命令行工具尝试直接连接数据库，确认连接信息 