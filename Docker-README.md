# Docker 部署快速指南

## 🚀 快速开始

### Next.js 部署

```bash
# 1. 在项目根目录构建镜像
docker build -t shipeasy-next -f apps/next-app/Dockerfile .

# 2. 运行容器
docker run -d \
  --name shipeasy-next \
  -p 7001:7001 \
  --env-file .env \
  --restart unless-stopped \
  shipeasy-next
```

### Nuxt.js 部署

```bash
# 1. 在项目根目录构建镜像
docker build -t shipeasy-nuxt -f apps/nuxt-app/Dockerfile .

# 2. 运行容器
docker run -d \
  --name shipeasy-nuxt \
  -p 7001:7001 \
  --env-file .env \
  --restart unless-stopped \
  shipeasy-nuxt
```

## ⚠️ 重要提醒

### 构建路径
- **必须在项目根目录**运行 `docker build` 命令
- 使用 `-f` 参数指定 Dockerfile 路径
- 构建上下文是项目根目录 (`.`)

### 构建依赖
Dockerfile 会自动复制这些必要的配置文件：
- `turbo.json` - Turbo 构建配置
- `config.ts` - 应用配置文件
- `tsconfig.json` - TypeScript 路径别名
- `libs/` - 共享库目录

### 跨框架兼容性
项目中的 `libs/auth/authClient.ts` 同时支持 React 和 Vue：
- Next.js 项目需要 Vue 作为 devDependency (已配置)
- 这是因为 better-auth 库会尝试导入 Vue 模块
- 在本地环境中，Vue 通过 Nuxt.js 间接提供

### 构建时环境变量
- Dockerfile 中设置 `BUILD_TIME=true` 避免构建失败
- 运行时环境变量 (如 API keys) 在构建时不是必需的
- 实际部署时仍会在运行时验证必要的环境变量

### 数据库连接
Docker 容器中**不能使用 `localhost`** 连接外部服务：

```bash
# ❌ 错误
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# ✅ 正确 (连接宿主机)
DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/db

# ✅ 正确 (连接远程数据库)
DATABASE_URL=postgresql://user:pass@your-db-server.com:5432/db
```

## 🔧 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看日志
docker logs shipeasy-next
docker logs shipeasy-nuxt

# 停止容器
docker stop shipeasy-next

# 删除容器
docker rm shipeasy-next

# 删除镜像
docker rmi shipeasy-next
```

## 📋 环境变量示例

创建 `.env` 文件：

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host.docker.internal:5432/shipeasy
BETTER_AUTH_SECRET=your-production-secret-key
BETTER_AUTH_URL=https://yourdomain.com
RESEND_API_KEY=your-resend-api-key
EMAIL_DEFAULT_FROM=noreply@yourdomain.com
``` 