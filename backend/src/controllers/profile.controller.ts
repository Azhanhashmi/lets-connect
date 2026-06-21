import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { profileService } from '../services/profile.service';
import { sendSuccess } from '../utils/response';
import { ValidationError } from '../utils/AppError';

export const profileController = {
  async getByUsername(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;
      const profile = await profileService.getByUsername(username);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.update(req.user!.id, req.body);
      sendSuccess(res, profile, 'Profile updated');
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new ValidationError('No image file provided');
      const result = await profileService.uploadAvatar(req.user!.id, req.file.buffer);
      sendSuccess(res, result, 'Avatar updated');
    } catch (error) {
      next(error);
    }
  },
};
