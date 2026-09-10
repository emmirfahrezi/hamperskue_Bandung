import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'hamperskue-fallback-jwt-secret-key-2026',
  expiresIn: process.env.JWT_EXPIRATION || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'hamperskue-fallback-jwt-refresh-secret-key-2026',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
}));
