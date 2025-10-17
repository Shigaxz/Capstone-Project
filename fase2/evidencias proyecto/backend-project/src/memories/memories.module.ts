import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { Memory, MemorySchema } from './schemas/memory.schema';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule], // Hacemos que ConfigModule esté disponible dentro de este bloque
      useFactory: async (configService: ConfigService) => {
        const s3 = new S3Client({
          region: configService.get<string>('AWS_REGION')!,
        });
        return {
          storage: multerS3({
            s3: s3,
            bucket: configService.get<string>('AWS_S3_BUCKET_NAME'),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
              cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
              cb(null, `${uuid()}-${file.originalname}`);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MemoriesController],
  providers: [MemoriesService],
})
export class MemoriesModule {}
