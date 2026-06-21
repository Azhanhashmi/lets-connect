import { z } from 'zod';

// Auth
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    displayName: z.string().min(1, 'Display name is required').max(50),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Profile
export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    interests: z.array(z.string().max(50)).max(20).optional(),
    lookingFor: z.string().max(200).optional(),
    instagramLink: z
      .string()
      .url('Invalid Instagram URL')
      .optional()
      .or(z.literal('')),
    websiteLink: z
      .string()
      .url('Invalid website URL')
      .optional()
      .or(z.literal('')),
  }),
});

// Connect Requests
export const sendRequestSchema = z.object({
  body: z.object({
    receiverId: z.string().cuid('Invalid receiver ID'),
    message: z.string().max(500).optional(),
  }),
});

// Messages
export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().cuid('Invalid conversation ID'),
    content: z.string().min(1, 'Message cannot be empty').max(2000),
  }),
});

// Compliments
export const createComplimentSchema = z.object({
  body: z.object({
    profileId: z.string().cuid('Invalid profile ID'),
    content: z.string().min(1, 'Compliment cannot be empty').max(500),
    anonymous: z.boolean().optional().default(true),
  }),
});

// Questions
export const createQuestionSchema = z.object({
  body: z.object({
    profileId: z.string().cuid('Invalid profile ID'),
    question: z.string().min(1, 'Question cannot be empty').max(300),
  }),
});

export const answerQuestionSchema = z.object({
  body: z.object({
    answer: z.string().min(1, 'Answer cannot be empty').max(1000),
  }),
});

// Params
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid ID'),
  }),
});

export const usernameParamSchema = z.object({
  params: z.object({
    username: z.string().min(1),
  }),
});

export const conversationIdParamSchema = z.object({
  params: z.object({
    conversationId: z.string().cuid('Invalid conversation ID'),
  }),
});
// Comments
export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(500),
  }),
});