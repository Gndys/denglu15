# ShipEasy Email Module

这个模块使用 MJML 来创建响应式电子邮件模板，并提供了发送这些模板的通用函数。支持多种邮件服务提供商，可以根据需要进行配置。

## MJML 预览

在开发新的电子邮件模板或修改现有模板时，可以使用 MJML 官方提供的在线预览工具来实时查看邮件的渲染效果：

[MJML 在线预览工具](https://mjml.io/try-it-live/)

只需将 `.mjml` 文件中的代码复制到左侧编辑器中，右侧即可实时显示渲染后的邮件效果，支持移动和桌面视图的切换。

## 使用示例

### 发送验证邮件（支持国际化和多种邮件服务提供商）

```typescript
import { sendVerificationEmail } from '@libs/email';

// 在用户注册/请求重置密码后调用
async function handleUserRegistration(user: User) {
  const verificationToken = generateVerificationToken(); // 自定义函数
  const verificationUrl = `https://your-app.com/verify?token=${verificationToken}`;

  try {
    // 根据用户偏好设置选择语言，默认为英文
    const locale = user.preferredLanguage || 'en'; // 可选值: 'en', 'zh-CN'
    
    await sendVerificationEmail(user.email, {
      name: user.name,
      verification_url: verificationUrl,
      expiry_hours: 24,
      locale // 传入语言选项
    }, {
      // 可选配置
      from: 'custom@example.com', // 自定义发件人
      provider: 'resend', // 指定发送服务提供商，默认为 'resend'
      cc: 'admin@example.com', // 可选抄送
      bcc: ['archive@example.com'], // 可选密送
      replyTo: 'support@example.com' // 可选回复地址
    });
    
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}
```

### 发送重置密码邮件

```typescript
import { sendResetPasswordEmail } from '@libs/email';

// 在用户请求重置密码后调用
async function handlePasswordReset(user: User) {
  const resetToken = generateResetToken(); // 自定义函数
  const resetUrl = `https://your-app.com/reset-password?token=${resetToken}`;

  try {
    // 根据用户偏好设置选择语言，默认为英文
    const locale = user.preferredLanguage || 'en'; // 可选值: 'en', 'zh-CN'
    
    await sendResetPasswordEmail(user.email, {
      name: user.name,
      reset_url: resetUrl,
      expiry_hours: 24,
      locale // 传入语言选项
    }, {
      // 可选配置
      from: 'security@example.com', // 自定义发件人
      provider: 'resend', // 指定发送服务提供商，默认为 'resend'
      replyTo: 'support@example.com' // 可选回复地址
    });
    
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}
```

### 在 Next.js API 路由中使用

```typescript
// pages/api/auth/register.ts
import { sendVerificationEmail } from '@libs/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, name, locale = 'en' } = req.body;
    // 创建用户、生成token等...
    
    await sendVerificationEmail(email, {
      name,
      verification_url: `https://your-app.com/verify?token=your-token`,
      expiry_hours: 24,
      locale // 从请求中获取语言设置
    }, {
      // 可以在不同环境中使用不同的邮件服务
      provider: process.env.NODE_ENV === 'production' ? 'resend' : 'smtp'
    });
    
    return res.status(200).json({ message: '验证邮件已发送' });
  } catch (error) {
    return res.status(500).json({ message: '发送邮件失败', error: error.message });
  }
}
```

### 在 Nuxt 服务器路由中使用

```typescript
// server/api/auth/register.ts
import { sendVerificationEmail } from '@libs/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, name, locale = 'en' } = body;
  
  try {
    // 创建用户、生成token等...
    
    await sendVerificationEmail(email, {
      name,
      verification_url: `https://your-app.com/verify?token=your-token`,
      expiry_hours: 24,
      locale // 从请求中获取语言设置
    });
    
    return { message: '验证邮件已发送' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: '发送邮件失败',
      data: error
    });
  }
});
```

## 支持的邮件服务提供商

目前模块支持以下邮件服务提供商：

- **Resend** (`provider: 'resend'`) - 默认服务提供商
- **SendGrid** (`provider: 'sendgrid'`) - 即将支持
- **Mailchimp** (`provider: 'mailchimp'`) - 即将支持
- **SMTP** (`provider: 'smtp'`) - 即将支持

你可以通过配置 `provider` 参数来选择使用哪个服务提供商。添加新的提供商只需要实现对应的发送函数并更新 `sendEmail` 方法。

## 支持的语言

目前模板支持以下语言：
- 英文 (`en`)
- 简体中文 (`zh-CN`)

可以通过在参数中添加 `locale` 属性来指定使用哪种语言。

## 添加新模板

1. 在 `templates/` 目录下创建新的 MJML 模板文件 (例如 `welcome.mjml`)
2. 在 `i18n/locales/types.ts` 添加新的翻译类型定义
3. 在 `i18n/locales/en.ts` 和 `i18n/locales/zh-CN.ts` 添加对应翻译
4. 在 `templates/index.ts` 中添加新的接口和生成函数
5. 在 `templates-sender.ts` 中添加发送新模板的辅助函数
6. 使用 [MJML 在线预览工具](https://mjml.io/try-it-live/) 测试你的模板效果

## 添加新的邮件服务提供商

1. 创建新的服务提供商文件 (例如 `sendgrid.ts`)
2. 实现发送接口，确保兼容 `ShipEasyEmailOptions` 类型
3. 在 `templates-sender.ts` 中更新 `EmailProvider` 类型和 `sendEmail` 函数

## 环境变量

根据选择的邮件服务提供商，需要设置相应的环境变量：

### Resend
```
RESEND_API_KEY=your_resend_api_key
```

### SendGrid (即将支持)
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 其他提供商
根据具体的提供商配置相应的环境变量。 