import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/prisma';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

interface TypingPayload {
  conversationId: string;
}

/**
 * Authenticate each socket connection via JWT passed as handshake auth token.
 * Client usage:
 *   const socket = io(SERVER_URL, { auth: { token: 'Bearer <jwt>' } });
 */
const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const token =
      (socket.handshake.auth?.token as string | undefined) ||
      (socket.handshake.headers?.authorization as string | undefined);

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
    const payload = verifyToken(raw);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { profile: { select: { username: true } } },
    });

    if (!user) return next(new Error('User not found'));

    socket.userId = user.id;
    socket.username = user.profile?.username ?? user.email;
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
};

export const initSocket = (io: Server): void => {
  // Apply auth middleware to every connecting socket
  io.use(authenticateSocket);

  io.on('connection', (rawSocket: Socket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const userId = socket.userId!;

    console.log(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

    // Join a personal room so we can push targeted notifications
    socket.join(`user:${userId}`);

    // ─── send_message ─────────────────────────────────────────────────────────
    socket.on('send_message', async (payload: SendMessagePayload) => {
      try {
        const { conversationId, content } = payload;

        if (!conversationId || !content?.trim()) {
          socket.emit('error', { message: 'conversationId and content are required' });
          return;
        }

        // Verify the socket owner participates in this conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { connection: true },
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const { userOneId, userTwoId } = conversation.connection;
        if (userOneId !== userId && userTwoId !== userId) {
          socket.emit('error', { message: 'Not a participant in this conversation' });
          return;
        }

        const recipientId = userOneId === userId ? userTwoId : userOneId;

        // Persist to database
        const message = await prisma.message.create({
          data: { conversationId, senderId: userId, content: content.trim() },
          include: {
            sender: {
              include: {
                profile: { select: { username: true, displayName: true, avatar: true } },
              },
            },
          },
        });

        const outgoing = {
          id: message.id,
          conversationId: message.conversationId,
          content: message.content,
          read: message.read,
          createdAt: message.createdAt,
          sender: message.sender.profile,
        };

        // Emit to sender (confirmation) and recipient
        socket.emit('receive_message', outgoing);
        io.to(`user:${recipientId}`).emit('receive_message', outgoing);

        // Real-time notification to recipient
        const notification = await prisma.notification.create({
          data: {
            userId: recipientId,
            type: 'NEW_MESSAGE',
            message: `${message.sender.profile?.displayName ?? 'Someone'} sent you a message`,
          },
        });

        io.to(`user:${recipientId}`).emit('notification', notification);
      } catch (err) {
        console.error('send_message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ─── typing ───────────────────────────────────────────────────────────────
    socket.on('typing', async (payload: TypingPayload) => {
      try {
        const { conversationId } = payload;
        if (!conversationId) return;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { connection: true },
        });

        if (!conversation) return;

        const { userOneId, userTwoId } = conversation.connection;
        if (userOneId !== userId && userTwoId !== userId) return;

        const recipientId = userOneId === userId ? userTwoId : userOneId;

        io.to(`user:${recipientId}`).emit('typing', {
          conversationId,
          userId,
          username: socket.username,
        });
      } catch (err) {
        console.error('typing error:', err);
      }
    });

    // ─── stop_typing ──────────────────────────────────────────────────────────
    socket.on('stop_typing', async (payload: TypingPayload) => {
      try {
        const { conversationId } = payload;
        if (!conversationId) return;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { connection: true },
        });

        if (!conversation) return;

        const { userOneId, userTwoId } = conversation.connection;
        if (userOneId !== userId && userTwoId !== userId) return;

        const recipientId = userOneId === userId ? userTwoId : userOneId;

        io.to(`user:${recipientId}`).emit('stop_typing', {
          conversationId,
          userId,
        });
      } catch (err) {
        console.error('stop_typing error:', err);
      }
    });

    // ─── disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} — ${reason}`);
    });

    // ─── error ────────────────────────────────────────────────────────────────
    socket.on('error', (err) => {
      console.error(`Socket error (${socket.id}):`, err.message);
    });
  });
};
