import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { seedUsers } from './data/user.seed';
import { seedCategories } from './data/category.seed';
import { seedProducts } from './data/product.seed';
import { seedSettings } from './data/setting.seed';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding for Hamperskue MVP...\n');

  // Clear existing data in relation order
  console.log('🗑️  Clearing existing data...');
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.businessSetting.deleteMany();

  // Run modular seeders from data/
  const { adminUser, defaultPassword } = await seedUsers(prisma);
  const categories = await seedCategories(prisma);
  await seedProducts(prisma, categories);
  await seedSettings(prisma);

  // Summary
  console.log('\n✨ Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Categories: ${await prisma.category.count()}`);
  console.log(`   - Products: ${await prisma.product.count()}`);
  console.log(`   - Product Images: ${await prisma.productImage.count()}`);
  console.log(`   - Business Settings: ${await prisma.businessSetting.count()}\n`);

  console.log('🔑 Default Admin Login:');
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Password: ${defaultPassword}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
