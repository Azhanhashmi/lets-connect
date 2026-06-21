import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendMessageSchema, conversationIdParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations with last message preview
 * @access  Private
 */
router.get('/conversations', messageController.getConversations);

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get all messages in a conversation (marks unread as read)
 * @access  Private
 */
router.get(
  '/:conversationId',
  validate(conversationIdParamSchema),
  messageController.getMessages
);

/**
 * @route   POST /api/messages
 * @body    { conversationId: string, content: string }
 * @desc    Send a message in a conversation
 * @access  Private
 */
router.post('/', validate(sendMessageSchema), messageController.send);

export default router;
