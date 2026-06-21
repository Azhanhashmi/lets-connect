import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, username, displayName } = req.body;
      const result = await authService.register({ email, password, username, displayName });
      sendCreated(res, result, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      sendSuccess(res, result, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },
};
