import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard } from './auth/api-key.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtenemos ConfigService para inyectarlo en el Guard global
  const configService = app.get(ConfigService);
  // Configuración global del ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están definidas en el DTO.
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas.
    transform: true, // Transforma el payload a una instancia del DTO.
  }));

  // Aplicar el ApiKeyGuard de forma global a toda la aplicación
  app.useGlobalGuards(new ApiKeyGuard(configService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
