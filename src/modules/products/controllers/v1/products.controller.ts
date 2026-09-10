import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductsService } from '../../products.service';
import { CreateProductDto } from '../../core/dto/create-product.dto';
import { UpdateProductDto } from '../../core/dto/update-product.dto';
import { ProductQueryDto } from '../../core/dto/product-query.dto';
import { ProductEntity } from '../../core/entities/product.entity';
import { Public } from '../../../../common/decorators/public.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiSuccessResponse } from '../../../../common/decorators/api-response.decorator';
import { PaginatedResponseDto } from '../../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all hampers products (public catalog & admin, with category filter & pagination)',
  })
  @ApiSuccessResponse(PaginatedResponseDto<ProductEntity>)
  async findAll(@Query() query: ProductQueryDto): Promise<PaginatedResponseDto<ProductEntity>> {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get hampers product detail by slug (for WhatsApp ordering flow)' })
  @ApiParam({ name: 'slug', type: String, example: 'sweet-celebration-box' })
  @ApiSuccessResponse(ProductEntity)
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string): Promise<ProductEntity> {
    return this.productsService.findBySlug(slug);
  }

  @Get('id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get hampers product by UUID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiSuccessResponse(ProductEntity)
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ProductEntity> {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new hampers product (Admin only)' })
  @ApiSuccessResponse(ProductEntity)
  @ApiResponse({ status: 400, description: 'Category does not exist' })
  @ApiResponse({ status: 409, description: 'Product slug already taken' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hampers product (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiSuccessResponse(ProductEntity)
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product slug already taken' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete hampers product (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
