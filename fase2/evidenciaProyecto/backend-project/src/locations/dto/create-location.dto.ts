import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Nombre único del lugar (ej: Biblioteca, CITT)',
    example: 'Biblioteca',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Piso donde se encuentra el lugar',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly floor: number;

  @IsArray()
  @IsMongoId({ each: true }) // Valida que cada elemento del array sea un MongoID
  @IsOptional()
  readonly espacioId?: string[];
  
  @ApiProperty({
    description: 'Indica si el lugar está disponible en general. Opcional, por defecto es true.',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;
}
