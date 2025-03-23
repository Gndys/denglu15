# 用户管理服务搭建流程

本文档详细记录了 ShipEasy SaaS 模板中用户管理服务的搭建流程和关键步骤。用户管理服务基于 Better-Auth 库实现，负责处理用户认证、授权及相关操作。

## 1. 创建用户管理服务目录结构

在 `libs` 目录下创建用户管理服务文件夹：

```bash
mkdir -p libs/auth
```

## 2. 安装依赖

在项目根目录安装所需依赖：

```bash
# 安装 Better-Auth 核心库
pnpm add better-auth
# 安装客户端库（针对 Next.js 和 Nuxt.js）
pnpm add better-auth/react better-auth/vue
# 安装辅助依赖
pnpm add nanoid
```

## 3. 配置环境变量

在项目根目录的 `.env` 文件中添加 Better-Auth 所需的环境变量：

```bash
# Better-Auth 配置
BETTER_AUTH_SECRET=your-secret-key-here # 用于加密和生成哈希的密钥
BETTER_AUTH_URL=http://localhost:3000 # 应用基础 URL
```

## 4. 创建认证服务实例

### 4.1 创建 auth.ts 文件

```bash
touch libs/auth/auth.ts
```

auth.ts 内容示例：

```typescript
import { betterAuth } from "better-auth";
import { db } from "../database";
import { users, userRoles } from "../database/schema/users";
import { eq } from "drizzle-orm";

// 创建 Better-Auth 实例
export const auth = betterAuth({
  // 配置数据库 - 使用 Drizzle
  database: {
    // 由于 Better-Auth 原生支持 Kysely，我们需要提供适配器
    // 这是一个简单的适配器示例，实际使用时可能需要更完善的实现
    adapter: {
      type: "postgresql", // 数据库类型
      async getUser(userId) {
        const result = await db.select().from(users).where(eq(users.id, userId));
        return result[0] || null;
      },
      async getUserByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0] || null;
      },
      async createUser(userData) {
        const result = await db.insert(users).values(userData).returning();
        return result[0];
      },
      async updateUser(userId, data) {
        const result = await db
          .update(users)
          .set(data)
          .where(eq(users.id, userId))
          .returning();
        return result[0];
      },
      // 其他必要的数据库操作...
    }
  },
  
  // 配置邮箱密码认证
  emailAndPassword: {
    enabled: true,
  },
  
  // 配置社交登录提供商
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  
  // 自定义回调
  callbacks: {
    // 自定义用户创建逻辑
    async onUserCreate(user, provider) {
      // 根据需要添加额外的用户数据
      return {
        ...user,
        role: userRoles.USER,
        emailVerified: provider !== "email",
      };
    },
    
    // 自定义登录逻辑
    async onSignIn(user, account, profile) {
      // 可以在这里进行额外的验证或记录
      return true;
    },
  },
});

// 导出认证服务
export default auth;
```

## 5. 创建 API 路由处理程序

### 5.1 Next.js 应用中的认证路由处理

创建 Next.js API 路由处理程序：

```bash
mkdir -p apps/next-app/app/api/auth
```

```typescript
// apps/next-app/app/api/auth/[...all]/route.ts
import { auth } from "@/libs/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// 导出 Next.js API 路由处理程序
export const { POST, GET } = toNextJsHandler(auth);
```

### 5.2 Nuxt.js 应用中的认证路由处理

创建 Nuxt.js 服务器路由：

```bash
mkdir -p apps/nuxt-app/server/api/auth
```

```typescript
// apps/nuxt-app/server/api/auth/[...].ts
import { auth } from "@/libs/auth/auth";
import { toNuxtHandler } from "better-auth/nuxt";

export default toNuxtHandler(auth);
```

## 6. 创建客户端实例

### 6.1 Next.js 客户端

```bash
touch libs/auth/next-client.ts
```

```typescript
// libs/auth/next-client.ts
import { createAuthClient } from "better-auth/react";

// 创建客户端实例
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
});

// 导出常用方法
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  useAuth,
  getSession,
} = authClient;
```

### 6.2 Nuxt.js 客户端

```bash
touch libs/auth/nuxt-client.ts
```

```typescript
// libs/auth/nuxt-client.ts
import { createAuthClient } from "better-auth/vue";

// 创建客户端实例
export const authClient = createAuthClient({
  baseURL: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3000"
});

// 导出常用方法
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  useAuth,
  getSession,
} = authClient;
```

