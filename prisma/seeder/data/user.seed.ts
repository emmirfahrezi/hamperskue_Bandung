import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (prisma: PrismaClient) => {
  console.log('👤 Seeding default admin user...');

  const defaultPassword = 'Admin123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Hamperskue',
      email: 'admin@hamperskue.com',
      password: hashedPassword,
      role: Role.ADMIN,
      is_active: true,
    },
  });

  return { adminUser, defaultPassword };
};
