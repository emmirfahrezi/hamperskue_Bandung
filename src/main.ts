import { ValidationPipe, VersioningType, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Get configurations
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  const corsOrigin = configService.get<string>('app.corsOrigin');
  const swaggerPath = configService.get<string>('swagger.path') || 'docs';
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  const port = configService.get<number>('app.port') || 3000;

  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Class serializer for excluding fields (like password)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Documentation
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Hamperskue API')
      .setDescription(
        'Backend REST API Documentation for Hamperskue Digital Hampers Catalog MVP.\n\n' +
        'Authentication uses HttpOnly Cookies (`Authentication`). You can test authenticated endpoints by logging in via `POST /api/v1/auth/login`.',
      )
      .setVersion('1.0')
      .addCookieAuth('Authentication', {
        type: 'apiKey',
        in: 'cookie',
        name: 'Authentication',
        description: 'HttpOnly Cookie containing JWT token',
      })
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Bearer token authorization fallback',
      })
      .addTag('Authentication', 'Authentication & session management (Cookie-based)')
      .addTag('Products', 'Hampers catalog & product management')
      .addTag('Categories', 'Hampers category management')
      .addTag('Settings', 'Business profile & WhatsApp ordering settings')
      .addTag('Dashboard', 'Admin dashboard statistics')
      .addTag('Users', 'Admin account management')
      .addTag('Health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      useGlobalPrefix: true,
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: 2,
        docExpansion: 'list',
      },
    });
  }

  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}/`);
  console.log(`🌍 Environment: ${configService.get<string>('app.env')}\n`);
  if (swaggerEnabled) {
    console.log(`📚 Swagger Documentation on : http://localhost:${port}/api/${swaggerPath}`);
  }
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🏓 Ping endpoint: http://localhost:${port}/ping\n`);
}

bootstrap();
