import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty({ example: 'b6f9a0c8-472d-419b-a017-d7d812ab5519' })
  id: string;

  @ApiProperty({ example: 'Emmir' })
  name: string;

  @ApiProperty({ example: 'customer@gmail.com' })
  email: string;

  @ApiProperty({ enum: Role, example: Role.CUSTOMER })
  role: Role;

  @ApiPropertyOptional({ example: '081234567890' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Jl. Riau No. 12, Bandung' })
  address?: string | null;

  @ApiPropertyOptional({ example: 'Bandung' })
  city?: string | null;

  @ApiPropertyOptional({ example: '40115' })
  postal_code?: string | null;
}

export class AuthResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user: AuthUserDto;
}
