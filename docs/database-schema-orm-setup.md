# 数据库架构和 ORM 实现流程

本文档详细记录了在 ShipEasy SaaS 模板中设置数据库架构和 ORM 的完整流程，包括 Drizzle ORM 的配置、核心数据模型的定义以及迁移脚本的创建。

## 0. 前置条件

### 0.1 数据库连接

确保开发环境中已正确配置 PostgreSQL 数据库并且能够成功连接：

```bash
# 验证数据库连接
psql -d shipeasy_dev -c "SELECT 'Connection successful!' as connection_test;"
```

### 0.2 依赖准备

项目使用 Drizzle ORM 作为数据库 ORM 解决方案。Drizzle 提供了类型安全、轻量级的 ORM 体验，特别适合与 TypeScript 项目集成。

## 1. Drizzle ORM 设置

### 1.1 创建共享数据库包

在 monorepo 的 packages 目录中创建专用于数据库操作的包：

```bash
# 创建数据库包目录
mkdir -p packages/database/{src,drizzle}
```

### 1.2 配置包结构

database 包应包含以下结构：

```
packages/database/
├── drizzle/          # 存放迁移文件
├── src/
│   ├── schema/       # 数据库模式定义
│   │   ├── auth.ts   # 认证相关模式
│   │   ├── users.ts  # 用户相关模式
│   │   ├── orgs.ts   # 组织相关模式
│   │   └── index.ts  # 导出所有模式
│   ├── migrations/   # 迁移管理工具
│   ├── seed/         # 种子数据脚本
│   ├── client.ts     # 数据库客户端配置
│   └── index.ts      # 主入口文件
├── package.json
└── tsconfig.json
```

### 1.3 配置 Drizzle

Drizzle 需要以下配置：

1. **客户端配置**：设置与 PostgreSQL 的连接
2. **迁移配置**：创建迁移脚本配置
3. **类型生成配置**：从架构生成 TypeScript 类型

## 2. 核心数据模型定义

### 2.1 用户模型 (User)

用户模型应尽量保持简单，同时包含必要的 OAuth2 相关信息：

- `id`：唯一标识符 (UUID)
- `email`：用户电子邮件 (唯一)
- `passwordHash`：密码哈希值 (可选，仅用于邮箱/密码认证)
- `name`：用户姓名
- `avatarUrl`：头像 URL
- `role`：用户角色 (简单枚举：ADMIN, USER)
- `emailVerified`：邮箱验证状态 (布尔值)
- `createdAt`：创建时间
- `updatedAt`：更新时间

**OAuth2 相关字段**：
- `provider`：认证提供商 (如 'google', 'github', 'apple', 'discord')
- `providerId`：提供商用户 ID (提供商返回的唯一标识符)
- `providerAccessToken`：访问令牌 (可选存储，如果需要访问提供商 API)
- `providerRefreshToken`：刷新令牌 (可选存储)
- `providerExpiresAt`：令牌过期时间 (可选)

### 2.2 会话模型 (Session)

管理用户登录会话：

- `id`：唯一标识符 (UUID)
- `userId`：用户 ID
- `expiresAt`：过期时间
- `userAgent`：用户代理信息 (可选)
- `ipAddress`：IP 地址 (可选)
- `createdAt`：创建时间

### 2.3 用户订阅模型 (可选)

如果需要直接为用户提供订阅功能，可以使用简化版本：

- `id`：唯一标识符 (UUID)
- `userId`：所属用户 ID
- `planId`：计划 ID (简单字符串如 'free', 'pro', 'enterprise')
- `status`：订阅状态 (简单枚举：'active', 'canceled', 'past_due')
- `startDate`：开始日期
- `endDate`：结束日期
- `stripeCustomerId`：Stripe 客户 ID (如果使用 Stripe)
- `stripeSubscriptionId`：Stripe 订阅 ID (如果使用 Stripe)
- `createdAt`：创建时间
- `updatedAt`：更新时间

### 2.4 其他可能的模型

根据应用需要，还可能包含以下模型：

