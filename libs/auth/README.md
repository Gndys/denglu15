# 认证服务

这个服务使用 [Better Auth](https://www.better-auth.com/) 提供完整的身份认证和授权功能。支持多种认证方式，包括邮箱密码、社交登录、手机号码验证等。

## 功能特点

- 多种认证方式
  - 邮箱密码登录
  - 社交账号登录（Google、GitHub、微信）
  - 手机号码验证登录
- 账户管理
  - 邮箱验证
  - 密码重置
  - 账号关联（可以将多个登录方式关联到同一账户）
- 权限控制
  - 管理员角色
  - 基于角色的访问控制
- 国际化支持
  - 支持中英文邮件模板
  - 根据用户语言偏好发送邮件

## 配置说明

配置分为两部分：
- 敏感信息（如 OAuth 密钥等）通过环境变量配置
- 非敏感信息（如功能开关、过期时间等）直接在 `config.ts` 中配置

### 环境变量

复制 `.env.example` 文件为 `.env`，并填入敏感信息：

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# 微信 OAuth
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 基础 URL（可选，默认为 http://localhost:3000）
AUTH_BASE_URL=your_base_url
```

### 配置文件

认证服务配置结构（在 `config.ts` 中）：

```typescript
export const config = {
  auth: {
    // 应用名称
    appName: 'shipeasy',

    // 基础 URL
    baseURL: 'http://localhost:3000',

    // 社交登录提供商配置
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      },
      wechat: {
        appId: process.env.WECHAT_APP_ID,
        appSecret: process.env.WECHAT_APP_SECRET
      }
    },

    // 邮件验证配置
    emailVerification: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
      autoSignInAfterVerification: true,
      expiryHours: 1
    },

    // 账户配置
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'github', 'wechat']
      }
    },

    // 管理员配置
    admin: {
      roles: ['admin']
    }
  }
};
```

## 认证错误国际化

为了提供更好的用户体验，我们实现了认证错误消息的国际化支持。

### 使用方法

#### Next.js (React)

```typescript
import { authClientReact } from '@libs/auth/authClient';
import { useTranslation } from '@/hooks/use-translation';

function LoginForm() {
  const { t } = useTranslation();
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await authClientReact.signIn.email({
      email,
      password
    });

    if (error?.code) {
      // 使用国际化错误消息
      const authErrorMessage = t.auth.authErrors[error.code as keyof typeof t.auth.authErrors] || t.auth.authErrors.UNKNOWN_ERROR;
      setErrorMessage(authErrorMessage);
    }
  };
}
```

#### Nuxt.js (Vue)

```vue
<script setup>
import { authClientVue } from '@libs/auth/authClient';

const { t } = useI18n();

const handleLogin = async (email, password) => {
  const { error } = await authClientVue.signIn.email({
    email,
    password
  });

  if (error?.code) {
    // 使用国际化错误消息
    const authErrorMessage = t('auth.authErrors.' + error.code) || t('auth.authErrors.UNKNOWN_ERROR');
    errorMessage.value = authErrorMessage;
  }
};
</script>
```

### 支持的错误代码

系统支持以下 Better Auth 错误代码的国际化：

| 错误代码 | 英文消息 | 中文消息 |
|---------|---------|---------|
| `USER_ALREADY_EXISTS` | User with this email already exists | 该邮箱已被注册 |
| `INVALID_EMAIL_OR_PASSWORD` | Invalid email or password | 邮箱或密码错误 |
| `EMAIL_NOT_VERIFIED` | Please verify your email address | 请先验证您的邮箱地址 |
| `USER_NOT_FOUND` | No account found with this email | 未找到该邮箱对应的账户 |
| `INVALID_CREDENTIALS` | Invalid credentials provided | 提供的凭据无效 |
| `ACCOUNT_BLOCKED` | Your account has been temporarily blocked | 您的账户已被临时冻结 |
| `TOO_MANY_REQUESTS` | Too many login attempts. Please try again later | 登录尝试次数过多，请稍后重试 |
| `INVALID_TOKEN` | Invalid or expired token | 无效或已过期的令牌 |
| `SESSION_EXPIRED` | Your session has expired. Please sign in again | 您的会话已过期，请重新登录 |
| `PHONE_NUMBER_ALREADY_EXISTS` | Phone number is already registered | 该手机号已被注册 |
| `INVALID_PHONE_NUMBER` | Invalid phone number format | 手机号格式无效 |
| `OTP_EXPIRED` | Verification code has expired | 验证码已过期 |
| `INVALID_OTP` | Invalid verification code | 验证码错误 |
| `OTP_TOO_MANY_ATTEMPTS` | Too many verification attempts. Please request a new code | 验证尝试次数过多，请重新获取验证码 |
| `CAPTCHA_REQUIRED` | Please complete the captcha verification | 请完成验证码验证 |
| `CAPTCHA_INVALID` | Captcha verification failed | 验证码验证失败 |
| `UNKNOWN_ERROR` | An unexpected error occurred | 发生未知错误 |

### 添加新的错误代码

如果需要添加新的错误代码国际化支持：

1. 在 `libs/i18n/locales/en.ts` 的 `auth.authErrors` 中添加英文翻译
2. 在 `libs/i18n/locales/zh-CN.ts` 的 `auth.authErrors` 中添加中文翻译
3. 错误代码会自动被 `getAuthErrorMessage` 函数识别

### 设计原则

- **简约设计**：只为常见的认证错误提供国际化，避免过度设计
- **原生集成**：直接使用各框架现有的 i18n 系统，无需额外函数
- **类型安全**：利用 TypeScript 确保错误代码的类型安全
- **回退机制**：未知错误代码会回退到通用错误消息
- **可扩展性**：支持未来添加更多语言，不硬编码语言类型

## 使用方法

### 服务端

```typescript
import { auth } from '@libs/auth';
import { toNextJsHandler } from "better-auth/next-js";

