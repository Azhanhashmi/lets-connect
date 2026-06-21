import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { notificationService } from './notification.service';

interface CreateComplimentInput {
  profileId: string;
  content: string;
  anonymous: boolean;
}

export const complimentService = {
  async create(_senderId: string, input: CreateComplimentInput) {
    const { profileId, content, anonymous } = input;

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true, displayName: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    const compliment = await prisma.compliment.create({
      data: { profileId, content, anonymous },
    });

    await notificationService.create(
      profile.userId,
      'NEW_COMPLIMENT',
      anonymous ? 'You received an anonymous compliment!' : 'Someone left you a compliment!'
    );

    return compliment;
  },

  async getByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    return prisma.compliment.findMany({
      where: { profileId: profile.id, approved: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async approve(complimentId: string, userId: string) {
    const compliment = await prisma.compliment.findUnique({
      where: { id: complimentId },
      include: { profile: { select: { userId: true } } },
    });

    if (!compliment) throw new NotFoundError('Compliment');
    if (compliment.profile.userId !== userId) throw new ForbiddenError('Not your profile');

    return prisma.compliment.update({ where: { id: complimentId }, data: { approved: true } });
  },

  async delete(complimentId: string, userId: string) {
    const compliment = await prisma.compliment.findUnique({
      where: { id: complimentId },
      include: { profile: { select: { userId: true } } },
    });

    if (!compliment) throw new NotFoundError('Compliment');
    if (compliment.profile.userId !== userId) throw new ForbiddenError('Not your profile');

    await prisma.compliment.delete({ where: { id: complimentId } });
  },
};
