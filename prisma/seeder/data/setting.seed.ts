import { PrismaClient } from '@prisma/client';

export const seedSettings = async (prisma: PrismaClient) => {
  console.log('⚙️  Seeding business settings...');

  const setting = await prisma.businessSetting.create({
    data: {
      business_name: 'Hamperskue Bakery & Gift',
      description:
        'Spesialis hampers kue premium, cookies, dan gift box istimewa untuk segala momen berharga Anda.',
      whatsapp_number: '6281234567890',
      instagram_url: 'https://instagram.com/hamperskue',
      address: 'Jl. Melati No. 12, Jakarta',
      operating_hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
    },
  });

  return setting;
};
