import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PROCESSING })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @ApiPropertyOptional({ example: 'bank_transfer' })
  @IsOptional()
  @IsString()
  payment_method?: string;
}
