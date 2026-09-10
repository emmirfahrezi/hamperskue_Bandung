import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty({ example: 24, description: 'Total products created' })
  total_products: number;

  @ApiProperty({ example: 20, description: 'Active products available in catalog' })
  active_products: number;

  @ApiProperty({ example: 4, description: 'Inactive products hidden from catalog' })
  inactive_products: number;

  @ApiProperty({ example: 21, description: 'Products currently marked AVAILABLE' })
  available_products: number;

  @ApiProperty({ example: 3, description: 'Products currently marked UNAVAILABLE' })
  unavailable_products: number;

  @ApiProperty({ example: 7, description: 'Total product categories' })
  total_categories: number;
}
