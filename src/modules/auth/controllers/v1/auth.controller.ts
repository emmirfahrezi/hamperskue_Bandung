import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../core/dto/login.dto';
import { RegisterDto } from '../../core/dto/register.dto';
import { AuthResponseDto, AuthUserDto } from '../../core/dto/auth-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { ApiSuccessResponse } from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiSuccessResponse(AuthResponseDto)
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResponse = await this.authService.login(loginDto);
    res.cookie('Authentication', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { user: authResponse.user };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiSuccessResponse(AuthResponseDto)
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResponse = await this.authService.register(registerDto);
    res.cookie('Authentication', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { user: authResponse.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
    });
    return { message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('Authentication')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user profile' })
  @ApiSuccessResponse(AuthUserDto)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@GetUser('userId') userId: string): Promise<AuthUserDto> {
    return this.authService.getMe(userId);
  }
}
