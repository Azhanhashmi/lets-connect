import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';

type NotificationType =
  | 'CONNECT_REQUEST'
  | 'REQUEST_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'NEW_COMPLIMENT'
  | 'NEW_QUESTION'
  | 'QUESTION_ANSWERED';

export const notificationService = {
  async create(userId: string, type: NotificationType, message: string) {
    return prisma.notification.create({
      data: { userId, type, message },
    });
  },

  async getAll(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async markRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundError('Notification');
    if (notification.userId !== userId) throw new ForbiddenError('Not your notification');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },
};
