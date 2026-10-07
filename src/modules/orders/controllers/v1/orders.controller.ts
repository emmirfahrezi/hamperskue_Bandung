import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from '../../orders.service';
import { CheckoutDto } from '../../core/dto/checkout.dto';
import { OrderQueryDto } from '../../core/dto/order-query.dto';
import { UpdateOrderStatusDto } from '../../core/dto/update-order-status.dto';
import { OrderEntity } from '../../core/entities/order.entity';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../../../common/decorators/get-user.decorator';
import { Public } from '../../../../common/decorators/public.decorator';
import { ApiSuccessResponse } from '../../../../common/decorators/api-response.decorator';
import { PaginatedResponseDto } from '../../../../common/dto/pagination.dto';

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout active cart into an Order and generate Midtrans Snap token' })
  @ApiSuccessResponse(OrderEntity)
  async checkout(
    @GetUser('userId') userId: string,
    @Body() checkoutDto: CheckoutDto,
  ): Promise<OrderEntity> {
    return this.ordersService.checkout(userId, checkoutDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders list (Customers see their own orders, Admins see all)' })
  @ApiSuccessResponse(PaginatedResponseDto<OrderEntity>)
  async findAll(
    @GetUser('userId') userId: string,
    @GetUser('role') role: Role,
    @Query() query: OrderQueryDto,
  ): Promise<PaginatedResponseDto<OrderEntity>> {
    return this.ordersService.findAll(userId, role, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order detail by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order UUID' })
  @ApiSuccessResponse(OrderEntity)
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: Role,
  ): Promise<OrderEntity> {
    return this.ordersService.findById(id, userId, role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order or payment status (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Order UUID' })
  @ApiSuccessResponse(OrderEntity)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<OrderEntity> {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Public()
  @Post('midtrans/notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Midtrans Payment Gateway Webhook Notification Callback' })
  async handleNotification(@Body() payload: any): Promise<{ received: boolean }> {
    return this.ordersService.handleMidtransNotification(payload);
  }
}
