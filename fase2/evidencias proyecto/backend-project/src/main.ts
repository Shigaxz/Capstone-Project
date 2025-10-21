import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard } from './auth/api-key.guard';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Obtenemos ConfigService para inyectarlo en el Guard global
  const configService = app.get(ConfigService);
  // Configuración global del ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están definidas en el DTO.
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas.
    transform: true, // Transforma el payload a una instancia del DTO.
  }));
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API CITT')
    .setDescription('Documentación de la API para la plataforma digital del CITT')
    .setVersion('1.0')
    .build();
  // El '/api-docs' es la ruta donde se servirá la documentación
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // Aplicar el ApiKeyGuard de forma global a toda la aplicación
  app.useGlobalGuards(new ApiKeyGuard(configService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
