import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsInt, Min } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35' })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sort_order?: number = 0;
}
