import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // Comprueba si el valor es un ObjectId válido de MongoDB
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`'${value}' no es un MongoID válido.`);
    }
    return value;
  }
}