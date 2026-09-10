import { ValidationPipe, VersioningType, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppReady = false;

server.get('/', (req, res) => {
  res.json({
    message: 'Hamperskue Backend API is running',
    version: '1.0.0',
    docs: '/api/docs',
    endpoints: {
      health: '/api/health',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      settings: '/api/v1/settings',
    },
  });
});

let bootstrapPromise: Promise<void> | null = null;

async function bootstrapServer() {
  if (isAppReady) return;
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

      const configService = app.get(ConfigService);
      const swaggerEnabled = configService.get<boolean>('swagger.enabled');
      const corsOrigin = configService.get<string>('app.corsOrigin');
      const swaggerPath = configService.get<string>('swagger.path') || 'docs';
      const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';

      app.enableCors({
        origin: corsOrigin || '*',
        credentials: true,
      });

      app.use(cookieParser());
      app.setGlobalPrefix(apiPrefix);

      app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
      });

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

      app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

      if (swaggerEnabled) {
        const config = new DocumentBuilder()
          .setTitle('Hamperskue API')
          .setDescription('Backend REST API Documentation for Hamperskue Digital Hampers Catalog MVP.')
          .setVersion('1.0')
          .addCookieAuth('Authentication', {
            type: 'apiKey',
            in: 'cookie',
            name: 'Authentication',
            description: 'HttpOnly Cookie containing JWT token',
          })
          .addBearerAuth()
          .addTag('Authentication')
          .addTag('Products')
          .addTag('Categories')
          .addTag('Settings')
          .addTag('Dashboard')
          .addTag('Users')
          .addTag('Health')
          .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(swaggerPath, app, document, {
          useGlobalPrefix: true,
          swaggerOptions: {
            persistAuthorization: true,
          },
        });
      }

      await app.init();
      isAppReady = true;
    })();
  }
  return bootstrapPromise;
}

async function handler(req: any, res: any) {
  try {
    await bootstrapServer();
    return new Promise((resolve, reject) => {
      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);
      server(req, res);
    });
  } catch (err: any) {
    console.error('Vercel Serverless Function Crash:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        statusCode: 500,
        message: 'Serverless Function Crash',
        error: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }
}

export default handler;
module.exports = handler;
module.exports.default = handler;
