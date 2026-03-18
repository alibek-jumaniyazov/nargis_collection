import { type Request, type Response } from 'express';
import prisma from '../config/prisma';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: req.query.isActive === 'true' ? { isActive: true } : undefined,
    });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, isActive } = req.body;
    
    const banner = await prisma.banner.create({
      data: { title, subtitle, image, buttonText, buttonLink, isActive }
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image, buttonText, buttonLink, isActive } = req.body;
    
    const banner = await prisma.banner.update({
      where: { id },
      data: { title, subtitle, image, buttonText, buttonLink, isActive }
    });

    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
