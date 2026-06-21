import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { notificationService } from './notification.service';

export const messageService = {
  async getConversations(userId: string) {
    const connections = await prisma.connection.findMany({
      where: { OR: [{ userOneId: userId }, { userTwoId: userId }] },
      include: {
        conversation: {
          include: {
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
        userOne: {
          include: { profile: { select: { id: true, username: true, displayName: true, avatar: true } } },
        },
        userTwo: {
          include: { profile: { select: { id: true, username: true, displayName: true, avatar: true } } },
        },
      },
    });

    type ConnWithConv = typeof connections[number];

    return connections
      .filter((conn: ConnWithConv) => conn.conversation !== null)
      .map((conn: ConnWithConv) => {
        const other = conn.userOneId === userId ? conn.userTwo : conn.userOne;
        const lastMessage = conn.conversation!.messages[0] ?? null;
        return {
          id: conn.conversation!.id,
          createdAt: conn.conversation!.createdAt,
          participant: other.profile,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                read: lastMessage.read,
                isOwn: lastMessage.senderId === userId,
              }
            : null,
        };
      })
      .sort((a: { lastMessage: { createdAt: Date } | null; createdAt: Date }, b: { lastMessage: { createdAt: Date } | null; createdAt: Date }) => {
        const aTime = a.lastMessage?.createdAt ?? a.createdAt;
        const bTime = b.lastMessage?.createdAt ?? b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  },

  async getMessages(conversationId: string, userId: string) {
    await this._verifyAccess(conversationId, userId);

    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, read: false },
      data: { read: true },
    });

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          include: { profile: { select: { username: true, displayName: true, avatar: true } } },
        },
      },
    });
  },

  async send(conversationId: string, senderId: string, content: string) {
    await this._verifyAccess(conversationId, senderId);

    const message = await prisma.message.create({
      data: { conversationId, senderId, content },
      include: {
        sender: {
          include: { profile: { select: { username: true, displayName: true, avatar: true } } },
        },
      },
    });

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { connection: { include: { userOne: true, userTwo: true } } },
    });

    if (conversation) {
      const conn = conversation.connection;
      const recipientId = conn.userOneId === senderId ? conn.userTwoId : conn.userOneId;
      await notificationService.create(
        recipientId,
        'NEW_MESSAGE',
        `${message.sender.profile?.displayName ?? 'Someone'} sent you a message`
      );
    }

    return message;
  },

  async _verifyAccess(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { connection: true },
    });

    if (!conversation) throw new NotFoundError('Conversation');

    const { userOneId, userTwoId } = conversation.connection;
    if (userOneId !== userId && userTwoId !== userId) {
      throw new ForbiddenError('Not a participant in this conversation');
    }

    return conversation;
  },
};
