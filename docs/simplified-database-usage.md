# ShipEasy 简化数据库使用指南

本文档介绍了 ShipEasy 中简化的数据库结构和使用方法。我们采用了直接引用 `libs/database` 的方式，而不是使用工作空间包。

## 目录结构

```
shipeasy/
├── libs/
│   └── database/         # 数据库代码 (非工作空间包)
│       ├── src/
│       │   ├── schema/   # 数据模型定义
│       │   │   ├── users.ts
│       │   │   ├── subscriptions.ts
│       │   │   └── index.ts
│       │   ├── client.ts # 数据库客户端
│       │   ├── migrate.ts # 迁移工具
│       │   ├── seed.ts   # 测试数据填充
│       │   └── index.ts  # 主导出文件
│       ├── scripts.js    # 简易命令脚本
│       └── tsconfig.json
├── apps/
│   ├── next-app/         # Next.js 应用
│   └── nuxt-app/         # Nuxt.js 应用
└── ...
```

## 数据库模型

我们简化了数据库模型，只保留了核心字段:

### 用户模型

- 基本信息 (id, email, name, avatar)
- 认证信息 (passwordHash, emailVerified)
- OAuth 相关信息 (provider, providerId)

### 订阅模型

- 基本信息 (id, userId, planId, status)
- 付款类型 (one_time, subscription)
- 有效期 (startDate, endDate)
- 交易信息 (transactionId, amount, currency)

### 会话模型

- 基本信息 (id, userId, expiresAt)
- 设备信息 (userAgent, ipAddress)

## 使用方法

### 1. 设置数据库连接

在项目根目录的 `.env` 文件中配置:

```
DATABASE_URL=postgresql://username:password@localhost:5432/shipeasy
```

### 2. 初始化数据库

```bash
# 检查数据库连接
pnpm db:check

# 生成数据库迁移文件
pnpm db:generate

# 推送数据库架构
pnpm db:push

# 填充测试数据
pnpm db:seed
```

命令说明：
- `db:check`: 验证数据库连接是否正常工作
- `db:generate`: 生成数据库迁移 SQL 文件（放在 drizzle 目录下）
- `db:push`: 将数据库架构定义推送到数据库（创建表等）
- `db:seed`: 向数据库添加测试数据

### 3. 在应用中使用

在 Next.js 或 Nuxt.js 应用中, 您可以直接导入数据库模块:

```typescript
// 导入数据库客户端和模型
import { db, users, subscriptions } from "@shipeasy/database";
import { eq } from "drizzle-orm";

// 查询用户
const user = await db.select().from(users).where(eq(users.email, "user@example.com"));

// 创建新用户
await db.insert(users).values({
  email: "new@example.com",
  name: "New User",
  passwordHash: hashedPassword,
  role: "user",
});

// 查询用户的订阅
const userSubscriptions = await db.select().from(subscriptions)
  .where(eq(subscriptions.userId, userId));
```

## 与应用框架集成

### Next.js 集成

在 `apps/next-app/next.config.js` 中配置:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@shipeasy/database"]
};

module.exports = nextConfig;
```

### Nuxt.js 集成

在 `apps/nuxt-app/nuxt.config.ts` 中配置:

```ts
export default defineNuxtConfig({
  alias: {
    '@shipeasy/database': '../../libs/database/src'
  },
  build: {
    transpile: ['@shipeasy/database']
  }
});
```

## 优势

1. **简化结构** - 不再需要包管理和发布流程
2. **实时反映变更** - 修改数据库代码立即反映在应用中
3. **减少依赖** - 减少了不必要的依赖和工具
4. **简化命令** - 使用简单的命令执行常见操作

## 注意事项

- libs/database 不是一个工作空间包，而是直接引用
- 数据库代码修改会立即反映到使用它的应用中
- 如果需要独立测试，可以在 libs/database 目录中运行命令 