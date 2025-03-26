import { describe, expect, it } from 'vitest';
import {
  userSchema,
  emailSignUpSchema,
  phoneSignUpSchema,
  updateUserSchema,
  userIdSchema,
} from '@libs/validators/user';
import { userRoles } from '@libs/database/schema/user';

describe('User Validators', () => {
  describe('userSchema', () => {
    it('should validate a valid user', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: false,
        role: userRoles.USER,
        phoneNumber: '13800138000',
        phoneNumberVerified: false,
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        emailVerified: false,
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should fail with too short name', () => {
      const invalidUser = {
        name: 'J',
        email: 'john@example.com',
        emailVerified: false,
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('emailSignUpSchema', () => {
    it('should validate valid email signup', () => {
      const validSignup = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = emailSignUpSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it('should fail with short password', () => {
      const invalidSignup = {
        email: 'test@example.com',
        password: '12345',
      };

      const result = emailSignUpSchema.safeParse(invalidSignup);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid email', () => {
      const invalidSignup = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = emailSignUpSchema.safeParse(invalidSignup);
      expect(result.success).toBe(false);
    });
  });

  describe('phoneSignUpSchema', () => {
    it('should validate valid phone signup', () => {
      const validSignup = {
        phoneNumber: '13800138000',
        code: '123456',
      };

      const result = phoneSignUpSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid phone number length', () => {
      const invalidSignup = {
        phoneNumber: '138001380',  // 少一位
        code: '123456',
      };

      const result = phoneSignUpSchema.safeParse(invalidSignup);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid code length', () => {
      const invalidSignup = {
        phoneNumber: '13800138000',
        code: '12345',  // 少一位
      };

      const result = phoneSignUpSchema.safeParse(invalidSignup);
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        name: 'New Name',
      };

      const result = updateUserSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate field types when provided', () => {
      const invalidUpdate = {
        email: 'invalid-email',
      };

      const result = updateUserSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('userIdSchema', () => {
    it('should validate valid id', () => {
      const validId = {
        id: '123',
      };

      const result = userIdSchema.safeParse(validId);
      expect(result.success).toBe(true);
    });

    it('should fail with empty id', () => {
      const invalidId = {
        id: '',
      };

      const result = userIdSchema.safeParse(invalidId);
      expect(result.success).toBe(false);
    });
  });
}); 