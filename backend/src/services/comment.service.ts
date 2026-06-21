import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { notificationService } from './notification.service';

interface CreateCommentInput {
  content: string;
}

export const commentService = {
  async create(username: string, input: CreateCommentInput) {
    const { content } = input;

    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true, userId: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    const comment = await prisma.comment.create({
      data: { profileId: profile.id, content },
    });

    await notificationService.create(
      profile.userId,
      'NEW_COMMENT',
      'Someone left a comment on your profile!'
    );

    return comment;
  },

  async getApprovedByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!profile) throw new NotFoundError('Profile');

    return prisma.comment.findMany({
      where: { profileId: profile.id, approved: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async approve(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { profile: { select: { userId: true } } },
    });

    if (!comment) throw new NotFoundError('Comment');
    if (comment.profile.userId !== userId) throw new ForbiddenError('Not your profile');

    return prisma.comment.update({
      where: { id: commentId },
      data: { approved: true },
    });
  },

  async delete(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { profile: { select: { userId: true } } },
    });

    if (!comment) throw new NotFoundError('Comment');
    if (comment.profile.userId !== userId) throw new ForbiddenError('Not your profile');

    await prisma.comment.delete({ where: { id: commentId } });
  },
};