import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category as PrismaCategory } from '@prisma/client';

export class CategoryEntity implements Partial<PrismaCategory> {
  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec' })
  id: string;

  @ApiProperty({ example: 'Birthday' })
  name: string;

  @ApiProperty({ example: 'birthday' })
  slug: string;

  @ApiPropertyOptional({ example: 'Hampers spesial untuk perayaan ulang tahun', nullable: true })
  description: string | null;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional({ description: 'Total count of products in this category' })
  _count?: {
    products: number;
  };

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
