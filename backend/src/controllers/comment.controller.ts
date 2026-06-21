import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { commentService } from '../services/comment.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const commentController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;
      const { content } = req.body;
      const comment = await commentService.create(username, { content });
      sendCreated(res, comment, 'Comment submitted for approval');
    } catch (error) {
      next(error);
    }
  },

  async getByUsername(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await commentService.getApprovedByUsername(req.params.username);
      sendSuccess(res, comments);
    } catch (error) {
      next(error);
    }
  },

  async approve(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.approve(req.params.id, req.user!.id);
      sendSuccess(res, comment, 'Comment approved');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await commentService.delete(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Comment deleted');
    } catch (error) {
      next(error);
    }
  },
};