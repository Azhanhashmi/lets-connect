import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { complimentService } from '../services/compliment.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const complimentController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { profileId, content, anonymous } = req.body;
      const compliment = await complimentService.create(req.user!.id, {
        profileId,
        content,
        anonymous: anonymous ?? true,
      });
      sendCreated(res, compliment, 'Compliment sent');
    } catch (error) {
      next(error);
    }
  },

  async getByUsername(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const compliments = await complimentService.getByUsername(req.params.username);
      sendSuccess(res, compliments);
    } catch (error) {
      next(error);
    }
  },

  async approve(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const compliment = await complimentService.approve(req.params.id, req.user!.id);
      sendSuccess(res, compliment, 'Compliment approved');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await complimentService.delete(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Compliment deleted');
    } catch (error) {
      next(error);
    }
  },
};
