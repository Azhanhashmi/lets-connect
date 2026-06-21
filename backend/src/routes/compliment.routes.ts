import { Router } from 'express';
import { complimentController } from '../controllers/compliment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createComplimentSchema, idParamSchema, usernameParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

/**
 * @route   POST /api/compliments
 * @body    { profileId, content, anonymous? }
 * @desc    Send a compliment to a profile
 * @access  Private
 */
router.post('/', validate(createComplimentSchema), complimentController.create);

/**
 * @route   GET /api/compliments/:username
 * @desc    Get all approved compliments for a profile
 * @access  Private
 */
router.get('/:username', validate(usernameParamSchema), complimentController.getByUsername);

/**
 * @route   PATCH /api/compliments/:id/approve
 * @desc    Approve a compliment (profile owner only)
 * @access  Private
 */
router.patch('/:id/approve', validate(idParamSchema), complimentController.approve);

/**
 * @route   DELETE /api/compliments/:id
 * @desc    Delete a compliment (profile owner only)
 * @access  Private
 */
router.delete('/:id', validate(idParamSchema), complimentController.delete);

export default router;
