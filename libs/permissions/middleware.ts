import { Action, AppUser, Subject } from './types';
import { can, mapDatabaseRoleToAppRole } from './utils';

/**
 * 通用权限检查函数
 * 可用于任何框架的中间件或路由处理器
 */
export function checkPermission(
  user: AppUser | null | undefined,
  action: Action,
  subject: Subject,
  data?: any
): boolean {
  if (!user) return false;
  return can(user, action, subject, data);
}

/**
 * 将数据库用户转换为带有角色的AppUser
 */
export function createAppUser(user: any, defaultRole = 'normal'): AppUser {
  if (!user) return null as unknown as AppUser;

  return {
    ...user,
    role: mapDatabaseRoleToAppRole(user.role || defaultRole)
  };
}
