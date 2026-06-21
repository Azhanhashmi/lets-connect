import { Router } from 'express';
import { requestController } from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendRequestSchema, idParamSchema } from '../validators/schemas';

const router = Router();

// All routes require auth
router.use(authenticate);

/**
 * @route   POST /api/requests/send
 * @body    { receiverId: string, message?: string }
 * @desc    Send a connect request to another user
 * @access  Private
 */
router.post('/send', validate(sendRequestSchema), requestController.send);

/**
 * @route   GET /api/requests/pending
 * @desc    Get all pending connect requests for the current user
 * @access  Private
 */
router.get('/pending', requestController.getPending);

/**
 * @route   GET /api/requests/later
 * @desc    Get all requests saved for later
 * @access  Private
 */
router.get('/later', requestController.getLater);

/**
 * @route   POST /api/requests/accept/:id
 * @desc    Accept a pending connect request (creates Connection + Conversation)
 * @access  Private
 */
router.post('/accept/:id', validate(idParamSchema), requestController.accept);

/**
 * @route   POST /api/requests/pass/:id
 * @desc    Pass on a connect request
 * @access  Private
 */
router.post('/pass/:id', validate(idParamSchema), requestController.pass);

/**
 * @route   POST /api/requests/later/:id
 * @desc    Save a connect request for later
 * @access  Private
 */
router.post('/later/:id', validate(idParamSchema), requestController.later);

export default router;
