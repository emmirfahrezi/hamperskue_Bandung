import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiPropertyOptional({ example: 'Hamperskue Bakery & Gift' })
  @IsString()
  @IsOptional()
  business_name?: string;

  @ApiPropertyOptional({
    example: 'Spesialis hampers kue premium, cookies, dan gift box istimewa untuk segala momen.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '6281234567890' })
  @IsString()
  @IsOptional()
  whatsapp_number?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/hamperskue' })
  @IsString()
  @IsOptional()
  instagram_url?: string;

  @ApiPropertyOptional({ example: 'Jl. Melati No. 12, Jakarta' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Senin - Sabtu: 08.00 - 17.00 WIB' })
  @IsString()
  @IsOptional()
  operating_hours?: string;
}
