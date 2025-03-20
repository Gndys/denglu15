# Monorepo 架构搭建流程

本文档详细记录了 ShipEasy SaaS 模板中 Monorepo 架构的搭建流程和关键步骤。

## 1. Git 仓库初始化

Git 仓库已经初始化完成。如果需要在新环境中初始化，可以使用以下命令：

```bash
git init
```

## 2. 基础文件设置

### 2.1 添加 .gitignore 文件

创建一个全面的 .gitignore 文件，确保不会将敏感信息、依赖项和构建产物提交到代码库中：

```bash
# 创建 .gitignore 文件
touch .gitignore
```

.gitignore 文件内容应包括：

```
# 依赖目录
node_modules
.pnpm-store/

# 构建输出
dist
.next
.nuxt
build
out

# 环境变量文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# 日志
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 编辑器和IDE配置
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# 操作系统相关
.DS_Store
Thumbs.db

# 测试覆盖率
coverage

# Turbo
.turbo

# Vercel
.vercel

# Netlify
.netlify

# Docker相关
docker-volumes/

# 临时文件
.tmp
.temp
```

### 2.2 添加 .npmrc 文件

创建 .npmrc 文件以配置 npm 行为，这对于 monorepo 环境尤其重要：

```bash
touch .npmrc
```

.npmrc 文件内容：

```
registry=https://registry.npmjs.org/
save-exact=true
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true
```

### 2.3 添加 .editorconfig 文件

添加 .editorconfig 文件确保跨编辑器的代码风格一致性：

```bash
touch .editorconfig
```

.editorconfig 文件内容：

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## 3. 配置 pnpm 工作空间

### 3.1 安装 pnpm (如果尚未安装)

```bash
npm install -g pnpm
```

### 3.2 创建 pnpm-workspace.yaml

添加 pnpm 工作空间配置文件，定义 monorepo 的包结构：

```bash
touch pnpm-workspace.yaml
```

pnpm-workspace.yaml 内容：

```yaml
packages:
  # 所有 apps 目录下的应用
  - 'apps/*'
  # 所有 packages 目录下的共享包
  - 'packages/*'
  # 排除所有 packages 目录下的包中的 node_modules 和 dist 目录
  - '!**/node_modules'
  - '!**/dist'
```

### 3.3 创建包配置文件

创建根目录 package.json 文件：

```bash
touch package.json
```

package.json 内容：

```json
{
  "name": "shipeasy",
  "version": "0.0.1",
  "private": true,
  "description": "ShipEasy SaaS Template - A comprehensive monorepo for building subscription-based web applications",
  "engines": {
    "node": ">=18.0.0"
  },
  "packageManager": "pnpm@8.6.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md,js,jsx,vue}\""
  },
  "keywords": [
    "saas",
    "subscription",
    "next.js",
    "nuxt.js",
    "monorepo"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^20.10.5",
    "prettier": "^3.1.1",
    "turbo": "^1.11.2",
    "typescript": "^5.3.3"
  }
}
```

## 4. 创建基本目录结构

```bash
# 创建主要目录
mkdir -p apps/next-app apps/nuxt-app packages/ui packages/database packages/config packages/core packages/auth
```

## 5. 配置 TypeScript

### 5.1 创建基础 tsconfig.json

创建根目录 TypeScript 配置：

```bash
touch tsconfig.json
```

tsconfig.json 内容：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  },
  "exclude": ["node_modules"]
}
```

### 5.2 创建 packages 配置

创建共享包基础配置：

```bash
touch packages/tsconfig.json
```

packages/tsconfig.json 内容：

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true
  },
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
```

## 6. 配置 ESLint


### 6.1 创建 ESLint 配置

```bash
touch .eslintrc.js
```

.eslintrc.js 内容：

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    },
  ],
};
```

## 7. 配置 Turborepo

Turborepo 将帮助我们高效地管理 monorepo 的构建和依赖关系。

### 7.1 创建 turbo.json

```bash
touch turbo.json
```

turbo.json 内容：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".nuxt/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

## 8. 初始化所有包的 package.json

为每个包创建基本的 package.json 文件：

```bash
# 示例：为 packages/ui 创建 package.json
cat > packages/ui/package.json << EOF
{
  "name": "@shipeasy/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist && rm -rf node_modules"
  },
  "dependencies": {},
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF
```

对其他包执行类似操作，根据各自的功能调整依赖项。

## 9. README.md 和文档

创建根目录 README.md 文件：

```bash
touch README.md
```

README.md 内容：

```markdown
# ShipEasy

ShipEasy 是一个基于 monorepo 的 SaaS 模板，提供构建基于订阅的 Web 应用程序的全面基础。它包括用户管理、身份验证、付款处理和管理功能。该模板同时使用 Next.js 和 Nuxt.js 框架实现，以根据开发者偏好提供灵活性。

## 特点

- 用户认证（电子邮件/密码 + OAuth 提供商）
- 基于角色的授权
- 订阅管理和付款处理
- 管理仪表板
- 多租户支持
- API 服务
- 组织管理与团队权限
- 跨框架的共享后端逻辑
- 跨框架实现的一致 UI/UX

## 开发

### 前提条件

- Node.js >= 18
- pnpm >= 8.6.0

### 设置

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

## 项目结构

```
shipeasy/
├── apps/                     # 应用程序
│   ├── next-app/             # Next.js 实现
│   └── nuxt-app/             # Nuxt.js 实现
├── packages/                 # 共享包
│   ├── auth/                 # 认证功能
│   ├── config/               # 共享配置
│   ├── core/                 # 核心业务逻辑
│   ├── database/             # 数据库模型和迁移
│   └── ui/                   # UI 组件和设计系统
└── docs/                     # 文档
```

## 许可证

MIT
```

## 10. 安装依赖并初始化

完成配置后，运行以下命令安装所有依赖并初始化项目：

```bash
pnpm install
```

## 11. 提交更改

将所有更改提交到 Git 仓库：

```bash
git add .
git commit -m "Initial monorepo setup with pnpm workspaces and turborepo"
```

至此，基本的 monorepo 架构搭建已完成，接下来可以开始开发各个包和应用程序。 