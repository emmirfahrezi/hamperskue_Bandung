import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartProductImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  image_url: string;
}

export class CartProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock_status: string;

  @ApiPropertyOptional({ type: () => [CartProductImageDto] })
  images?: CartProductImageDto[];
}

export class CartItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  custom_notes?: string | null;

  @ApiProperty({ type: () => CartProductDto })
  product: CartProductDto;

  @ApiProperty()
  subtotal: number;
}

export class CartResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ type: () => [CartItemDto] })
  items: CartItemDto[];

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  total_price: number;
}
