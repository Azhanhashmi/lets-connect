import { Router } from 'express';
import { connectionController } from '../controllers/connection.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/connections
 * @desc    Get all connections for the authenticated user
 * @access  Private
 */
router.get('/', authenticate, connectionController.getConnections);

export default router;
