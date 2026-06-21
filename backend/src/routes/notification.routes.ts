import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { idParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/notifications
 * @desc    Get latest 50 notifications for the authenticated user
 * @access  Private
 */
router.get('/', notificationController.getAll);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.patch('/:id/read', validate(idParamSchema), notificationController.markRead);

export default router;
