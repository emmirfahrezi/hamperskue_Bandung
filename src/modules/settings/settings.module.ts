import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './controllers/v1/settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
