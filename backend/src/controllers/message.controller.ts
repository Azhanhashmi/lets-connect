import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { messageService } from '../services/message.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const messageController = {
  async getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversations = await messageService.getConversations(req.user!.id);
      sendSuccess(res, conversations);
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await messageService.getMessages(req.params.conversationId, req.user!.id);
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async send(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conversationId, content } = req.body;
      const message = await messageService.send(conversationId, req.user!.id, content);
      sendCreated(res, message, 'Message sent');
    } catch (error) {
      next(error);
    }
  },
};
