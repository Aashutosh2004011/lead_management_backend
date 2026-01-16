import { Router } from 'express';
import { getLeads, getLeadById, getAnalytics } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateQuery, validateParams } from '../middleware/validation.middleware';
import { leadQuerySchema, leadIdSchema } from '../validations/lead.validation';

const router = Router();

// All lead routes require authentication
router.use(authMiddleware);

router.get('/', validateQuery(leadQuerySchema), getLeads);
router.get('/analytics', getAnalytics);
router.get('/:id', validateParams(leadIdSchema), getLeadById);

export default router;
