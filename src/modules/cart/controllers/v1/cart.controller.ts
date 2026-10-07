import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from '../../cart.service';
import { AddToCartDto } from '../../core/dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../../core/dto/update-cart-item.dto';
import { CartResponseDto } from '../../core/dto/cart-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { GetUser } from '../../../../common/decorators/get-user.decorator';
import { ApiSuccessResponse } from '../../../../common/decorators/api-response.decorator';

@ApiTags('Cart')
@ApiCookieAuth('Authentication')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user active cart with items and total' })
  @ApiSuccessResponse(CartResponseDto)
  async getCart(@GetUser('userId') userId: string): Promise<CartResponseDto> {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product to shopping cart' })
  @ApiSuccessResponse(CartResponseDto)
  async addItem(
    @GetUser('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addItem(userId, addToCartDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity or greeting notes' })
  @ApiParam({ name: 'id', type: String, description: 'Cart Item UUID' })
  @ApiSuccessResponse(CartResponseDto)
  async updateItem(
    @GetUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiParam({ name: 'id', type: String, description: 'Cart Item UUID' })
  @ApiSuccessResponse(CartResponseDto)
  async removeItem(
    @GetUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) itemId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from current cart' })
  @ApiSuccessResponse(CartResponseDto)
  async clearCart(@GetUser('userId') userId: string): Promise<CartResponseDto> {
    return this.cartService.clearCart(userId);
  }
}
