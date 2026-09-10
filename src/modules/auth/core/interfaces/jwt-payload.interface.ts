import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  role: Role;
}
