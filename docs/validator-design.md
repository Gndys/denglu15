# Validator 设计方案

## 目标
- 使用 Zod 实现数据验证
- 保持简单直接的实现方式
- 与现有的 schema 结构保持一致

## 目录结构
```
libs/
  ├── database/          # 现有的数据库相关代码
  │   └── schema/       # 数据库 schema 定义
  └── validators/       # 新增的验证器目录
      ├── index.ts     # 导出所有验证器
      ├── user.ts      # 用户相关验证器
      ├── auth.ts      # 认证相关验证器
      └── subscription.ts  # 订阅相关验证器
```

## 实现方案

### 1. 基本原则
- 每个验证器文件对应一个 schema 文件
- 验证器命名采用 `xxxSchema` 的形式
- 验证器与数据库 schema 保持字段一致性
- 根据实际业务需求添加额外的验证规则

### 2. 示例实现 (user.ts)
```typescript
import { z } from 'zod';
import { userRoles } from '../database/schema/user';

// 创建用户验证器
export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum([userRoles.ADMIN, userRoles.USER]).default(userRoles.USER),
  phoneNumber: z.string().optional(),
});

// 更新用户验证器
export const updateUserSchema = createUserSchema.partial();
```

### 3. 使用方式
```typescript
import { createUserSchema } from '@/libs/validators/user';

// 验证数据
const result = createUserSchema.safeParse(data);
if (!result.success) {
  console.error(result.error);
  return;
}
```

## 注意事项
1. 验证规则应该根据实际业务需求设定，避免过度复杂化
2. 可以根据不同的业务场景创建不同的验证器（如创建、更新、查询等）
3. 验证错误信息可以根据需要进行本地化处理

## 下一步
1. 创建 `libs/validators` 目录
2. 实现基本的验证器
3. 在业务代码中集成验证器
4. 添加必要的错误处理机制 