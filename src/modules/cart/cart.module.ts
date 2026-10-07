import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './controllers/v1/cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
