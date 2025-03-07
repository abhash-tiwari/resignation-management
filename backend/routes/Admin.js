import express from 'express'
import { authenticateToken, isHR } from '../middleware/auth.js'
import { 
  getResignations, 
  concludeResignation, 
  getExitResponses 
} from '../controllers/admin.js'

const router = express.Router()

router.get('/resignations', authenticateToken, isHR, getResignations)
router.put('/conclude_resignation', authenticateToken, isHR, concludeResignation)
router.get('/exit_responses', authenticateToken, isHR, getExitResponses)

export default router 