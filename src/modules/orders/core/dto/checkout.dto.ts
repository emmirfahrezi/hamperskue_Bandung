import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ example: 'Siti Rahma', description: 'Name of the hampers recipient' })
  @IsString()
  @IsNotEmpty({ message: 'Recipient name is required' })
  recipient_name: string;

  @ApiProperty({ example: '081298765432', description: 'Phone number of the recipient' })
  @IsString()
  @IsNotEmpty({ message: 'Recipient phone number is required' })
  recipient_phone: string;

  @ApiProperty({
    example: 'Jl. Dago Asri No. 15, Coblong',
    description: 'Detailed shipping delivery address',
  })
  @IsString()
  @IsNotEmpty({ message: 'Shipping address is required' })
  shipping_address: string;

  @ApiPropertyOptional({ example: 'Bandung' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '40135' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({
    example: '2026-10-15',
    description: 'Target delivery date requested by the customer',
  })
  @IsOptional()
  @IsDateString()
  delivery_date?: string;

  @ApiPropertyOptional({
    example: 'Selamat Hari Raya Idul Fitri, mohon maaf lahir dan batin dari Keluarga Budi.',
    description: 'Custom message printed on the hampers greeting card',
  })
  @IsOptional()
  @IsString()
  greeting_card_message?: string;

  @ApiPropertyOptional({
    example: 'Tolong jangan dibanting ya, paket berisi toples kue kering kaca.',
    description: 'Additional notes for the courier / baker',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 25000,
    default: 0,
    description: 'Shipping delivery fee',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping_fee?: number;
}
