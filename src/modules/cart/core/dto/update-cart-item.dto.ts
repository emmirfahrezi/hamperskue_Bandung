import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;

  @ApiPropertyOptional({
    example: 'Custom greeting card message update',
  })
  @IsOptional()
  @IsString()
  custom_notes?: string;
}