// Next.js API 路由处理
export const { GET, POST } = auth.createHandler(
  toNextJsHandler()
);
```

### 客户端（React）

```typescript
import { authClientReact } from '@libs/auth/authClient';

// 在组件中使用
const { signIn, signOut, user } = authClientReact.useAuth();

// 邮箱密码登录
await signIn.emailAndPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 社交登录
await signIn.socialProvider('google');

// 退出登录
await signOut();

// 获取当前会话
const { data: session } = await authClientReact.getSession();

// 响应式会话访问
const { data: session } = authClientReact.useSession();

// 会话管理
const sessions = await authClientReact.listSessions(); // 获取所有会话
await authClientReact.revokeSession({ token: "session-token" }); // 撤销指定会话
await authClientReact.revokeOtherSessions(); // 撤销其他会话
await authClientReact.revokeSessions(); // 撤销所有会话

// 密码管理
await authClientReact.changePassword({
  newPassword: 'newPassword123',
  currentPassword: 'currentPassword123',
  revokeOtherSessions: true // 更改密码时撤销其他会话
});

// 用户信息管理
await authClientReact.updateUser({
  name: '新名称',
  image: 'https://example.com/avatar.jpg'
});

// 获取关联账户
const accountsResponse = await authClientReact.listAccounts();

// 删除用户账户
await authClientReact.deleteUser({});
```

### 客户端（Vue）

```typescript
import { authClientVue } from '@libs/auth/authClient';

// 在组件中使用
const { signIn, signOut, user } = authClientVue.useAuth();

// 邮箱密码登录
await signIn.emailAndPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 社交登录
await signIn.socialProvider('google');

// 退出登录
await signOut();
```

## 高级功能

### 会话管理
Better Auth 提供完整的会话管理功能，包括会话缓存、会话刷新、会话撤销等。

**相关文档：**
- [会话管理](https://www.better-auth.com/docs/concepts/session-management)
- [会话缓存](https://www.better-auth.com/docs/concepts/session-management#session-caching)

### 用户和账户管理
支持用户信息更新、密码管理、账户删除等功能。

**相关文档：**
- [用户和账户管理](https://www.better-auth.com/docs/concepts/users-accounts)
- [更改密码](https://www.better-auth.com/docs/concepts/users-accounts#change-password)
- [删除用户](https://www.better-auth.com/docs/concepts/users-accounts#delete-user)

### 邮箱验证
支持邮箱验证功能，可配置自动登录和验证要求。

**相关文档：**
- [邮箱验证](https://www.better-auth.com/docs/authentication/email-verification)

### 权限控制
基于角色的访问控制系统，支持管理员权限和自定义角色。

**相关文档：**
- [管理员插件](https://www.better-auth.com/docs/plugins/admin)
- [角色和权限](https://www.better-auth.com/docs/concepts/roles-permissions)

### 速率限制
保护 API 端点免受滥用，限制用户在指定时间内的请求次数。

**相关文档：**
- [速率限制](https://www.better-auth.com/docs/concepts/rate-limiting)

### 自定义插件
Better Auth 支持自定义插件开发，可以扩展认证功能。

**相关文档：**
- [插件开发](https://www.better-auth.com/docs/plugins/custom-plugin)
- [插件 API](https://www.better-auth.com/docs/plugins/plugin-api)

## 数据库模型

认证服务使用 Drizzle ORM，包含以下数据表：
- `user`: 用户基本信息
- `account`: 关联的社交账号信息
- `session`: 用户会话信息
- `verification`: 验证记录（如邮箱验证、手机验证等）

## 插件系统

服务使用了以下 Better Auth 插件：
- `admin`: 提供管理员角色和权限控制
- `phoneNumber`: 提供手机号码验证功能
- `validator`: 提供输入验证功能
- 自定义的 `wechat` 插件：提供微信登录功能

## 更多文档

- [Better Auth 官方文档](https://www.better-auth.com/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team/docs/overview)
- [微信开放平台文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html) 