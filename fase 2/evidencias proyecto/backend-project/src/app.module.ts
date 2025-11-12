import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LocationsModule } from './locations/locations.module';
import { SpacesModule } from './spaces/spaces.module';
import { MemoriesModule } from './memories/memories.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
    }),
    ThrottlerModule.forRoot([{
      ttl: 120000, // 2 minutos
      limit: 5,  // 5 peticiones
    }]),
    MongooseModule.forRootAsync({// Conexión asíncrona a MongoDB
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ // Función que retorna la configuración de Mongoose
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          secure: true, // true para 465, false para otros puertos
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASS'),
          },
        },
        defaults: {
          from: '"Reservas CITT" <no-reply@citt.cl>',
        },
        template: {
          dir: join(__dirname, '..', 'templates'), 
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    LocationsModule,
    SpacesModule,
    MemoriesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
