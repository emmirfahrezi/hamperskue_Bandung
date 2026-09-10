import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty({ example: 'b6f9a0c8-472d-419b-a017-d7d812ab5519' })
  id: string;

  @ApiProperty({ example: 'Admin Hamperskue' })
  name: string;

  @ApiProperty({ example: 'admin@hamperskue.com' })
  email: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;
}

export class AuthResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user: AuthUserDto;
}
