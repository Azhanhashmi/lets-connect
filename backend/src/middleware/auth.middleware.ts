import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/AppError';
import prisma from '../config/prisma';

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    next(error);
  }
};
