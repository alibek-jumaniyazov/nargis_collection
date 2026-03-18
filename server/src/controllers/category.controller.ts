import { type Request, type Response } from 'express';
import prisma from '../config/prisma';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    // In our existing frontend, mockCategories includes an `image` manually,
    // but the DB schema does not have an image field. We can omit it or add it to DB later.
    // For now, let's just return what DB has. 
    // Wait, the frontend mock uses `image` for categories on the homepage grid.
    // Let's modify the response to return a hardcoded/unsplash image based on slug if it doesn't exist,
    // Or we should update the Prisma schema to add `image` to Category.
    // Let's add `image` dynamically for now or depend on the frontend.
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, gender } = req.body;
    
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }

    const category = await prisma.category.create({
      data: { name, slug, gender },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, gender } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, gender },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
