import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, usernameParamSchema } from '../validators/schemas';
import { upload } from '../utils/multer';

const router = Router();

/**
 * @route   GET /api/profile/:username
 * @desc    Get a public profile by username
 * @access  Private
 */
router.get(
  '/:username',
  authenticate,
  validate(usernameParamSchema),
  profileController.getByUsername
);

/**
 * @route   PUT /api/profile
 * @desc    Update the authenticated user's profile
 * @access  Private
 */
router.put('/', authenticate, validate(updateProfileSchema), profileController.update);

/**
 * @route   POST /api/profile/avatar
 * @desc    Upload/replace profile avatar via Cloudinary
 * @access  Private
 */
router.post('/avatar', authenticate, upload.single('avatar'), profileController.uploadAvatar);

export default router;
