import { Router } from 'express';
import * as AuthController from '@/controllers/auth.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { authorize } from '@/middleware/rbac.js';

const router = Router();

router.get('/profile', authenticate, AuthController.getProfile);
router.post('/logout', authenticate, AuthController.logout);
router.get('/admin-only', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'Welcome, Admin' });
});

export default router;
