import { type Request, type Response } from 'express';
import prisma from '../config/prisma';
import { sendTelegramNotification, formatOrderMessage } from '../utils/telegram';

export const createOrder = async (req: any, res: Response) => {
  try {
    const { 
      items, // array of { productId, variantId, quantity, name, image, price, size, color }
      shippingMethod, 
      paymentMethod, 
      fullName, 
      phone, 
      city, 
      district, 
      addressLine, 
      zipCode 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Calculate totals
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const shippingFee = shippingMethod === 'express' ? 25 : (subtotal > 200 ? 0 : 15);
    const total = subtotal + shippingFee;

    const orderData: any = {
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      fullName,
      phone,
      city,
      district,
      addressLine,
      zipCode,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))
      }
    };

    if (req.user) {
      orderData.userId = req.user.id;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: true
      }
    });

    // Handle inventory deduction
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.updateMany({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    // Telegram Notification
    try {
      const message = formatOrderMessage(order, items);
      await sendTelegramNotification(message);
    } catch (telegramError) {
      // Do not fail the order response if telegram fails
      console.error('Telegram notification error:', telegramError);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserOrders = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Route
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50 // simplistic pagination for admin, could be improved
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Route
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Route
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['delivered', 'shipped', 'confirmed'] } }
    });
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProducts = await prisma.product.count({ where: { isPublished: true } });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Low stock products
    const lowStockVariants = await prisma.productVariant.findMany({
      where: { stock: { lt: 5 } },
      include: { product: { select: { name: true } } },
      take: 10
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalCustomers,
      totalProducts,
      recentOrders,
      lowStockVariants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
