import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/uploadImage';

interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  interests?: string[];
  lookingFor?: string;
  instagramLink?: string;
  websiteLink?: string;
}

export const profileService = {
  async getByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        questions: {
          where: { answer: { not: null } },
          orderBy: { createdAt: 'desc' },
        },
        compliments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) throw new NotFoundError('Profile');
    return profile;
  },

  async update(userId: string, input: UpdateProfileInput) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Profile');

    return prisma.profile.update({
      where: { userId },
      data: {
        ...input,
        // Store empty strings as null for optional link fields
        instagramLink: input.instagramLink || null,
        websiteLink: input.websiteLink || null,
      },
    });
  },

  async uploadAvatar(userId: string, buffer: Buffer) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Profile');

    // Delete old avatar from Cloudinary if it exists
    if (profile.avatar) {
      try {
        const publicId = extractPublicId(profile.avatar);
        await deleteFromCloudinary(publicId);
      } catch (error) {
  console.error(error);
  throw error;
}
      
    }

    const result = await uploadToCloudinary(buffer, 'avatars');

    const updated = await prisma.profile.update({
      where: { userId },
      data: { avatar: result.secure_url },
    });

    return { avatar: updated.avatar };
  },

  async getOwnProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundError('Profile');
    return profile;
  },

  async ensureOwnsProfile(userId: string, profileId: string): Promise<void> {
    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundError('Profile');
    if (profile.userId !== userId) throw new ForbiddenError('Not your profile');
  },
};
