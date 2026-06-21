import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { signToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/AppError';

interface RegisterInput {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const { email, password, username, displayName } = input;

    // Check uniqueness
    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.profile.findUnique({ where: { username } }),
    ]);

    if (existingEmail) throw new ConflictError('Email already in use');
    if (existingUsername) throw new ConflictError('Username already taken');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            username,
            displayName,
          },
        },
      },
      include: {
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    const token = signToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified,
        profile: user.profile,
      },
    };
  },

  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const token = signToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified,
        profile: user.profile,
      },
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        verified: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            bio: true,
            interests: true,
            lookingFor: true,
            instagramLink: true,
            websiteLink: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedError('User not found');
    return user;
  },
};
