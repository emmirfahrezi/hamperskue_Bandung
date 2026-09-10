import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UpdateSettingDto } from './core/dto/update-setting.dto';
import { SettingEntity } from './core/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(): Promise<SettingEntity> {
    let setting = await this.prisma.businessSetting.findFirst();

    if (!setting) {
      setting = await this.prisma.businessSetting.create({
        data: {
          business_name: 'Hamperskue Bakery & Gift',
          description: 'Spesialis hampers kue premium dan gift box istimewa untuk segala momen.',
          whatsapp_number: '6281234567890',
          instagram_url: 'https://instagram.com/hamperskue',
          address: 'Jakarta, Indonesia',
          operating_hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
        },
      });
    }

    return new SettingEntity(setting);
  }

  async updateSettings(updateSettingDto: UpdateSettingDto): Promise<SettingEntity> {
    const current = await this.getSettings();

    const updated = await this.prisma.businessSetting.update({
      where: { id: current.id },
      data: updateSettingDto,
    });

    return new SettingEntity(updated);
  }
}
