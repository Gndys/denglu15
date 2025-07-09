# TinyShip 用户指南

🚀 一个现代化的、功能完备的 monorepo 起始套件，专为构建 SaaS 应用设计，同时支持国内和国际市场。

## 🌟 核心特性

- **双框架支持**：同时支持 Next.js (React) 和 Nuxt.js (Vue)，开发者可根据偏好选择
- **完整的身份认证**：支持邮箱密码、OAuth（Google、GitHub、微信）、手机短信登录
- **多种支付集成**：支持 Stripe、微信支付、CREEM 等主流支付平台
- **国际化支持**：内置多语言系统，轻松支持全球市场
- **RBAC 权限管理**：基于角色的访问控制，灵活的权限体系
- **AI 功能集成**：支持多种 AI 提供商，快速构建智能应用
- **类型安全**：全面的 TypeScript 支持和数据验证
- **现代化 UI**：基于 shadcn/ui 的组件库，支持多主题切换

## 🏗️ 项目架构

### Monorepo 结构
TinyShip 采用简化的 monorepo 结构，使用 `libs` 目录共享核心代码，避免复杂的 packages 配置：

```
tinyship/
├── apps/                  # 应用实现
│   ├── next-app/         # Next.js 应用
│   ├── nuxt-app/         # Nuxt.js 应用
│   └── docs/             # 文档站点
├── libs/                  # 核心库
│   ├── database/         # 数据库操作和架构
│   ├── auth/             # 身份认证服务
│   ├── email/            # 邮件服务
│   ├── sms/             # 短信服务
│   ├── payment/         # 支付服务
│   ├── ai/              # AI 集成
│   ├── i18n/            # 国际化
│   ├── permissions/      # 权限管理
│   ├── ui/              # 共享 UI 组件
│   └── validators/       # 数据验证
└── docs/                 # 项目文档
```

### 技术栈

**前端框架**
- Next.js 14 (App Router)
- Nuxt.js 3
- TypeScript
- Tailwind CSS

**后端服务**
- Drizzle ORM
- PostgreSQL
- Better Auth
- tRPC (计划中)

**部署与工具**
- Vercel / Netlify
- Docker
- PNPM 工作空间
- Turborepo (可选)

## 🚀 快速开始

* 1 [安装依赖](./install.md)
* 2 [数据库配置](./database.md)
* 3 [身份认证配置](./auth.md)
* 4 启动开发服务器

### 4. 启动开发服务器
```bash
# 启动 Next.js 应用
pnpm run dev:next

# 或启动 Nuxt.js 应用
pnpm run dev:nuxt
```

## 📚 深入了解

### 核心功能模块

- **[身份认证](./auth.md)**：完整的用户认证和授权系统
- **[数据库](./database.md)**：数据库架构和迁移管理
- **[支付集成](./payment.md)**：多平台支付解决方案
- **[权限管理](./permissions.md)**：基于角色的访问控制
- **[国际化](./i18n.md)**：多语言支持系统
- **[AI 功能](./ai.md)**：AI 服务集成和开发指南

### 开发指南

- **[开发最佳实践](./best-practices.md)**：代码规范和开发建议
- **[UI 组件库](./ui-components.md)**：组件使用和自定义指南
- **[主题系统](./themes.md)**：多主题切换和自定义
- **[数据验证](./validators.md)**：类型安全的数据验证
- **[部署指南](./deployment.md)**：生产环境部署配置

## 🤝 社区与支持

- **文档**：[完整文档](../README.md)
- **示例**：查看 `apps/` 目录下的示例应用
- **问题反馈**：[GitHub Issues](https://github.com/your-repo/tinyship/issues)

---

每个 `libs/` 目录下的库都有自己的 README 文档，包含详细的 API 说明和使用示例。本指南提供高层次的概览和设置说明，帮助你快速上手项目。