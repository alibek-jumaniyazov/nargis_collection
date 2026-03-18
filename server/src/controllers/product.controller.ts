import { type Request, type Response } from 'express';
import prisma from '../config/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      gender, 
      sort, 
      isFeatured, 
      isNewArrival, 
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = { isPublished: true };

    if (category) {
      where.category = { slug: category as string };
    }
    if (gender) {
      // If collection is not unisex, and gender matches
      where.category = {
        ...where.category,
        OR: [
          { gender: gender as string },
          { gender: 'unisex' }
        ]
      };
    }
    if (isFeatured === 'true') where.isFeatured = true;
    if (isNewArrival === 'true') where.isNewArrival = true;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (Number(page) - 1) * Number(limit);

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
    ]);

    // Transform products to match the structure expected by frontend
    const transformedProducts = products.map((p: any) => {
      // Extract unique colors and sizes from variants correctly
      const sizesObj = new Map();
      const colorsSet = new Set<string>();

      p.variants.forEach((v: any) => {
        colorsSet.add(v.color);
        if (!sizesObj.has(v.size)) {
           sizesObj.set(v.size, { size: v.size, stock: v.stock, sku: v.sku });
        } else {
           // Aggregate stock if multiple colors have same size
           const existing = sizesObj.get(v.size);
           sizesObj.set(v.size, { ...existing, stock: existing.stock + v.stock });
        }
      });

      return {
        ...p,
        tags: p.tags ? p.tags.split(',').filter(Boolean) : [],
        colors: Array.from(colorsSet),
        sizes: Array.from(sizesObj.values()),
        images: p.images.map((img: any) => img.url),
      };
    });

    res.json({
      data: transformedProducts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Related products (same category)
    const relatedProducts = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isPublished: true },
      take: 4,
      include: {
        category: true,
        images: true,
        variants: true,
      }
    });

    const sizesMap = new Map();
    const colorsSet = new Set<string>();

    const transformedProduct = {
      ...product,
      tags: product.tags ? product.tags.split(',').filter(Boolean) : [],
      colors: Array.from(colorsSet),
      sizes: Array.from(sizesMap.values()),
      images: product.images.map((img: any) => img.url),
    };

    const transformedRelated = relatedProducts.map((p: any) => {
      const pSizesMap = new Map();
      const pColorsSet = new Set<string>();
      p.variants.forEach((v: any) => {
        pColorsSet.add(v.color);
        if (!pSizesMap.has(v.size)) {
          pSizesMap.set(v.size, { size: v.size, stock: v.stock, sku: v.sku });
        } else {
          const existing = pSizesMap.get(v.size);
          pSizesMap.set(v.size, { ...existing, stock: existing.stock + v.stock });
        }
      });
      return {
        ...p,
        tags: p.tags ? p.tags.split(',').filter(Boolean) : [],
        colors: Array.from(pColorsSet),
        sizes: Array.from(pSizesMap.values()),
        images: p.images.map((img: any) => img.url),
      }
    });

    res.json({
      ...transformedProduct,
      relatedProducts: transformedRelated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin route
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, slug, description, shortDescription, price, salePrice, 
      coverImage, isFeatured, isNewArrival, categoryId, variants, images,
      gender, collection, tags, rating, reviewCount
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product slug already exists' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        coverImage,
        gender: gender || 'unisex',
        collection: collection || null,
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
        rating: rating ? Number(rating) : 5.0,
        reviewCount: reviewCount ? Number(reviewCount) : 0,
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        categoryId,
        images: {
          create: images?.map((url: string, index: number) => ({ url, sortOrder: index })) || []
        },
        variants: {
          create: variants || [] // {size, color, stock, sku}
        }
      },
      include: {
        images: true,
        variants: true,
        category: true
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin route
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, slug, description, shortDescription, price, salePrice, 
      coverImage, isFeatured, isNewArrival, isPublished, categoryId, 
      variants, images, gender, collection, tags, rating, reviewCount
    } = req.body;

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    // Update basic details
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        coverImage,
        gender: gender || existing.gender,
        collection: collection === undefined ? existing.collection : collection,
        tags: Array.isArray(tags) ? tags.join(',') : (tags === undefined ? existing.tags : tags),
        rating: rating ? Number(rating) : existing.rating,
        reviewCount: reviewCount !== undefined ? Number(reviewCount) : existing.reviewCount,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : existing.isNewArrival,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        categoryId,
      }
    });

    // Handle images (replace all)
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({ url, sortOrder: index, productId: id }))
      });
    }

    // Handle variants (replace all)
    if (variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: variants.map((v: any) => ({ ...v, productId: id }))
      });
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, category: true }
    });

    res.json(finalProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Route
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
