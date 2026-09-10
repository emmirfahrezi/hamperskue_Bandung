import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCategoryDto } from './core/dto/create-category.dto';
import { UpdateCategoryDto } from './core/dto/update-category.dto';
import { CategoryQueryDto } from './core/dto/category-query.dto';
import { CategoryEntity } from './core/entities/category.entity';
import { SlugUtil } from '../../common/utils/slug.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: CategoryQueryDto): Promise<CategoryEntity[]> {
    const where: Prisma.CategoryWhereInput = {};

    if (query?.is_active !== undefined) {
      where.is_active = query.is_active;
    }

    if (query?.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { created_at: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => new CategoryEntity(cat));
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return new CategoryEntity(category);
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return new CategoryEntity(category);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const { name, description, is_active } = createCategoryDto;
    let slug = createCategoryDto.slug
      ? SlugUtil.create(createCategoryDto.slug)
      : SlugUtil.create(name);

    if (!slug) {
      slug = `cat-${Date.now()}`;
    }

    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Category slug "${slug}" is already taken`);
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        is_active: is_active ?? true,
      },
    });

    return new CategoryEntity(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    await this.findOne(id);

    const data: Prisma.CategoryUpdateInput = {};

    if (updateCategoryDto.name !== undefined) {
      data.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.description !== undefined) {
      data.description = updateCategoryDto.description;
    }

    if (updateCategoryDto.is_active !== undefined) {
      data.is_active = updateCategoryDto.is_active;
    }

    if (updateCategoryDto.slug !== undefined) {
      const slug = SlugUtil.create(updateCategoryDto.slug);
      const existingSlug = await this.prisma.category.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        throw new ConflictException(`Category slug "${slug}" is already taken`);
      }
      data.slug = slug;
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data,
    });

    return new CategoryEntity(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const productsCount = await this.prisma.product.count({
      where: { category_id: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Cannot delete category because it contains ${productsCount} product(s). Remove or reassign the products first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
}
