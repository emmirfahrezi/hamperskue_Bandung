import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DashboardSummaryDto } from './core/dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const [
      total_products,
      active_products,
      inactive_products,
      available_products,
      unavailable_products,
      total_categories,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { is_active: true } }),
      this.prisma.product.count({ where: { is_active: false } }),
      this.prisma.product.count({ where: { stock_status: 'AVAILABLE' } }),
      this.prisma.product.count({ where: { stock_status: 'UNAVAILABLE' } }),
      this.prisma.category.count(),
    ]);

    return {
      total_products,
      active_products,
      inactive_products,
      available_products,
      unavailable_products,
      total_categories,
    };
  }
}
