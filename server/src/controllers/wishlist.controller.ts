import { type Request, type Response } from 'express';
import prisma from '../config/prisma';

export const getWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true, images: true, variants: true }
        }
      }
    });

    const transformedProducts = wishlistItems.map((item: any) => {
      const p = item.product;
      const sizesMap = new Map();
      const colorsSet = new Set<string>();

      p.variants.forEach((v: any) => {
        colorsSet.add(v.color);
        if (!sizesMap.has(v.size)) {
           sizesMap.set(v.size, { size: v.size, stock: v.stock, sku: v.sku });
        } else {
           const existing = sizesMap.get(v.size);
           sizesMap.set(v.size, { ...existing, stock: existing.stock + v.stock });
        }
      });

      return {
        ...p,
        colors: Array.from(colorsSet),
        sizes: Array.from(sizesMap.values()),
        images: p.images.map((img: any) => img.url),
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      return res.json({ message: 'Product already in wishlist', isWishlisted: true });
    }

    await prisma.wishlist.create({ data: { userId, productId } });
    res.status(201).json({ message: 'Added to wishlist', isWishlisted: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    await prisma.wishlist.delete({ where: { id: existing.id } });
    res.json({ message: 'Removed from wishlist', isWishlisted: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
