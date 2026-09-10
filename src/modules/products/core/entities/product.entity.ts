import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StockStatus } from '@prisma/client';
import { CategoryEntity } from '@modules/categories/core/entities/category.entity';
import { ProductImageEntity } from './product-image.entity';

export class ProductEntity {
  @ApiProperty({ example: 'a9e14a51-bb38-4e89-9a74-bfb70c3ceba7' })
  id: string;

  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec' })
  category_id: string;

  @ApiProperty({ example: 'Sweet Celebration Box' })
  name: string;

  @ApiProperty({ example: 'sweet-celebration-box' })
  slug: string;

  @ApiPropertyOptional({
    example: 'Hampers premium dengan perpaduan cookies, brownies, dan nastar istimewa.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 150000 })
  price: number;

  @ApiProperty({ enum: StockStatus, example: StockStatus.AVAILABLE })
  stock_status: StockStatus;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional({ type: () => CategoryEntity })
  category?: CategoryEntity;

  @ApiPropertyOptional({ type: () => [ProductImageEntity] })
  images?: ProductImageEntity[];

  constructor(partial: any) {
    if (partial) {
      Object.assign(this, partial);
      if (partial.price !== undefined) {
        this.price = Number(partial.price);
      }
      if (partial.category) {
        this.category = new CategoryEntity(partial.category);
      }
      if (partial.images) {
        this.images = partial.images.map((img: any) => new ProductImageEntity(img));
      }
    }
  }
}
