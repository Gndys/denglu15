# 应用框架测试安装流程

本文档详细记录了在 ShipEasy SaaS 模板的 Monorepo 中安装和测试 Next.js 与 Nuxt.js 应用的步骤。

## 0. 前置条件

### 0.1 Node.js 要求

确保你的系统已安装 Node.js 18.0.0 或更高版本。可以使用以下命令检查：

```bash
node --version
```

### 0.2 安装 pnpm

pnpm 需要全局安装。我们推荐使用 npm 来全局安装 pnpm：

```bash
# 全局安装 pnpm
npm install -g pnpm@8.6.0

# 验证安装
pnpm --version  # 应该显示 8.6.0 或更高版本
```

注意：虽然我们在 package.json 中指定了 `"packageManager": "pnpm@8.6.0"`，但这只是声明项目使用的包管理器版本，并不会自动安装 pnpm。你需要确保全局安装了正确版本的 pnpm。

## 1. Next.js 应用安装

### 1.1 创建 Next.js 应用

在 apps/next-app 目录中创建新的 Next.js 应用：

```bash
# 确保在项目根目录
cd apps/next-app

# 创建基础 Next.js 应用
pnpm create next-app . --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm
```

在安装过程中，当询问是否使用 Turbopack 时：
```bash
Would you like to use Turbopack for `next dev`? ... No / Yes
```
建议选择 "No"。原因如下：
- Turbopack 目前仍处于 beta 阶段
- 与我们使用的 Turborepo（monorepo 工具）没有直接关系
- 使用稳定的 Webpack 开发服务器可以避免潜在的兼容性问题
- 后续可以随时通过 `next.config.js` 启用 Turbopack

注意：Turbopack（Next.js 的打包工具）和 Turborepo（我们的 monorepo 管理工具）是两个独立的工具，服务于不同的目的。选择不使用 Turbopack 不会影响我们的 monorepo 设置。

### 1.2 调整 Next.js 配置

#### 1.2.1 配置继承设置

由于我们在根目录已经设置了 TypeScript 和 ESLint 配置，需要调整 Next.js 应用的配置以继承这些设置：

1. 修改 apps/next-app/tsconfig.json：
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

2. 修改 apps/next-app/.eslintrc.js：
```js
module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Next.js 特定的规则可以在这里添加
  },
}
```

#### 1.2.2 修改 package.json

修改 apps/next-app/package.json：

```json
{
  "name": "@shipeasy/next-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf .next && rm -rf node_modules"
  }
}
```

## 2. Nuxt.js 应用安装

### 2.1 创建 Nuxt.js 应用

在 apps/nuxt-app 目录中创建新的 Nuxt.js 应用：

```bash
# 确保在项目根目录
cd apps/nuxt-app

# 使用 create-nuxt-app 创建应用
pnpm create nuxt @shipeasy/nuxt-app
```

### 2.2 调整 Nuxt.js 配置

修改 apps/nuxt-app/package.json：

```json
{
  "name": "@shipeasy/nuxt-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "nuxt dev --port 3001",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "clean": "rm -rf .nuxt && rm -rf .output && rm -rf node_modules"
  }
}
```

## 3. 工作空间配置调整

### 3.1 更新根目录 package.json

在根目录的 package.json 中添加新的脚本：

```json
{
  "scripts": {
    "dev:next": "turbo run dev --filter=@shipeasy/next-app",
    "dev:nuxt": "turbo run dev --filter=@shipeasy/nuxt-app",
    "build:next": "turbo run build --filter=@shipeasy/next-app",
    "build:nuxt": "turbo run build --filter=@shipeasy/nuxt-app"
  }
}
```

### 3.2 更新 turbo.json

确保 turbo.json 包含正确的配置：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".nuxt/**", ".output/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## 4. 测试步骤

### 4.1 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

### 4.2 测试 Next.js 应用

```bash
# 启动 Next.js 开发服务器
pnpm dev:next

# 测试构建
pnpm build:next
```

访问 http://localhost:3000 验证 Next.js 应用是否正常运行。

### 4.3 测试 Nuxt.js 应用

```bash
# 启动 Nuxt.js 开发服务器
pnpm dev:nuxt

# 测试构建
pnpm build:nuxt
```

访问 http://localhost:3001 验证 Nuxt.js 应用是否正常运行。

## 5. 验证检查清单

确保完成以下检查项：

- [ ] Next.js 开发服务器能够正常启动
- [ ] Next.js 应用能够正常构建
- [ ] Next.js 应用能在浏览器中访问
- [ ] Nuxt.js 开发服务器能够正常启动
- [ ] Nuxt.js 应用能够正常构建
- [ ] Nuxt.js 应用能在浏览器中访问
- [ ] 两个应用都能够并行运行
- [ ] 构建命令能够正常工作
- [ ] 清理命令能够正常工作

## 6. 常见问题解决

### 6.1 端口冲突

如果遇到端口冲突，可以通过修改各应用的开发脚本中的端口号来解决：

- Next.js: 默认使用 3000 端口
- Nuxt.js: 默认使用 3001 端口

### 6.2 依赖问题

如果遇到依赖相关问题，可以尝试以下步骤：

1. 清理所有 node_modules：
```bash
pnpm clean
```

2. 清理 pnpm store：
```bash
pnpm store prune
```

3. 重新安装依赖：
```bash
pnpm install
```

### 6.3 构建问题

如果构建失败，检查以下几点：

1. Node.js 版本是否符合要求（>=18.0.0）
2. pnpm 版本是否正确（>=8.6.0）
3. 是否有未解决的依赖冲突
4. 检查构建日志中的具体错误信息

## 7. 下一步

完成框架测试安装后，可以进行以下工作：

1. 添加共享 UI 组件库的依赖
2. 配置共享的 TypeScript 类型
3. 设置共享的环境变量
4. 添加必要的开发工具配置
5. 开始实现具体的业务功能

记得在进行下一步之前，确保两个框架的基础安装都能正常工作，这样可以避免在后续开发中遇到基础架构问题。 