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
import { CategoriesService } from '../../categories.service';
import { CreateCategoryDto } from '../../core/dto/create-category.dto';
import { UpdateCategoryDto } from '../../core/dto/update-category.dto';
import { CategoryQueryDto } from '../../core/dto/category-query.dto';
import { CategoryEntity } from '../../core/entities/category.entity';
import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiSuccessResponse,
  ApiSuccessArrayResponse,
} from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories (public catalog & admin)' })
  @ApiSuccessArrayResponse(CategoryEntity)
  async findAll(@Query() query: CategoryQueryDto): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiSuccessResponse(CategoryEntity)
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiSuccessResponse(CategoryEntity)
  @ApiResponse({ status: 409, description: 'Slug already taken' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiSuccessResponse(CategoryEntity)
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({ status: 400, description: 'Cannot delete category containing products' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
