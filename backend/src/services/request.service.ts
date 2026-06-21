import prisma from '../config/prisma';
import { NotFoundError, ConflictError, ForbiddenError, ValidationError } from '../utils/AppError';
import { notificationService } from './notification.service';

export const requestService = {
  async send(senderId: string, receiverId: string, message?: string) {
    if (senderId === receiverId) {
      throw new ValidationError('Cannot send a connect request to yourself');
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: { profile: { select: { displayName: true } } },
    });
    if (!receiver) throw new NotFoundError('User');

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      include: { profile: { select: { displayName: true, username: true } } },
    });
    if (!sender) throw new NotFoundError('User');

    const existing = await prisma.connectRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    if (existing) throw new ConflictError('A connect request already exists between these users');

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { userOneId: senderId, userTwoId: receiverId },
          { userOneId: receiverId, userTwoId: senderId },
        ],
      },
    });
    if (connection) throw new ConflictError('Already connected');

    const request = await prisma.connectRequest.create({
      data: { senderId, receiverId, message },
    });

    await notificationService.create(
      receiverId,
      'CONNECT_REQUEST',
      `${sender.profile?.displayName ?? 'Someone'} sent you a connect request`
    );

    return request;
  },

  async getPending(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { interests: true },
    });
    const myInterests: string[] = profile?.interests ?? [];

    const requests = await prisma.connectRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          include: {
            profile: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                interests: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    type Req = typeof requests[number];
    return requests.map((req: Req) => {
      const senderInterests: string[] = req.sender.profile?.interests ?? [];
      const sharedInterests = myInterests.filter((i: string) => senderInterests.includes(i));
      return {
        id: req.id,
        message: req.message,
        createdAt: req.createdAt,
        sender: req.sender.profile,
        sharedInterests,
      };
    });
  },

  async accept(requestId: string, userId: string) {
    const request = await prisma.connectRequest.findUnique({
      where: { id: requestId },
      include: {
        receiver: { include: { profile: { select: { displayName: true } } } },
      },
    });

    if (!request) throw new NotFoundError('Connect request');
    if (request.receiverId !== userId) throw new ForbiddenError('Not your request');
    if (request.status !== 'PENDING') throw new ValidationError('Request is no longer pending');

    const [updatedRequest, connection] = await prisma.$transaction([
      prisma.connectRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } }),
      prisma.connection.create({ data: { userOneId: request.senderId, userTwoId: request.receiverId } }),
    ]);

    await prisma.conversation.create({ data: { connectionId: connection.id } });

    await notificationService.create(
      request.senderId,
      'REQUEST_ACCEPTED',
      `${request.receiver.profile?.displayName ?? 'Someone'} accepted your connect request`
    );

    return { request: updatedRequest, connection };
  },

  async pass(requestId: string, userId: string) {
    await this._getRequestForReceiver(requestId, userId);
    return prisma.connectRequest.update({ where: { id: requestId }, data: { status: 'PASSED' } });
  },

  async later(requestId: string, userId: string) {
    await this._getRequestForReceiver(requestId, userId);
    return prisma.connectRequest.update({ where: { id: requestId }, data: { status: 'LATER' } });
  },

  async getLater(userId: string) {
    return prisma.connectRequest.findMany({
      where: { receiverId: userId, status: 'LATER' },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          include: {
            profile: {
              select: {
                id: true, username: true, displayName: true,
                avatar: true, bio: true, interests: true,
              },
            },
          },
        },
      },
    });
  },

  async _getRequestForReceiver(requestId: string, userId: string) {
    const request = await prisma.connectRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError('Connect request');
    if (request.receiverId !== userId) throw new ForbiddenError('Not your request');
    if (request.status !== 'PENDING') throw new ValidationError('Request is no longer pending');
    return request;
  },
};

