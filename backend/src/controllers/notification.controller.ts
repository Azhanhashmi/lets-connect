import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export const notificationController = {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await notificationService.getAll(req.user!.id);
      sendSuccess(res, notifications);
    } catch (error) {
      next(error);
    }
  },

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.markRead(req.params.id, req.user!.id);
      sendSuccess(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  },
};
