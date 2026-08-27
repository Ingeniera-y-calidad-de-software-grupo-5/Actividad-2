import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend Vite (por defecto puerto 5173 o cualquier origen en dev)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefijo global de API
  app.setGlobalPrefix('api');

  // Validaciones globales de DTOs con transformación automática
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('AmigoGasto API (SplitWise Collab)')
    .setDescription(
      'API REST para la gestión colaborativa y cálculo simplificado de deudas y gastos entre amigos',
    )
    .setVersion('1.0.0')
    .addTag('Usuarios', 'Operaciones con participantes y perfiles')
    .addTag('Grupos', 'Creación y administración de grupos (viajes, casas, eventos)')
    .addTag('Gastos', 'Registro y división de gastos compartidos con splits')
    .addTag('Balances y Liquidación', 'Algoritmo Min Cash Flow y registro de pagos')
    .addTag('Inicialización y Demo', 'Población inicial de datos para pruebas y evaluación')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AmigoGasto API Docs',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 Backend corriendo exitosamente en http://localhost:${port}/api`);
  logger.log(`📖 Documentación Swagger OpenAPI disponible en http://localhost:${port}/api/docs`);
}

bootstrap();
