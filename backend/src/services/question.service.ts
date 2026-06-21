import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { notificationService } from './notification.service';

interface CreateQuestionInput {
  profileId: string;
  question: string;
}

export const questionService = {
  async create(_askerId: string, input: CreateQuestionInput) {
    const { profileId, question } = input;

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    const created = await prisma.question.create({ data: { profileId, question } });

    await notificationService.create(profile.userId, 'NEW_QUESTION', 'Someone asked you a question!');

    return created;
  },

  async answer(questionId: string, userId: string, answer: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { profile: { select: { userId: true } } },
    });

    if (!question) throw new NotFoundError('Question');
    if (question.profile.userId !== userId) throw new ForbiddenError('Not your profile');

    return prisma.question.update({ where: { id: questionId }, data: { answer } });
  },

  async getByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    return prisma.question.findMany({
      where: { profileId: profile.id, answer: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
  },
};
