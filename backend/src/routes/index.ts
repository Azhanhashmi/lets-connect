import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import requestRoutes from './request.routes';
import connectionRoutes from './connection.routes';
import messageRoutes from './message.routes';
import complimentRoutes from './compliment.routes';
import questionRoutes from './question.routes';
import notificationRoutes from './notification.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/profile', commentRoutes);
router.use('/requests', requestRoutes);
router.use('/connections', connectionRoutes);
router.use('/messages', messageRoutes);
router.use('/compliments', complimentRoutes);
router.use('/questions', questionRoutes);
router.use('/notifications', notificationRoutes);

export default router;