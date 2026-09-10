import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessSetting as PrismaBusinessSetting } from '@prisma/client';

export class SettingEntity implements Partial<PrismaBusinessSetting> {
  @ApiProperty({ example: 'b6f9a0c8-472d-419b-a017-d7d812ab5519' })
  id: string;

  @ApiProperty({ example: 'Hamperskue Bakery & Gift' })
  business_name: string;

  @ApiPropertyOptional({
    example: 'Spesialis hampers kue premium, cookies, dan gift box istimewa untuk segala momen.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: '6281234567890' })
  whatsapp_number: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/hamperskue', nullable: true })
  instagram_url: string | null;

  @ApiPropertyOptional({ example: 'Jl. Melati No. 12, Jakarta', nullable: true })
  address: string | null;

  @ApiPropertyOptional({ example: 'Senin - Sabtu: 08.00 - 17.00 WIB', nullable: true })
  operating_hours: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<SettingEntity>) {
    Object.assign(this, partial);
  }
}
