import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements Partial<PrismaUser> {
  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec' })
  id: string;

  @ApiProperty({ example: 'Admin Hamperskue' })
  name: string;

  @ApiProperty({ example: 'admin@hamperskue.com' })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
