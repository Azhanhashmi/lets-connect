import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { questionService } from '../services/question.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const questionController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { profileId, question } = req.body;
      const created = await questionService.create(req.user!.id, { profileId, question });
      sendCreated(res, created, 'Question sent');
    } catch (error) {
      next(error);
    }
  },

  async answer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await questionService.answer(
        req.params.id,
        req.user!.id,
        req.body.answer
      );
      sendSuccess(res, updated, 'Answer submitted');
    } catch (error) {
      next(error);
    }
  },

  async getByUsername(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions = await questionService.getByUsername(req.params.username);
      sendSuccess(res, questions);
    } catch (error) {
      next(error);
    }
  },
};
