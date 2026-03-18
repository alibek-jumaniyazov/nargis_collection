import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FASHION_IMAGES = [
  '1515372039744-245a8b66c1c8',
  '1593030761757-71fae45fa0e7',
  '1595777457583-95e059f581eb',
  '1550614000-4b95d4ebf075',
  '1617325983803-34e857dd5e43',
  '1483985988355-763728e1935b',
  '1512436991641-41165b4e287b',
  '1509631179647-0177331693ae',
  '1594938298728-73f2f3e2e9ce',
  '1572804013309-8af7e9c905c1'
];
const U = (query: string, w = 800, h = 1000, seed = 1) =>
  `https://images.unsplash.com/photo-${FASHION_IMAGES[seed % FASHION_IMAGES.length]}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const mockCategories = [
  {
    name: 'Women', slug: 'women', gender: 'women', image: U('women fashion elegant', 800, 1000, 10)
  },
  {
    name: 'Men', slug: 'men', gender: 'men', image: U('men fashion suit', 800, 1000, 11)
  },
  {
    name: 'Accessories', slug: 'accessories', gender: 'unisex', image: U('luxury watch jewelry', 800, 1000, 12)
  },
  {
    name: 'New Collection', slug: 'new', gender: 'unisex', image: U('fashion runway editorial', 800, 1000, 13)
  },
];

async function main() {
  console.log('Seeding database...');
  
  // Clean DB
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@nargis.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    }
  });

  // Create Categories
  const createdCategories: Record<string, string> = {};
  for (const cat of mockCategories) {
    const c = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = c.id;
  }

  // Define Products
  const mockProducts = [
    {
      name: 'Structured Blazer',
      slug: 'structured-blazer',
      description: 'A timeless structured blazer crafted from premium wool blend. Features a single-button closure and a relaxed silhouette perfect for both formal and casual occasions.',
      shortDescription: 'Premium wool blend structured blazer',
      price: 299,
      categoryId: createdCategories['women'] as string,
      coverImage: U('women blazer fashion', 800, 1000, 1),
      gender: 'women',
      collection: 'Spring 2025',
      tags: 'blazer,formal,women',
      rating: 4.8,
      reviewCount: 12,
      isFeatured: true, isNewArrival: true,
      images: [
        U('women blazer fashion', 800, 1000, 1),
        U('women blazer coat elegant', 800, 1000, 2),
      ],
      variants: [
        { size: 'XS', colors: ['#111111', '#FFFFFF', '#8B7355'] },
        { size: 'S', colors: ['#111111', '#FFFFFF', '#8B7355'] },
        { size: 'M', colors: ['#111111', '#FFFFFF', '#8B7355'] },
      ]
    },
    {
      name: 'Silk Midi Dress',
      slug: 'silk-midi-dress',
      description: 'Effortlessly elegant silk midi dress with a relaxed cut. Made from 100% mulberry silk for the ultimate in luxury and comfort.',
      shortDescription: '100% mulberry silk midi dress',
      price: 480,
      salePrice: 380,
      categoryId: createdCategories['women'] as string,
      coverImage: U('women silk dress elegant', 800, 1000, 3),
      gender: 'women',
      collection: 'Evening Wear',
      tags: 'dress,silk,elegant',
      rating: 4.9,
      reviewCount: 24,
      isFeatured: true, isNewArrival: false,
      images: [
        U('women silk dress elegant', 800, 1000, 3),
        U('women midi dress fashion', 800, 1000, 4),
      ],
      variants: [
        { size: 'S', colors: ['#F5F5DC', '#C0C0C0', '#000000'] },
        { size: 'M', colors: ['#F5F5DC', '#C0C0C0', '#000000'] },
      ]
    },
    {
      name: 'Wide-Leg Trousers',
      slug: 'wide-leg-trousers',
      description: 'High-waisted wide-leg trousers in fluid crepe fabric. The relaxed silhouette creates an elegant, elongating effect.',
      shortDescription: 'Fluid crepe wide-leg trousers',
      price: 189,
      categoryId: createdCategories['women'] as string,
      coverImage: U('women wide leg trousers', 800, 1000, 5),
      gender: 'women',
      collection: 'Workwear',
      tags: 'trousers,wide-leg,casual',
      rating: 4.7,
      reviewCount: 8,
      isFeatured: false, isNewArrival: true,
      images: [
        U('women wide leg trousers', 800, 1000, 5),
        U('women fashion pants minimalist', 800, 1000, 6),
      ],
      variants: [
        { size: 'S', colors: ['#111111', '#FFFFFF', '#D3CEC4'] },
        { size: 'M', colors: ['#111111', '#FFFFFF', '#D3CEC4'] },
      ]
    },
    {
      name: 'Classic Oxford Shirt',
      slug: 'classic-oxford-shirt',
      description: 'A refined take on the classic Oxford shirt. Crafted from a soft cotton blend with a relaxed fit and subtle texture.',
      shortDescription: 'Soft cotton blend Oxford shirt',
      price: 149,
      categoryId: createdCategories['men'] as string,
      coverImage: U('men shirt fashion elegant', 800, 1000, 9),
      gender: 'men',
      collection: 'Essentials',
      tags: 'shirt,oxford,men',
      rating: 4.6,
      reviewCount: 15,
      isFeatured: true, isNewArrival: false,
      images: [
        U('men shirt fashion elegant', 800, 1000, 9),
        U('men oxford shirt white', 800, 1000, 10),
      ],
      variants: [
        { size: 'M', colors: ['#FFFFFF', '#4A90D9', '#111111'] },
        { size: 'L', colors: ['#FFFFFF', '#4A90D9', '#111111'] },
      ]
    },
  ];

  for (const p of mockProducts) {
    const { images, variants, ...productData } = p;
    
    // create variants array
    const variantRecords = [];
    let stockBase = 10;
    for (const v of variants) {
      for (const color of v.colors) {
        variantRecords.push({
          size: v.size,
          color,
          stock: stockBase++,
          sku: `SKU-${p.slug}-${v.size}-${color.replace('#', '')}`
        });
      }
    }

    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((url, i) => ({ url, sortOrder: i }))
        },
        variants: {
          create: variantRecords
        }
      }
    });
  }

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'New Season Arrivals',
        subtitle: 'Discover the Spring/Summer 2025 Collection',
        image: U('fashion model elegant minimal', 1920, 1080, 100),
        buttonText: 'Shop Now',
        buttonLink: '/new-collection',
        isActive: true,
      },
      {
        title: 'Effortless Elegance',
        subtitle: "The Women's Edit — Curated for the Modern Woman",
        image: U('women fashion editorial luxury', 1920, 1080, 101),
        buttonText: 'Explore Women',
        buttonLink: '/category/women',
        isActive: true,
      },
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
