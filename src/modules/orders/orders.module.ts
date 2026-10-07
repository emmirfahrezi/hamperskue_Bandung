import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './controllers/v1/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
