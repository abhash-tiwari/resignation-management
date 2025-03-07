import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { submitResignation, submitExitResponses } from '../controllers/user.js'

const router = express.Router()

router.post('/resign', authenticateToken, submitResignation)

router.post('/responses', authenticateToken, submitExitResponses)

export default router;