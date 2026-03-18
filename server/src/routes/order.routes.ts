import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getDashboardAnalytics } from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

// To allow guest checkout, we might normally not require authenticate for createOrder, but let's assume they can either be logged in or guest. 
// If they are a guest, they shouldn't hit authenticate unless we inject it carefully or have an optional auth middleware.
// For now, let's use a weak auth middleware or extract logic for createOrder to not strictly require auth if we want guest checkouts.
// The user prompt says "auth flow: customer auth for storefront". We'll let createOrder be public but check for token internally.

const router = Router();

// Guest/User
router.post('/', (req, res, next) => {
  // Optional auth hack to gather user data if token exists, strictly we could write an optionalAuth middleware.
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    authenticate(req as any, res, next);
  } else {
    next();
  }
}, createOrder);

// User
router.get('/my-orders', authenticate, getUserOrders);

// Admin
router.get('/analytics', authenticate, requireAdmin, getDashboardAnalytics);
router.get('/all', authenticate, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
