import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { requestService } from '../services/request.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const requestController = {
  async send(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { receiverId, message } = req.body;
      const request = await requestService.send(req.user!.id, receiverId, message);
      sendCreated(res, request, 'Connect request sent');
    } catch (error) {
      next(error);
    }
  },

  async getPending(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await requestService.getPending(req.user!.id);
      sendSuccess(res, requests);
    } catch (error) {
      next(error);
    }
  },

  async accept(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await requestService.accept(req.params.id, req.user!.id);
      sendSuccess(res, result, 'Request accepted');
    } catch (error) {
      next(error);
    }
  },

  async pass(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await requestService.pass(req.params.id, req.user!.id);
      sendSuccess(res, result, 'Request passed');
    } catch (error) {
      next(error);
    }
  },

  async later(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await requestService.later(req.params.id, req.user!.id);
      sendSuccess(res, result, 'Request saved for later');
    } catch (error) {
      next(error);
    }
  },

  async getLater(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await requestService.getLater(req.user!.id);
      sendSuccess(res, requests);
    } catch (error) {
      next(error);
    }
  },
};
