import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { connectionService } from '../services/connection.service';
import { sendSuccess } from '../utils/response';

export const connectionController = {
  async getConnections(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const connections = await connectionService.getConnections(req.user!.id);
      sendSuccess(res, connections);
    } catch (error) {
      next(error);
    }
  },
};
