import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './controllers/v1/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
