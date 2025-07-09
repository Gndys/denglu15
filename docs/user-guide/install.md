# 安装指南

本指南将帮助你在本地环境中设置和运行 TinyShip 项目。

## 📋 系统要求

在开始之前，请确保你的开发环境满足以下要求：

### 必需软件
- **Node.js**: >= 18.0.0 （推荐使用 LTS 版本）
- **PNPM**: >= 8.0.0 （推荐的包管理器）
- **PostgreSQL**: >= 13.0 （数据库）


## 🚀 快速安装

### 1. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/your-repo/tinyship.git
cd tinyship

# 或者使用 SSH
git clone git@github.com:your-repo/tinyship.git
cd tinyship
```

### 2. 安装 PNPM（如果尚未安装）

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用 corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

### 3. 安装项目依赖

```bash
# 安装所有依赖
pnpm install

# 验证安装
pnpm --version
```

### 4. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env
```

下一步 [数据库配置指南](./database.md)

如果遇到其他问题，请查看 [常见问题文档](./faq.md) 或在 [GitHub Issues](https://github.com/your-repo/tinyship/issues) 中提交问题。
