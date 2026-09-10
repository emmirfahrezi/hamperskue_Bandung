import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Birthday Hampers' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'birthday-hampers' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Hampers kue premium untuk ulang tahun' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