- **支付 (Payment)**：用户支付记录
- **审计日志 (AuditLog)**：系统操作日志
- **用户配置 (UserPreference)**：用户自定义设置

## 3. 架构模块化组织

### 3.1 模块化原则

将数据库架构按照功能领域进行模块化：

1. **认证模块**：用户、会话、验证令牌
2. **订阅模块**：用户订阅、支付记录
3. **系统模块**：审计日志、系统设置
4. **功能模块**：根据应用具体功能添加

## 4. 迁移和种子脚本

### 4.1 创建迁移文件

Drizzle 提供了命令行工具来生成迁移文件：

```bash
# 生成迁移文件
pnpm drizzle-kit generate:pg
```

迁移策略：
1. 初始架构迁移
2. 增量架构更新
3. 回滚机制设计

### 4.2 创建种子数据

为开发和测试环境创建初始数据：

1. **管理员用户**
2. **默认组织**
3. **订阅计划**

种子数据应该支持以下场景：
1. 新开发环境初始化
2. 测试环境重置
3. 演示数据生成

## 5. 数据库操作工具函数

### 5.1 基础 CRUD 操作

为每个主要实体创建标准 CRUD 操作：

1. **创建记录**
2. **读取记录**（单个和集合）
3. **更新记录**
4. **删除记录**

设计模式应遵循:
1. 类型安全
2. 错误处理标准化
3. 事务支持

### 5.2 复杂查询封装

封装常用的复杂查询:

1. **带关系的数据查询**：如获取用户及其所有组织
2. **分页查询**：支持偏移和游标分页
3. **过滤和排序**：动态查询构建

### 5.3 事务管理

实现事务管理工具函数：

1. **开始事务**
2. **提交事务**
3. **回滚事务**
4. **事务中执行多个操作**

## 6. 集成到应用程序

### 6.1 Next.js 集成

在 Next.js 应用中使用数据库包：

1. 在 API 路由中导入和使用
2. 在服务器组件中直接查询
3. 在服务器操作中执行写入操作
4. 使用中间件进行用户认证

### 6.2 Nuxt.js 集成

在 Nuxt.js 应用中使用数据库包：

1. 在服务器 API 中导入和使用
2. 在服务器路由中访问数据库
3. 配置 Nitro 预构建依赖

## 7. 数据库性能优化

### 7.1 索引优化

为以下场景创建索引：

1. **外键字段**：如 `organizationId`、`userId` 等
2. **频繁查询字段**：如 `email`、`slug` 等
3. **排序字段**：如 `createdAt` 等

### 7.2 查询优化

优化常见查询模式：

1. **N+1 查询问题解决**
2. **选择性字段查询**
3. **合适的批量操作**

## 8. 验证和测试

### 8.1 架构验证

验证数据库架构的完整性：

1. **约束验证**：确保唯一约束、外键约束正常工作
2. **索引效率测试**：验证索引是否按预期工作

### 8.2 编写数据库测试

创建测试套件：

1. **单元测试**：测试各个操作函数
2. **集成测试**：测试跨表操作和事务
3. **性能测试**：评估查询性能

## 9. 维护和文档

### 9.1 文档生成

为数据库架构生成文档：

1. **架构可视化**：表结构和关系图
2. **API 文档**：数据库操作函数的用法

### 9.2 监控和日志

设置数据库操作监控：

1. **性能度量**：记录查询执行时间
2. **错误日志**：捕获和记录数据库错误

## 10. 下一步

完成数据库架构和 ORM 设置后，可以进行以下工作：

1. 实现用户认证和授权系统
2. 开发组织和团队管理功能
3. 集成订阅和支付处理
4. 实现审计日志记录

## 附录: 有用的命令和操作

```bash
# 生成迁移文件
pnpm -F @shipeasy/database drizzle-kit generate:pg

# 应用迁移
pnpm -F @shipeasy/database migrate

# 生成类型
pnpm -F @shipeasy/database generate:types

# 运行种子脚本
pnpm -F @shipeasy/database seed

# 测试数据库连接
pnpm -F @shipeasy/database test:connection
``` 