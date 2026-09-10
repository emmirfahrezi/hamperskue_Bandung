import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockStatus } from '@prisma/client';
import { CreateProductImageDto } from './product-image.dto';

export class CreateProductDto {
  @ApiProperty({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec', description: 'Category UUID' })
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  @IsNotEmpty({ message: 'category_id is required' })
  category_id: string;

  @ApiProperty({ example: 'Sweet Celebration Box' })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @ApiPropertyOptional({
    example: 'sweet-celebration-box',
    description: 'Custom slug. Auto-generated from name if not provided.',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Hampers premium dengan perpaduan cookies, brownies, dan nastar istimewa.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 150000, description: 'Price in IDR' })
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiPropertyOptional({ enum: StockStatus, default: StockStatus.AVAILABLE })
  @IsEnum(StockStatus)
  @IsOptional()
  stock_status?: StockStatus = StockStatus.AVAILABLE;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiPropertyOptional({
    type: [CreateProductImageDto],
    description: 'Initial list of product image URLs and their order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsOptional()
  images?: CreateProductImageDto[];
}
