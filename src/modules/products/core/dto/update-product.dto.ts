import { ApiPropertyOptional } from '@nestjs/swagger';
import {
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

export class UpdateProductDto {
  @ApiPropertyOptional({ example: '86fe34d7-133c-4a30-8025-a7bdfd94d3ec' })
  @IsUUID('4')
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional({ example: 'Sweet Celebration Box Deluxe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'sweet-celebration-box-deluxe' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Deskripsi hampers baru' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 175000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ enum: StockStatus })
  @IsEnum(StockStatus)
  @IsOptional()
  stock_status?: StockStatus;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    type: [CreateProductImageDto],
    description: 'Updated images array (will replace existing images if provided)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsOptional()
  images?: CreateProductImageDto[];
}
