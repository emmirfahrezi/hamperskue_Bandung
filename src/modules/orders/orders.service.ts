import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CheckoutDto } from './core/dto/checkout.dto';
import { OrderQueryDto } from './core/dto/order-query.dto';
import { UpdateOrderStatusDto } from './core/dto/update-order-status.dto';
import { OrderEntity } from './core/entities/order.entity';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async generateSnapToken(order: {
    order_number: string;
    grand_total: number;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    city?: string | null;
    postal_code?: string | null;
    user: { name: string; email: string };
    items: Array<{
      product_id: string;
      product_name: string;
      price: number;
      quantity: number;
    }>;
  }): Promise<{ snap_token: string; snap_redirect_url: string }> {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const isProduction = this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true';

    if (!serverKey) {
      this.logger.warn(
        `[Midtrans] MIDTRANS_SERVER_KEY is not configured in environment. Using simulated Snap token for development.`,
      );
      return {
        snap_token: `mock_snap_${order.order_number}`,
        snap_redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_${order.order_number}`,
      };
    }

    const endpoint = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const authHeader = `Basic ${Buffer.from(serverKey + ':').toString('base64')}`;

    try {
      const payload = {
        transaction_details: {
          order_id: order.order_number,
          gross_amount: Math.round(order.grand_total),
        },
        item_details: order.items.map((item) => ({
          id: item.product_id,
          price: Math.round(item.price),
          quantity: item.quantity,
          name: item.product_name.slice(0, 50),
        })),
        customer_details: {
          first_name: order.user.name,
          email: order.user.email,
          phone: order.recipient_phone,
          shipping_address: {
            first_name: order.recipient_name,
            phone: order.recipient_phone,
            address: order.shipping_address,
            city: order.city || 'Bandung',
            postal_code: order.postal_code || '',
          },
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Midtrans] Snap API error: ${response.status} - ${errorText}`);
        return {
          snap_token: `mock_snap_${order.order_number}`,
          snap_redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_${order.order_number}`,
        };
      }

      const data = (await response.json()) as { token: string; redirect_url: string };
      return {
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
      };
    } catch (err: any) {
      this.logger.error(`[Midtrans] Failed to connect to Snap API: ${err.message}`);
      return {
        snap_token: `mock_snap_${order.order_number}`,
        snap_redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_${order.order_number}`,
      };
    }
  }

  async checkout(userId: string, checkoutDto: CheckoutDto): Promise<OrderEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your shopping cart is empty');
    }

    // Validate product stock & calculate total
    let totalAmount = 0;
    const orderItemsData = cart.items.map((item) => {
      if (item.product.stock_status !== 'AVAILABLE' || !item.product.is_active) {
        throw new BadRequestException(
          `Product "${item.product.name}" is currently unavailable or inactive`,
        );
      }
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      return {
        product_id: item.product_id,
        product_name: item.product.name,
        price,
        quantity: item.quantity,
        subtotal,
        custom_notes: item.custom_notes,
      };
    });

    const shippingFee = checkoutDto.shipping_fee || 0;
    const grandTotal = totalAmount + shippingFee;

    // Generate Order Number: HK-YYYYMMDD-XXXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HK-${today}-${randomSuffix}`;

    // Request Midtrans Snap Token
    const snapResult = await this.generateSnapToken({
      order_number: orderNumber,
      grand_total: grandTotal,
      recipient_name: checkoutDto.recipient_name,
      recipient_phone: checkoutDto.recipient_phone,
      shipping_address: checkoutDto.shipping_address,
      city: checkoutDto.city,
      postal_code: checkoutDto.postal_code,
      user: { name: user.name, email: user.email },
      items: orderItemsData,
    });

    // Save order & clear cart inside transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          user_id: userId,
          total_amount: totalAmount,
          shipping_fee: shippingFee,
          grand_total: grandTotal,
          status: OrderStatus.PENDING_PAYMENT,
          payment_status: PaymentStatus.UNPAID,
          snap_token: snapResult.snap_token,
          snap_redirect_url: snapResult.snap_redirect_url,
          recipient_name: checkoutDto.recipient_name,
          recipient_phone: checkoutDto.recipient_phone,
          shipping_address: checkoutDto.shipping_address,
          city: checkoutDto.city,
          postal_code: checkoutDto.postal_code,
          delivery_date: checkoutDto.delivery_date ? new Date(checkoutDto.delivery_date) : null,
          greeting_card_message: checkoutDto.greeting_card_message,
          notes: checkoutDto.notes,
          items: {
            create: orderItemsData.map((item) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal,
              custom_notes: item.custom_notes,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cart_id: cart.id },
      });

      return createdOrder;
    });

    return this.mapOrderEntity(order);
  }

  async findAll(
    userId: string,
    role: Role,
    query: OrderQueryDto,
  ): Promise<PaginatedResponseDto<OrderEntity>> {
    const { status, payment_status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Customer can only view their own orders
    if (role !== Role.ADMIN) {
      where.user_id = userId;
    }

    if (status) {
      where.status = status;
    }

    if (payment_status) {
      where.payment_status = payment_status;
    }

    if (search) {
      where.OR = [
        { order_number: { contains: search, mode: 'insensitive' } },
        { recipient_name: { contains: search, mode: 'insensitive' } },
        { recipient_phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: orders.map((o) => this.mapOrderEntity(o)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userId: string, role: Role): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== Role.ADMIN && order.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.mapOrderEntity(order);
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...(updateDto.status ? { status: updateDto.status } : {}),
        ...(updateDto.payment_status ? { payment_status: updateDto.payment_status } : {}),
        ...(updateDto.payment_method ? { payment_method: updateDto.payment_method } : {}),
      },
      include: { items: true },
    });

    return this.mapOrderEntity(updated);
  }

  async handleMidtransNotification(payload: any): Promise<{ received: boolean }> {
    this.logger.log(`[Midtrans Webhook] Received notification for order: ${payload?.order_id}`);

    const orderNumber = payload?.order_id;
    const transactionStatus = payload?.transaction_status;
    const fraudStatus = payload?.fraud_status;
    const paymentType = payload?.payment_type;

    if (!orderNumber) {
      return { received: false };
    }

    const order = await this.prisma.order.findUnique({
      where: { order_number: orderNumber },
    });

    if (!order) {
      this.logger.warn(`[Midtrans Webhook] Order not found: ${orderNumber}`);
      return { received: false };
    }

    let paymentStatus: PaymentStatus = order.payment_status;
    let orderStatus: OrderStatus = order.status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = PaymentStatus.PAID;
        orderStatus = OrderStatus.PAID;
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = PaymentStatus.PAID;
      orderStatus = OrderStatus.PAID;
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      paymentStatus = PaymentStatus.FAILED;
      orderStatus = OrderStatus.CANCELLED;
    } else if (transactionStatus === 'pending') {
      paymentStatus = PaymentStatus.PENDING;
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        payment_status: paymentStatus,
        status: orderStatus,
        payment_method: paymentType || order.payment_method,
      },
    });

    return { received: true };
  }

  private mapOrderEntity(order: any): OrderEntity {
    return {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      total_amount: Number(order.total_amount),
      shipping_fee: Number(order.shipping_fee),
      grand_total: Number(order.grand_total),
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      snap_token: order.snap_token,
      snap_redirect_url: order.snap_redirect_url,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      shipping_address: order.shipping_address,
      city: order.city,
      postal_code: order.postal_code,
      delivery_date: order.delivery_date,
      greeting_card_message: order.greeting_card_message,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: order.items?.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        custom_notes: item.custom_notes,
      })),
    };
  }
}