## 7. 创建数据库表

Better-Auth 需要特定的数据库表来存储用户和认证相关数据。使用 Better-Auth CLI 工具生成和迁移所需的表：

```bash
# 安装 CLI 工具
pnpm add -D @better-auth/cli

# 生成数据库迁移
npx @better-auth/cli generate

# 应用迁移（如果使用 Kysely）
npx @better-auth/cli migrate
```

如果使用自定义适配器（如 Drizzle），确保数据库架构包含 Better-Auth 所需的必要字段。

## 8. 集成到 Next.js 应用

### 8.1 创建身份验证提供者

```typescript
// apps/next-app/providers/auth-provider.tsx
import { AuthProvider } from "better-auth/react";
import { authClient } from "@/libs/auth/next-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider client={authClient}>
      {children}
    </AuthProvider>
  );
}
```

### 8.2 在布局中使用提供者

```typescript
// apps/next-app/app/layout.tsx
import { Providers } from "@/providers/auth-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 8.3 在组件中使用认证钩子

```typescript
// apps/next-app/components/login-form.tsx
import { useState } from "react";
import { signIn } from "@/libs/auth/next-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn("email", { email, password });
      // 登录成功，重定向或显示成功消息
    } catch (error) {
      // 处理错误
      console.error("登录失败:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
}
```

### 8.4 保护路由

```typescript
// apps/next-app/middleware.ts
import { withAuth } from "better-auth/next-js/middleware";

export default withAuth({
  // 配置项
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        return isLoggedIn;
      }
      
      return true;
    },
  },
});

// 配置匹配的路由
export const config = { matcher: ["/dashboard/:path*"] };
```

## 9. 集成到 Nuxt.js 应用

### 9.1 创建认证插件

```typescript
// apps/nuxt-app/plugins/auth.ts
import { authClient } from "@/libs/auth/nuxt-client";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide("auth", authClient);
  
  // 自动恢复会话
  await authClient.getSession();
});
```

### 9.2 创建认证中间件

```typescript
// apps/nuxt-app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const { getSession } = useAuth();
  const session = await getSession();
  
  // 检查要访问的页面是否需要认证
  if (to.meta.auth && !session) {
    return navigateTo("/login");
  }
});
```

### 9.3 在页面中使用认证

```vue
<!-- apps/nuxt-app/pages/login.vue -->
<template>
  <div>
    <h1>登录</h1>
    <form @submit.prevent="handleLogin">
      <!-- 表单内容 -->
    </form>
    
    <div class="social-logins">
      <button @click="handleGithubLogin">使用 GitHub 登录</button>
      <button @click="handleGoogleLogin">使用 Google 登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signIn } from "@/libs/auth/nuxt-client";

const email = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  try {
    await signIn("email", { email: email.value, password: password.value });
    navigateTo("/dashboard");
  } catch (err) {
    error.value = "登录失败，请检查您的凭据";
  }
}

async function handleGithubLogin() {
  await signIn("github");
}

async function handleGoogleLogin() {
  await signIn("google");
}
</script>
```

## 10. 监控和日志

配置 Better-Auth 的事件订阅，记录重要的认证事件：

```typescript
// libs/auth/events.ts
import { auth } from "./auth";

// 监听认证事件
auth.events.on("signIn", ({ user, provider }) => {
  console.log(`用户 ${user.email} 通过 ${provider} 登录成功`);
  // 可以在这里记录到日志系统
});

auth.events.on("signUp", ({ user, provider }) => {
  console.log(`新用户 ${user.email} 通过 ${provider} 注册`);
  // 可以在这里发送欢迎邮件
});

auth.events.on("error", (error) => {
  console.error("认证错误:", error);
  // 记录错误到监控系统
});
```

## 11. 环境变量配置

在 `.env.example` 中添加以下环境变量：

```
# Better-Auth 配置
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth 提供商 - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth 提供商 - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 前端 URL 配置
NEXT_PUBLIC_API_URL=http://localhost:3000
NUXT_PUBLIC_API_URL=http://localhost:3000
```

## 12. 安全性考量

- Better-Auth 自动处理密码哈希和安全存储
- 使用正确的 CORS 配置防止跨域攻击
- 配置适当的令牌过期时间
- 实现速率限制防止暴力攻击
- 定期更新 Better-Auth 到最新版本
- 确保所有认证相关 API 使用 HTTPS
