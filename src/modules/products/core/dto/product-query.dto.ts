import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from '@common/dto/pagination.dto';
import { StockStatus } from '@prisma/client';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search keyword for name or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsUUID('4')
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional({ description: 'Filter by category slug (e.g. birthday)' })
  @IsString()
  @IsOptional()
  category_slug?: string;

  @ApiPropertyOptional({ enum: StockStatus })
  @IsEnum(StockStatus)
  @IsOptional()
  stock_status?: StockStatus;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Filter minimum price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  min_price?: number;

  @ApiPropertyOptional({ description: 'Filter maximum price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  max_price?: number;
}
