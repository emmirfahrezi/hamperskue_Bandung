import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToCartDto } from './core/dto/add-to-cart.dto';
import { UpdateCartItemDto } from './core/dto/update-cart-item.dto';
import { CartResponseDto } from './core/dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
      });
    }

    return cart;
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sort_order: 'asc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!fullCart) {
      throw new NotFoundException('Cart not found');
    }

    let totalItems = 0;
    let totalPrice = 0;

    const items = fullCart.items.map((item) => {
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;
      totalItems += item.quantity;
      totalPrice += subtotal;

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        custom_notes: item.custom_notes,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price,
          stock_status: item.product.stock_status,
          images: item.product.images.map((img) => ({
            id: img.id,
            image_url: img.image_url,
          })),
        },
        subtotal,
      };
    });

    return {
      id: fullCart.id,
      user_id: fullCart.user_id,
      items,
      total_items: totalItems,
      total_price: totalPrice,
    };
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const { product_id, quantity, custom_notes } = addToCartDto;

    // Check product exists and available
    const product = await this.prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product || !product.is_active) {
      throw new NotFoundException('Product not found or inactive');
    }

    if (product.stock_status !== 'AVAILABLE') {
      throw new BadRequestException('Product is currently out of stock');
    }

    const cart = await this.getOrCreateCart(userId);

    // Upsert or update existing cart item
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          custom_notes: custom_notes !== undefined ? custom_notes : existingItem.custom_notes,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id,
          quantity,
          custom_notes,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in your cart');
    }

    const { quantity, custom_notes } = updateCartItemDto;

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        ...(quantity !== undefined ? { quantity } : {}),
        ...(custom_notes !== undefined ? { custom_notes } : {}),
      },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in your cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return this.getCart(userId);
  }
}
