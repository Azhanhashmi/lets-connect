import { Router } from 'express';
import { questionController } from '../controllers/question.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createQuestionSchema,
  answerQuestionSchema,
  idParamSchema,
  usernameParamSchema,
} from '../validators/schemas';

const router = Router();

router.use(authenticate);

/**
 * @route   POST /api/questions
 * @body    { profileId, question }
 * @desc    Ask someone a question
 * @access  Private
 */
router.post('/', validate(createQuestionSchema), questionController.create);

/**
 * @route   POST /api/questions/:id/answer
 * @body    { answer }
 * @desc    Answer a question on your own profile
 * @access  Private
 */
router.post('/:id/answer', validate(answerQuestionSchema), questionController.answer);

/**
 * @route   GET /api/questions/:username
 * @desc    Get all answered questions for a profile
 * @access  Private
 */
router.get('/:username', validate(usernameParamSchema), questionController.getByUsername);

export default router;
