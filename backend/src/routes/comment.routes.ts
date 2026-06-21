import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCommentSchema, idParamSchema, usernameParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/profile/:username/comments
 * @desc    Get all approved comments for a profile
 * @access  Private
 */
router.get('/:username/comments', validate(usernameParamSchema), commentController.getByUsername);

/**
 * @route   POST /api/profile/:username/comments
 * @desc    Submit a comment on a profile (defaults to unapproved)
 * @access  Private
 */
router.post(
  '/:username/comments',
  validate(usernameParamSchema),
  validate(createCommentSchema),
  commentController.create
);

/**
 * @route   PATCH /api/comments/:id/approve
 * @desc    Approve a comment (profile owner only)
 * @access  Private
 */
router.patch('/comments/:id/approve', validate(idParamSchema), commentController.approve);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment (profile owner only)
 * @access  Private
 */
router.delete('/comments/:id', validate(idParamSchema), commentController.delete);

export default router;