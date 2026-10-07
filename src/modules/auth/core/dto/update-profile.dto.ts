import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Emmir Fahrezi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Jl. Riau No. 12, Bandung' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Bandung' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '40115' })
  @IsOptional()
  @IsString()
  postal_code?: string;
}
