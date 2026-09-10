import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from './core/dto/create-user.dto';
import { UpdateUserDto } from './core/dto/update-user.dto';
import { UserQueryDto } from './core/dto/user-query.dto';
import { UserEntity } from './core/entities/user.entity';
import { PaginatedResponseDto } from '@common/dto/pagination.dto';
import { PasswordUtil } from '@common/utils/password.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, name, role, is_active } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await PasswordUtil.hash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ADMIN',
        is_active: is_active ?? true,
      },
    });

    return new UserEntity(user);
  }

  async findAll(query: UserQueryDto): Promise<PaginatedResponseDto<UserEntity>> {
    const { page = 1, limit = 10, search, role, is_active } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => new UserEntity(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserEntity(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);

    const data: Prisma.UserUpdateInput = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await PasswordUtil.hash(updateUserDto.password);
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use by another user');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return new UserEntity(updatedUser);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
