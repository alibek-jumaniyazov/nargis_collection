import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import bannerRoutes from './banner.routes';
import wishlistRoutes from './wishlist.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/banners', bannerRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
