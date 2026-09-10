import { Category, PrismaClient, StockStatus } from '@prisma/client';

export const seedProducts = async (prisma: PrismaClient, categories: Category[]) => {
  console.log('🎁 Seeding products and product images...');

  const birthdayCat = categories.find((c) => c.slug === 'birthday') || categories[0];
  const lebaranCat = categories.find((c) => c.slug === 'lebaran') || categories[0];
  const weddingCat = categories.find((c) => c.slug === 'wedding') || categories[0];
  const anniversaryCat = categories.find((c) => c.slug === 'anniversary') || categories[0];

  const product1 = await prisma.product.create({
    data: {
      category_id: birthdayCat.id,
      name: 'Sweet Celebration Box',
      slug: 'sweet-celebration-box',
      description:
        'Hampers istimewa untuk momen ulang tahun. Berisi kombinasi best seller brownies lembut, choco chip cookies renyah, nastar nanas lumer, dan free custom greeting card.',
      price: 150000,
      stock_status: StockStatus.AVAILABLE,
      is_active: true,
      images: {
        create: [
          {
            image_url:
              'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
            sort_order: 0,
          },
          {
            image_url:
              'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
            sort_order: 1,
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      category_id: lebaranCat.id,
      name: 'Royal Gold Hampers',
      slug: 'royal-gold-hampers',
      description:
        'Koleksi hampers Idul Fitri premium disajikan dalam box kayu eksklusif. Terdiri dari Kastengel Keju Edam, Nastar Wisman, Putri Salju Mede, dan tasbih mutiara.',
      price: 350000,
      stock_status: StockStatus.AVAILABLE,
      is_active: true,
      images: {
        create: [
          {
            image_url:
              'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            sort_order: 0,
          },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      category_id: weddingCat.id,
      name: 'Blossom Wedding Gift Box',
      slug: 'blossom-wedding-gift-box',
      description:
        'Kado manis untuk pernikahan sahabat. Berisi 8 pcs French Macarons aneka rasa, sparkling juice, scented candle aromaterapi, serta dried flowers bouquet.',
      price: 275000,
      stock_status: StockStatus.AVAILABLE,
      is_active: true,
      images: {
        create: [
          {
            image_url:
              'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
            sort_order: 0,
          },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      category_id: anniversaryCat.id,
      name: 'Delight Choco Romance',
      slug: 'delight-choco-romance',
      description:
        'Hadiah manis perayaan hari jadi. Fudgy chocolate brownies dengan topping almond panggang dan 1 toples cookies butter premium.',
      price: 125000,
      stock_status: StockStatus.AVAILABLE,
      is_active: true,
      images: {
        create: [
          {
            image_url:
              'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
            sort_order: 0,
          },
        ],
      },
    },
  });

  return [product1, product2, product3, product4];
};
