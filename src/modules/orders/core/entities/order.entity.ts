import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class OrderItemEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  subtotal: number;

  @ApiPropertyOptional()
  custom_notes?: string | null;
}

export class OrderEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_number: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  shipping_fee: number;

  @ApiProperty()
  grand_total: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  payment_status: PaymentStatus;

  @ApiPropertyOptional()
  payment_method?: string | null;

  @ApiPropertyOptional()
  snap_token?: string | null;

  @ApiPropertyOptional()
  snap_redirect_url?: string | null;

  @ApiProperty()
  recipient_name: string;

  @ApiProperty()
  recipient_phone: string;

  @ApiProperty()
  shipping_address: string;

  @ApiPropertyOptional()
  city?: string | null;

  @ApiPropertyOptional()
  postal_code?: string | null;

  @ApiPropertyOptional()
  delivery_date?: Date | null;

  @ApiPropertyOptional()
  greeting_card_message?: string | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional({ type: () => [OrderItemEntity] })
  items?: OrderItemEntity[];
}
