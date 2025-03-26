import { z } from 'zod';
import { userRoles } from '../database/schema/user';

// 基础用户验证器
export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().url().nullable().optional(),
  role: z.enum([userRoles.ADMIN, userRoles.USER]).default(userRoles.USER),
  provider: z.string().optional(),
  providerId: z.string().optional(),
  phoneNumber: z.string().nullable().optional(),
  phoneNumberVerified: z.boolean().default(false),
});

// 邮箱注册验证器
export const emailSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

// 邮箱登录验证器
export const emailSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// 手机号注册验证器 手机号登录验证器
export const phoneSignUpSchema = z.object({
  phoneNumber: z.string().min(11).max(11),
  code: z.string().length(6),
});

// 更新用户验证器 - 所有字段都是可选的
export const updateUserSchema = userSchema.partial();

// 用户ID验证器
export const userIdSchema = z.object({
  id: z.string().min(1),
}); 