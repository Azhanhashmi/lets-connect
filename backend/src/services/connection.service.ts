import prisma from '../config/prisma';

export const connectionService = {
  async getConnections(userId: string) {
    const connections = await prisma.connection.findMany({
      where: { OR: [{ userOneId: userId }, { userTwoId: userId }] },
      orderBy: { createdAt: 'desc' },
      include: {
        userOne: {
          include: { profile: { select: { id: true, username: true, displayName: true, avatar: true, bio: true } } },
        },
        userTwo: {
          include: { profile: { select: { id: true, username: true, displayName: true, avatar: true, bio: true } } },
        },
        conversation: { select: { id: true } },
      },
    });

    type Conn = typeof connections[number];

    return connections.map((conn: Conn) => {
      const other = conn.userOneId === userId ? conn.userTwo : conn.userOne;
      return {
        id: conn.id,
        createdAt: conn.createdAt,
        conversationId: conn.conversation?.id ?? null,
        user: other.profile,
      };
    });
  },
};
