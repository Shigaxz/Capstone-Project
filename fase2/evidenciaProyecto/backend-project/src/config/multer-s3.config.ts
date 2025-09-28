import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';

export const multerS3Config = (configService: ConfigService) => {
  const s3 = new S3Client({
    region: configService.get<string>('AWS_REGION')!,
    credentials: {
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
    },
  });

  return {
    storage: multerS3({
      s3: s3,
      bucket: configService.get<string>('AWS_S3_BUCKET_NAME'),
      acl: 'public-read', // Permite que los archivos sean leídos públicamente
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // Genera un nombre de archivo único
        cb(null, `${uuid()}-${file.originalname}`);
      },
    }),
  };
};