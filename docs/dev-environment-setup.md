# 开发环境配置指南（极简方案）

本文档详细说明了 ShipEasy SaaS 模板的开发环境配置步骤，采用极简方案，不使用 Docker，而是直接使用本地数据库或云服务。

## 1. 概述

### 1.1 极简方案的优势

- 减少系统依赖，降低环境复杂度
- 避免 Docker 相关配置和性能问题
- 快速上手，特别适合前端开发者
- 更低的系统资源需求
- 利用云服务减少本地维护负担

### 1.2 方案选择

我们提供两种方案：
1. **本地数据库方案**：在本地安装 PostgreSQL 和 Redis
2. **云服务方案**：使用 Supabase 作为数据库和认证服务，使用 Upstash 或 Redis Labs 作为 Redis 服务

## 2. 先决条件

### 2.1 Node.js 环境

确保已安装 Node.js 18.0.0 或更高版本：

```bash
node --version
```

### 2.2 包管理器

项目使用 pnpm 作为包管理器：

```bash
# 全局安装 pnpm
npm install -g pnpm@8.6.0

# 验证安装
pnpm --version  # 应该显示 8.6.0 或更高版本
```

## 3. 本地数据库方案

### 3.1 PostgreSQL 安装和配置

#### macOS (使用 Homebrew)

```bash
# 安装 PostgreSQL
brew install postgresql@15

# 启动 PostgreSQL 服务
brew services start postgresql@15

# 添加 PostgreSQL 命令到 PATH（如果需要）
# Intel Mac
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
# Apple Silicon Mac (M1/M2/M3)
# echo 'export PATH="/opt/homebrew/Cellar/postgresql@15/15.12_1/bin:$PATH"' >> ~/.zshrc
# 或者更通用的方法，适用于版本更新
# echo 'export PATH="$(brew --prefix)/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc

# 或者如果使用 bash
# Intel Mac
# echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.bash_profile
# Apple Silicon Mac (M1/M2/M3)
# echo 'export PATH="/opt/homebrew/Cellar/postgresql@15/15.12_1/bin:$PATH"' >> ~/.bash_profile
# 或者更通用的方法，适用于版本更新
# echo 'export PATH="$(brew --prefix)/opt/postgresql@15/bin:$PATH"' >> ~/.bash_profile

# 应用更改
source ~/.zshrc  # 或 source ~/.bash_profile

# 创建数据库
# 方式一：使用 Homebrew 安装的 PostgreSQL 用户名
psql -d postgres -c "CREATE DATABASE shipeasy_dev;"

# 方式二：如果遇到连接问题，可以尝试指定主机
psql -h localhost -U $(whoami) -d postgres -c "CREATE DATABASE shipeasy_dev;"

# 方式三：直接使用完整路径访问 psql
# Intel Mac
/usr/local/opt/postgresql@15/bin/psql -d postgres -c "CREATE DATABASE shipeasy_dev;"
# Apple Silicon Mac (M1/M2/M3)
# /opt/homebrew/Cellar/postgresql@15/15.12_1/bin/psql -d postgres -c "CREATE DATABASE shipeasy_dev;"
# 或者也可以使用符号链接位置
# /opt/homebrew/opt/postgresql@15/bin/psql -d postgres -c "CREATE DATABASE shipeasy_dev;"
```

#### Windows

