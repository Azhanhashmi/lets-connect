import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Prisma error shape without depending on un-exported types
interface PrismaKnownError extends Error {
  code: string;
  meta?: { target?: string[] };
}

function isPrismaKnownError(err: unknown): err is PrismaKnownError {
  return (
    err instanceof Error &&
    'code' in err &&
    typeof (err as PrismaKnownError).code === 'string' &&
    (err as PrismaKnownError).code.startsWith('P')
  );
}

function isPrismaValidationError(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.constructor.name === 'PrismaClientValidationError'
  );
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof TokenExpiredError) {
    res.status(401).json({ success: false, message: 'Token has expired' });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }

  if (isPrismaKnownError(err)) {
    switch (err.code) {
      case 'P2002': {
        const field = err.meta?.target?.join(', ') ?? 'field';
        res.status(409).json({ success: false, message: `${field} already exists` });
        return;
      }
      case 'P2025':
        res.status(404).json({ success: false, message: 'Record not found' });
        return;
      case 'P2003':
        res.status(400).json({ success: false, message: 'Related record not found' });
        return;
      default:
        res.status(400).json({ success: false, message: 'Database error' });
        return;
    }
  }

  if (isPrismaValidationError(err)) {
    res.status(400).json({ success: false, message: 'Invalid data provided' });
    return;
  }

  if (err.message?.includes('Only JPEG') || err.message?.includes('File too large')) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
};
