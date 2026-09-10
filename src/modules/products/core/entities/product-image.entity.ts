import { ApiProperty } from '@nestjs/swagger';
import { ProductImage as PrismaProductImage } from '@prisma/client';

export class ProductImageEntity implements Partial<PrismaProductImage> {
  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec' })
  id: string;

  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ed' })
  product_id: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35' })
  image_url: string;

  @ApiProperty({ example: 0 })
  sort_order: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<ProductImageEntity>) {
    Object.assign(this, partial);
  }
}
