import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'b6f9a0c8-472d-419b-a017-d7d812ab5519', description: 'Product UUID' })
  @IsUUID('4', { message: 'Invalid product ID' })
  @IsNotEmpty({ message: 'Product ID is required' })
  product_id: string;

  @ApiProperty({ example: 1, minimum: 1, default: 1 })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @ApiPropertyOptional({
    example: 'To: Sarah, Happy Eid Mubarak! From: Budi',
    description: 'Custom notes or greeting card message for this hampers',
  })
  @IsOptional()
  @IsString()
  custom_notes?: string;
}