1. 从 [PostgreSQL 官网](https://www.postgresql.org/download/windows/) 下载并安装 PostgreSQL 15
2. 安装过程中设置管理员密码
3. 使用 pgAdmin 或命令行创建数据库：
   ```bash
   # 使用 psql 命令行工具
   psql -U postgres -c "CREATE DATABASE shipeasy_dev;"
   
   # 或者使用 pgAdmin 图形界面工具创建数据库
   ```

#### Linux (Ubuntu/Debian)

```bash
# 添加 PostgreSQL 仓库
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# 更新包列表并安装 PostgreSQL
sudo apt-get update
sudo apt-get install postgresql-15

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres psql -c "CREATE DATABASE shipeasy_dev;"
```

### 3.2 Redis 安装和配置

#### macOS (使用 Homebrew)

```bash
# 安装 Redis
brew install redis

# 启动 Redis 服务
brew services start redis
```

#### Windows

1. 从 [Redis for Windows](https://github.com/tporadowski/redis/releases) 下载并安装 Redis
2. 双击 redis-server.exe 启动 Redis 服务器

#### Linux (Ubuntu/Debian)

```bash
# 安装 Redis
sudo apt-get install redis-server

# 启动服务
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3.3 验证数据库连接

```bash
# 测试 PostgreSQL 连接
# 如果 psql 在 PATH 中
psql -d shipeasy_dev -c "SELECT 'PostgreSQL 连接成功!' AS message;"

# 如果 psql 不在 PATH 中 (Intel Mac)
/usr/local/opt/postgresql@15/bin/psql -d shipeasy_dev -c "SELECT 'PostgreSQL 连接成功!' AS message;"

# 如果 psql 不在 PATH 中 (Apple Silicon Mac - M1/M2/M3)
# 实际安装路径
# /opt/homebrew/Cellar/postgresql@15/15.12_1/bin/psql -d shipeasy_dev -c "SELECT 'PostgreSQL 连接成功!' AS message;"
# 或使用符号链接路径
# /opt/homebrew/opt/postgresql@15/bin/psql -d shipeasy_dev -c "SELECT 'PostgreSQL 连接成功!' AS message;"

# 测试 Redis 连接
redis-cli ping  # 应返回 PONG
# 如果 redis-cli 不在 PATH 中 (Intel Mac)
# /usr/local/opt/redis/bin/redis-cli ping
# 如果 redis-cli 不在 PATH 中 (Apple Silicon Mac - M1/M2/M3)
# 实际安装路径可能类似
# /opt/homebrew/Cellar/redis/7.2.x/bin/redis-cli ping
# 或使用符号链接路径
# /opt/homebrew/opt/redis/bin/redis-cli ping
```

## 4. 云服务方案

### 4.1 Supabase 设置

[Supabase](https://supabase.com/) 提供 PostgreSQL 数据库、认证和存储服务。

#### 4.1.1 创建 Supabase 项目

1. 注册/登录 [Supabase](https://app.supabase.com/)
2. 点击 "New Project"
3. 填写项目名称，选择区域，设置数据库密码
4. 点击 "Create new project"
5. 等待项目创建完成 (约 2-3 分钟)

#### 4.1.2 获取连接信息

1. 在项目控制台中，导航至 "Settings" > "API"
2. 复制 "URL" 和 "anon" 密钥
3. 为了安全，使用项目的 "Service Role" 密钥进行数据库迁移

#### 4.1.3 设置数据库表和策略

1. 导航至 "Table Editor" 创建所需表格
2. 或者，使用 "SQL Editor" 导入初始架构
3. 导航至 "Authentication" 配置认证提供商

### 4.2 Redis 云服务设置

可以选择以下任一 Redis 云服务：

#### 4.2.1 Upstash

[Upstash](https://upstash.com/) 提供按请求付费的 Redis 服务，非常适合开发和小型项目。

1. 注册/登录 [Upstash](https://console.upstash.com/)
2. 创建新的 Redis 数据库
3. 选择全球分布式或区域性数据库
4. 复制连接字符串和密码

#### 4.2.2 Redis Cloud

[Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/) 提供更强大的 Redis 托管服务。

1. 注册/登录 [Redis Cloud](https://app.redislabs.com/)
2. 创建新数据库
3. 选择免费计划或付费计划
4. 复制连接信息

## 5. 环境变量配置

### 5.1 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
touch .env
```

### 5.2 配置数据库连接

#### 本地数据库方案

```
# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/shipeasy_dev

# Redis
REDIS_URL=redis://localhost:6379
```

#### 云服务方案

```
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Upstash/Redis Cloud
REDIS_URL=redis://username:password@host:port
```

### 5.3 其他环境变量

```
# 应用配置
NODE_ENV=development
APP_URL=http://localhost:3000

# 认证
JWT_SECRET=your-jwt-secret

# 电子邮件 (可选)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

## 6. 环境变量共享与安全

### 6.1 环境变量管理

1. 创建 `.env.example` 文件作为模板，不包含敏感值
2. 确保 `.env` 已添加到 `.gitignore`
3. 考虑使用 [dotenv-vault](https://www.dotenv.org/docs/security/env-vault) 等工具同步环境变量

### 6.2 不同环境的配置

为不同环境创建配置文件：

- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

## 7. 工作空间配置

### 7.1 配置 Next.js 应用

为 Next.js 应用创建环境变量配置：

```bash
cp .env apps/next-app/.env.local
```

### 7.2 配置 Nuxt.js 应用

为 Nuxt.js 应用创建环境变量配置：

```bash
cp .env apps/nuxt-app/.env
```

## 8. 验证开发环境

### 8.1 验证数据库连接

创建一个简单的测试脚本来验证数据库连接：

```bash
# 创建测试脚本
touch scripts/test-db-connection.js

# 运行测试脚本
node scripts/test-db-connection.js
```

### 8.2 验证 Redis 连接

```bash
# 创建测试脚本
touch scripts/test-redis-connection.js

# 运行测试脚本
node scripts/test-redis-connection.js
```

## 9. 常见问题解决

### 9.1 数据库连接问题

- 确保数据库服务正在运行
- 验证连接字符串格式
- 检查用户权限
- 确认防火墙设置

### 9.2 Redis 连接问题

- 验证 Redis 服务是否运行
- 检查连接 URL 格式
- 确认没有密码错误

### 9.3 环境变量问题

- 确保环境变量文件位于正确位置
- 检查变量名称拼写
- 确认各应用程序已正确加载变量

## 10. 下一步

完成开发环境配置后，可以进行以下工作：

1. 设置数据库架构和 ORM (Drizzle)
2. 配置认证服务
3. 设置共享 UI 组件库
4. 开始实现业务逻辑

记得在进行下一步之前，确保开发环境的所有组件都能正常工作，这样可以避免在后续开发中遇到环境配置问题。 