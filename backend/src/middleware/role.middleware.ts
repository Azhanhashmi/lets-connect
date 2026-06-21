import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ForbiddenError } from '../utils/AppError';

/**
 * Role definitions — extend this enum as new roles are introduced.
 * Currently the system has a single USER role; ADMIN and MODERATOR
 * are scaffolded here so access control is in place before the
 * database column is added.
 */
export enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

/**
 * Role hierarchy: higher index = more permissions.
 * requireRole('MODERATOR') will also pass for ADMIN.
 */
const ROLE_HIERARCHY: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN];

const getRoleLevel = (role: Role): number => ROLE_HIERARCHY.indexOf(role);

/**
 * Middleware factory. Attach `authenticate` before this in the chain.
 *
 * Usage:
 *   router.delete('/admin/users/:id', authenticate, requireRole(Role.ADMIN), deleteUser);
 */
export const requireRole = (minimumRole: Role) => {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      /**
       * TODO: Once a `role` column is added to the User model, fetch it here:
       *
       * const user = await prisma.user.findUnique({
       *   where: { id: req.user.id },
       *   select: { role: true },
       * });
       * const userRole = user?.role as Role ?? Role.USER;
       *
       * For now every authenticated user is treated as Role.USER.
       */
      const userRole: Role = Role.USER;

      if (getRoleLevel(userRole) < getRoleLevel(minimumRole)) {
        throw new ForbiddenError(
          `Access denied. Required role: ${minimumRole}, your role: ${userRole}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
