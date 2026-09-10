import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Birthday' })
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'birthday', description: 'Optional custom slug. Auto-generated from name if not provided.' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Hampers spesial untuk perayaan ulang tahun' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
