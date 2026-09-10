import { PrismaClient } from '@prisma/client';

export const seedCategories = async (prisma: PrismaClient) => {
  console.log('📁 Seeding categories...');

  const categoryData = [
    {
      name: 'Birthday',
      slug: 'birthday',
      description: 'Hampers ulang tahun spesial dengan kartu ucapan personal dan kemasan meriah.',
    },
    {
      name: 'Wedding',
      slug: 'wedding',
      description: 'Hampers pernikahan elegan dan berkesan untuk pasangan pengantin.',
    },
    {
      name: 'Anniversary',
      slug: 'anniversary',
      description: 'Paket hampers anniversary penuh cinta untuk momen romantis.',
    },
    {
      name: 'Lebaran',
      slug: 'lebaran',
      description: 'Koleksi hampers Idul Fitri istimewa dengan aneka kue kering klasik premium.',
    },
    {
      name: 'Christmas',
      slug: 'christmas',
      description: 'Hampers Natal & Tahun Baru bernuansa hangat dan penuh sukacita.',
    },
    {
      name: 'Corporate',
      slug: 'corporate',
      description: 'Hampers profesional untuk partner kerja, klien, dan apresiasi karyawan.',
    },
    {
      name: 'Custom',
      slug: 'custom',
      description: 'Paket hampers yang dapat disesuaikan dengan budget dan kombinasi pilihan Anda.',
    },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.create({
        data: {
          ...cat,
          is_active: true,
        },
      }),
    ),
  );

  return categories;
};
