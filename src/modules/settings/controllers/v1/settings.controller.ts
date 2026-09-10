import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SettingsService } from '../../settings.service';
import { UpdateSettingDto } from '../../core/dto/update-setting.dto';
import { SettingEntity } from '../../core/entities/setting.entity';
import { Public } from '../../../../common/decorators/public.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiSuccessResponse } from '../../../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Settings')
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get business settings (public info for landing page & WhatsApp CTA)' })
  @ApiSuccessResponse(SettingEntity)
  async getSettings(): Promise<SettingEntity> {
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business settings (Admin only)' })
  @ApiSuccessResponse(SettingEntity)
  async updateSettings(@Body() updateSettingDto: UpdateSettingDto): Promise<SettingEntity> {
    return this.settingsService.updateSettings(updateSettingDto);
  }
}
