import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto } from './core/dto/create-product.dto';
import { UpdateProductDto } from './core/dto/update-product.dto';
import { ProductQueryDto } from './core/dto/product-query.dto';
import { ProductEntity } from './core/entities/product.entity';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { SlugUtil } from '../../common/utils/slug.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto): Promise<PaginatedResponseDto<ProductEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      category_slug,
      stock_status,
      is_active,
      min_price,
      max_price,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category_id) {
      where.category_id = category_id;
    } else if (category_slug) {
      where.category = { slug: category_slug };
    }

    if (stock_status) {
      where.stock_status = stock_status;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (min_price !== undefined || max_price !== undefined) {
      where.price = {};
      if (min_price !== undefined) {
        where.price.gte = min_price;
      }
      if (max_price !== undefined) {
        where.price.lte = max_price;
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          images: {
            orderBy: { sort_order: 'asc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((prod) => new ProductEntity(prod)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return new ProductEntity(product);
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return new ProductEntity(product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const {
      category_id,
      name,
      description,
      price,
      stock_status,
      is_active,
      images,
    } = createProductDto;

    // Check category exists
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      throw new BadRequestException(`Category with ID "${category_id}" does not exist`);
    }

    // Determine slug
    let slug = createProductDto.slug
      ? SlugUtil.create(createProductDto.slug)
      : SlugUtil.create(name);

    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Product slug "${slug}" is already taken`);
    }

    const product = await this.prisma.product.create({
      data: {
        category_id,
        name,
        slug,
        description,
        price,
        stock_status: stock_status ?? 'AVAILABLE',
        is_active: is_active ?? true,
        images: images && images.length > 0 ? {
          create: images.map((img, index) => ({
            image_url: img.image_url,
            sort_order: img.sort_order ?? index,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    return new ProductEntity(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    await this.findById(id);

    const {
      category_id,
      name,
      slug: customSlug,
      description,
      price,
      stock_status,
      is_active,
      images,
    } = updateProductDto;

    const data: Prisma.ProductUpdateInput = {};

    if (category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: category_id },
      });
      if (!category) {
        throw new BadRequestException(`Category with ID "${category_id}" does not exist`);
      }
      data.category = { connect: { id: category_id } };
    }

    if (name !== undefined) {
      data.name = name;
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (price !== undefined) {
      data.price = price;
    }

    if (stock_status !== undefined) {
      data.stock_status = stock_status;
    }

    if (is_active !== undefined) {
      data.is_active = is_active;
    }

    if (customSlug !== undefined) {
      const slug = SlugUtil.create(customSlug);
      const existingSlug = await this.prisma.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        throw new ConflictException(`Product slug "${slug}" is already taken`);
      }
      data.slug = slug;
    }

    // If images are provided in update, sync images
    if (images) {
      await this.prisma.productImage.deleteMany({
        where: { product_id: id },
      });

      if (images.length > 0) {
        await this.prisma.productImage.createMany({
          data: images.map((img, index) => ({
            product_id: id,
            image_url: img.image_url,
            sort_order: img.sort_order ?? index,
          })),
        });
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    return new ProductEntity(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
